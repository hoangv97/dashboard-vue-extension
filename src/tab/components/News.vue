<template>
    <el-card shadow="hover" :style="{opacity: cardOpacity}">
        <!-- <div slot="header">
            <span>News</span>
        </div> -->
        <el-tabs v-model="activeCategoryName">
            <el-tab-pane v-for="category in categories" :key="category.name" :name="category.name">
                <span slot="label">
                    {{ category.name | capitalize }}
                </span>
                <el-collapse v-model="category.activeTitles">
                    <el-collapse-item v-for="article in category.articles" :key="article.url" :name="article.title" class="article">
                        <template slot="title">
                            <el-link :underline="false" :title="article.title">{{ article.title }}</el-link>
                        </template>
                        <el-row :gutter="10">
                            <el-col :span="4">
                                <el-image :src="article.urlToImage" fit="cover" style="width: 100%"></el-image>
                            </el-col>
                            <el-col :span="20">
                                <div v-html="article.description ? article.description : article.content"></div>
                                <div style="color: #909399">{{ article.source.name }} <span v-if="article.author"> - <span v-html="article.author"></span></span> - {{ article.publishedAt | time }}</div>
                                <el-link :underline="false" :href="article.url">Read more<i class="el-icon-arrow-right el-icon--right"></i> </el-link>
                            </el-col>
                        </el-row>
                    </el-collapse-item>
                </el-collapse>
            </el-tab-pane>
        </el-tabs>
    </el-card>
</template>

<script>
import axios from 'axios'
import {Card, Button, Badge, Link, Tabs, TabPane, Collapse, CollapseItem, Image, Row, Col} from 'element-ui'

const NEWSAPI_KEY = '09875061c8604df6ad93566a4e876305'
const NEWSAPI_CATEGORIES = ['general', 'business', 'technology', 'entertainment', 'health', 'science', 'sports',]
const NEWSAPI_COUNTRY = 'us'

export default {
    components: {
        [Card.name]: Card,
        [Button.name]: Button,
        [Badge.name]: Badge,
        [Link.name]: Link,
        [Tabs.name]: Tabs,
        [TabPane.name]: TabPane,
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem,
        [Image.name]: Image,
        [Row.name]: Row,
        [Col.name]: Col,
    },
    data () {
        return {
            categories: NEWSAPI_CATEGORIES.map(c => ({
                name: c,
                articles: [],
                activeTitles: [], // used to open all collapse items
            })),
            activeCategoryName: NEWSAPI_CATEGORIES[0],
        }
    },
    props: ['cardOpacity', 'cacheTimeout'],
    mounted() {
        for (let category of this.categories) {
            setTimeout(() => {
                this.getTopHeadlines(category.name)
            }, category === this.activeCategoryName ? 100 : 1500) // load active category first, others later
        }
    },
    methods: {
        setArticlesToCategory(categoryName, result) {
            let categoryId = this.categories.findIndex(s => s.name === categoryName)
            if (categoryId >= 0) {
                this.categories[categoryId].articles = result.data.articles
                this.categories[categoryId].activeTitles = this.categories[categoryId].articles.map(a => a.title)
            }
        },
        getTopHeadlines(categoryName) {
            let cacheKey = 'news_top-headlines_' + categoryName
            let cacheTimeout = this.cacheTimeout || 1000
            let result = this.$helpers.getLocalStorage(cacheKey)
            if (result) {
                this.setArticlesToCategory(categoryName, result)
            } else {
                axios.get(`https://newsapi.org/v2/top-headlines?country=${NEWSAPI_COUNTRY}&category=${categoryName}&apiKey=${NEWSAPI_KEY}`)
                    .then(res => {
                        // console.log(res)
                        this.setArticlesToCategory(categoryName, res)
                        this.$helpers.setLocalStorage(cacheKey, res, cacheTimeout)
                    })
            }
        }
    },
    filters: {
        capitalize: function (value) {
            if (!value) return ''
            value = value.toString()
            return value.charAt(0).toUpperCase() + value.slice(1)
        },
        time: function (value) {
            if (!value) return ''
            return (new Date(value)).toUTCString()
        },
    }
}
</script>

<style lang="stylus" scoped>
.article >>> .el-link--inner
    max-height 48px
    overflow-y hidden
</style>