<template>
    <el-carousel trigger="click" arrow="never" :interval="carouselInterval">
        <el-carousel-item v-for="photo in photos" :key="photo.id">
            <div :style="{'background-image': `url('${photo._url}')`}" class="img">
                <el-button class="dl-btn" icon="el-icon-download" circle @click="download(photo._download_url)"></el-button>
            </div>
        </el-carousel-item>
    </el-carousel>
</template>

<script>
import axios from 'axios'
import {Carousel, CarouselItem, Button} from 'element-ui'
export default {
    data () {
        return {
            photos: [],
            UNSPLASH_IDS: [
                '49fdec799b581c290ed5c334dcf2f08f8e0df568ecaa0ac9fd132da4c86ff2cc',
                '8a959ea115a3f08fcc08c334fa5edcb276153610a5eda71a3a678ae62fec1bff'
            ],
        }
    },
    components: {
        [Carousel.name]: Carousel,
        [CarouselItem.name]: CarouselItem,
        [Button.name]: Button,
    },
    props: ['carouselInterval', 'carouselPhotosNumber', 'cacheTimeout'],
    mounted() {
        this.getRandomPhotos(this.carouselPhotosNumber)
    },
    methods: {
        setBackground(result) {
            this.photos = result.data.map(d => {
                d._url = d.urls.regular
                d._download_url = `${d.links.download}?force=true`
                return d
            })
        },
        /*
        Unsplash API            
        Get random photos
        */
        getRandomPhotos(number, KEY_ID) {
            let cacheKey = 'bgCarousel'
            let cacheTimeout = this.cacheTimeout || 1000
            let result = this.$helpers.getLocalStorage(cacheKey)
            if (result) {
                this.setBackground(result)
            } else {
                if (!KEY_ID && this.UNSPLASH_IDS) {
                    KEY_ID = this.UNSPLASH_IDS[1]
                }
                axios.get(`https://api.unsplash.com/photos/random?client_id=${KEY_ID}&orientation=landscape&count=${number}`)
                    .then(res => {
                        // console.log(res)
                        this.setBackground(res)
                        this.$helpers.setLocalStorage(cacheKey, res, cacheTimeout)
                    })
            }
        },

        download(url) {
            let link = document.createElement('a')
            link.href = url
            link.download = ''
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        },
    }
}
</script>

<style lang="stylus" scoped>
.el-carousel
    height 100vh

    .el-carousel__item
        height 100vh
        
        .img
            width 100%
            height 100%
            background-size cover
        
        .dl-btn
            background transparent
            border-color transparent
            z-index 999
</style>