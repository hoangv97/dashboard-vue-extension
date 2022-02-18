<template>
    <el-card :style="{opacity: cardOpacity}">
        <el-row>
          <el-button v-for="source, i in sources" :key="i" size="small" round @click="selectSource(i)" :type="i === selectedId ? 'primary' : ''">{{ source.name }}</el-button>
        </el-row>
        <div style="min-height: 200px">
            <p v-for="item, i in items" :key="i">
                <el-link :underline="false" :href="item.url">{{ item.title }}</el-link>
            </p>
            <el-button v-if="items.length" :disabled="loadingMore" type="text" @click="loadMore()">Load more</el-button>
        </div>
    </el-card>
</template>

<script>
import axios from 'axios'
import {Card, Button, Badge, Link, Tabs, TabPane, Collapse, CollapseItem, Image, Row, Col, Input} from 'element-ui'

const API_URL_PREFIX = 'https://my-django-dsgkvjkyfa-as.a.run.app/api/v1/dashboard/'
const API_ACCESS_TOKEN = 'e28c7c23nsdhx87d32xd92x239dh23d87238x72'

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
        [Input.name]: Input,
    },
    data () {
        return {
            sources: [],
            items: [],
            selectedId: -1,
            itemsLimit: 10,
            loadingMore: false,
        }
    },
    props: ['cardOpacity'],
    mounted() {
        this.getSources()
    },
    methods: {
        getApiHeaders() {
            return {
                Authorization: API_ACCESS_TOKEN,
            }
        },
        async getSources() {
            const cacheTimeout = 60 * 60 * 1000
            this.sources = await this.$helpers.getApi(`${API_URL_PREFIX}news/`, this.getApiHeaders(), {}, cacheTimeout)
            if (this.sources.length) {
                this.selectSource(0)
            }
        },
        async getSourceItems(sourceUrl, skip = 0) {
            const cacheTimeout = 30 * 60 * 1000
            const items = await this.$helpers.getApi(`${API_URL_PREFIX}news/items/`, this.getApiHeaders(), {source_url: sourceUrl, limit: this.itemsLimit, skip}, cacheTimeout)
            return items
        },
        async selectSource(i) {
            if (this.selectedId !== i) {
                this.selectedId = i
                this.items = []
                this.items = await this.getSourceItems(this.sources[i].url)
            }
        },
        async loadMore() {
            const skip = this.items.length
            this.loadingMore = true
            const result = await this.getSourceItems(this.sources[this.selectedId].url, skip)
            this.loadingMore = false
            this.items = this.items.concat(result)
        }
    },
}
</script>

<style lang="stylus" scoped>
</style>