<template>
    <el-card :body-style="{ padding: '0px' }">
        <el-image :src="article.urlToImage" fit="cover" style="width: 100%"></el-image>
        <div class="wrapper">
            <el-link :underline="false" :href="article.url">{{ article.title }}</el-link>
            <div class="bottom clearfix">
                <div class="desc" v-html="article.description ? article.description : article.content"></div>
                <div class="time">
                    {{ article.source.name }} <span v-if="article.author"> - <span v-html="article.author"></span></span> - {{ article.publishedAt | time }}
                </div>
            </div>
        </div>
    </el-card>
</template>

<script>
import {Card, Button, Badge, Link, Image, Row, Col} from 'element-ui'

export default {
    components: {
        [Card.name]: Card,
        [Button.name]: Button,
        [Badge.name]: Badge,
        [Link.name]: Link,
        [Image.name]: Image,
        [Row.name]: Row,
        [Col.name]: Col,
    },
    data () {
        return {
        }
    },
    props: {
        article: Object,
    },
    mounted() {
    },
    methods: {
    },
    filters: {
        time: function (value) {
            if (!value) return ''
            return (new Date(value)).toUTCString()
        },
    }
}
</script>

<style lang="stylus" scoped>
.wrapper
    padding 10px 14px

.bottom
    margin-top 10px

.clearfix
    &:before,
    &:after
        display table
        content ""
  
    &:after
        clear both

.time
    color #909399
    margin-top 5px

</style>