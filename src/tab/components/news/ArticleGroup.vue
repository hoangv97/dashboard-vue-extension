<template>
    <el-row :gutter="10">
        <el-col :span="24 / cols" v-for="(articleList, i) in articleGroup" :key="i">
            <article-item v-for="(article, j) in articleList" :key="j" :article="article" style="margin-bottom: 10px"></article-item>
        </el-col>
    </el-row>
</template>

<script>
import {Row, Col} from 'element-ui'
import ArticleItem from './Article'

export default {
    components: {
        [Row.name]: Row,
        [Col.name]: Col,

        ArticleItem,
    },
    data () {
        return {
            
        }
    },
    props: ['articles', 'cols'],
    mounted() {
    },
    methods: {
    },
    computed: {
        articleGroup: function() {
            let group = []
            for (let i = 0; i < this.cols; i++) {
                group.push([])
            }

            for (let i = 0; i < this.articles.length; i++) {
                group[i % this.cols].push(this.articles[i])
            }

            return group
        },
    },
}
</script>

<style lang="stylus" scoped>
</style>