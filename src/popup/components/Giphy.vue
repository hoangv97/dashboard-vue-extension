<template>
    <a :href="image.source" target="blank"><img :src="image.src" alt=""></a>
</template>

<script>
import axios from 'axios'

const GIPHY_API = '6mlq70APvD72Bm77rqmkVrmttclKv9JU'
const GIPHY_TAGS = [
    'cat', 'dog',
]

export default {
    components: {
    },
    data () {
        return {
            image: {
                src: '',
                source: '',
            }
        }
    },
    props: [],
    mounted() {
        this.getRandomGif(this.random(GIPHY_TAGS))
    },
    methods: {
        getRandomGif(tag) {
            axios.get(`https://api.giphy.com/v1/gifs/random?api_key=${GIPHY_API}&tag=${tag}`)
                .then(res => {
                    console.log(res)
                    let data = res.data.data
                    this.image.src = data.image_url
                    this.image.source = data.source
                })
        },
        random(array) {
            return array[Math.floor(Math.random() * array.length)]
        }
    },
}
</script>

<style lang="stylus" scoped>

</style>