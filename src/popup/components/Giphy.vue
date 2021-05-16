<template>
    <div>
        <a :href="image.source" target="blank">
            <img :src="image.src" alt="">
        </a>
        <div>
            <el-button @click="load" type="text" :disabled="loading">
                {{ loading ? 'Loading' : 'Reload' }}
            </el-button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { Button } from 'element-ui'

const GIPHY_API = '6mlq70APvD72Bm77rqmkVrmttclKv9JU'

export default {
    components: {
        [Button.name]: Button,
    },
    data () {
        return {
            tagList: [],
            image: {
                src: '',
                source: '',
            },
            loading: false,
        }
    },
    props: {
        tags: {
            type: String,
            required: true,
        },
    },
    mounted() {
        this.tagList = this.tags.split(',')
        this.load()
    },
    methods: {
        getRandomGif(tag) {
            this.loading = true
            axios.get(`https://api.giphy.com/v1/gifs/random?api_key=${GIPHY_API}&tag=${tag}`)
                .then(res => {
                    // console.log(res)
                    let data = res.data.data
                    this.image = {
                        src: data.image_url,
                        source: data.source,
                    }
                    this.loading = false
                })
        },
        random(array) {
            return array[Math.floor(Math.random() * array.length)]
        },
        load() {
            this.getRandomGif(this.random(this.tagList))
        },
    },
}
</script>

<style lang="stylus" scoped>

</style>