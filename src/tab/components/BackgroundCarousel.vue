<template>
    <el-carousel trigger="click" arrow="never" :interval="30000">
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
            RANDOM_PHOTOS_NUMBER: 3,
        }
    },
    components: {
        [Carousel.name]: Carousel,
        [CarouselItem.name]: CarouselItem,
        [Button.name]: Button,
    },
    mounted() {
        this.getRandomPhotos(this.RANDOM_PHOTOS_NUMBER)
    },
    methods: {
        /*
        Unsplash API            
        Get random photos
        */
        getRandomPhotos(number, KEY_ID) {
            if (!KEY_ID && this.UNSPLASH_IDS) {
                KEY_ID = this.UNSPLASH_IDS[1]
            }
            axios.get(`https://api.unsplash.com/photos/random?client_id=${KEY_ID}&orientation=landscape&count=${number}`)
                .then(res => {
                    console.log(res)
                    this.photos = res.data.map(d => {
                        d._url = d.urls.regular
                        d._download_url = `${d.links.download}?force=true`
                        return d
                    })
                })
        },

        /*
        get user's liked photos
        order_by: latest, oldest, popular
        */
        getLikedPhotos(page = 1, per_page = 10, order_by = 'lastest', KEY_ID) {
            if (!KEY_ID && this.UNSPLASH_IDS) {
                KEY_ID = this.UNSPLASH_IDS[0]
            }
            axios.get(`https://api.unsplash.com/users/viethoang212/likes?client_id=${KEY_ID}&page=${page}&per_page=${per_page}&order_by=${order_by}`)
                .then(res => {
                    console.log(res)
                })
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