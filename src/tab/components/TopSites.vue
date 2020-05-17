<template>
    <el-card shadow="hover" :style="{opacity: cardOpacity}">
        <!-- <div slot="header">
            <span>Top Sites</span>
        </div> -->
        <div v-for="site in sites" :key="site.url" class="site-item">
            <el-link :href="site.url" :underline="false">{{ site.title }}</el-link>
        </div>
    </el-card>
</template>

<script>
import {Card, Link} from 'element-ui'
export default {
    components: {
        [Card.name]: Card,
        [Link.name]: Link,
    },
    data () {
        return {
            sites: [],
        }
    },
    props: ['cardOpacity', 'limit'],
    mounted() {
        this.getTopSites()
    },
    methods: {
        getTopSites() {
            chrome.topSites.get(results => {
                console.log(results)
                this.sites = results.filter(s => !s.url.includes('localhost'))
                    .slice(0, this.limit)
            })
        },
    },
}
</script>

<style lang="stylus" scoped>
.site-item
    margin-bottom 5px
</style>