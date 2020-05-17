<template>
    <el-card shadow="hover" :style="{opacity: cardOpacity}">
        <!-- <div slot="header">
            <el-link :underline="false" href="https://goodreads.com/">Goodreads</el-link>
        </div> -->
        <el-tabs v-model="activeShelfName">
            <el-tab-pane v-for="shelf in shelves" :key="shelf.name" :name="shelf.name">
                <span slot="label">
                    <el-badge :value="shelf.books.length" :hidden="!shelf.books.length" :type="shelf.badgeType" class="badge">
                        {{ shelf.title }}
                    </el-badge>
                </span>
                <el-carousel trigger="click" arrow="always" :interval="carouselInterval" type="card" indicator-position="none">
                    <el-carousel-item v-for="book in shelf.books" :key="book.id._">
                        <div :style="{'background-image': `url('${book.image_url}')`}" class="book-item" :title="book.title" @click="goToBook(book)">
                            
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </el-tab-pane>
        </el-tabs>
    </el-card>
</template>

<script>
import axios from 'axios'
import {parseString} from 'xml2js'
import {Card, Carousel, CarouselItem, Button, Badge, Link, Tabs, TabPane} from 'element-ui'

const GOODREADS_API = 'tFFBeLiw5tR7nxFMcA'
const GOODREADS_USER_ID = '48069604'

export default {
    components: {
        [Card.name]: Card,
        [Carousel.name]: Carousel,
        [CarouselItem.name]: CarouselItem,
        [Button.name]: Button,
        [Badge.name]: Badge,
        [Link.name]: Link,
        [Tabs.name]: Tabs,
        [TabPane.name]: TabPane,
    },
    data () {
        return {
            shelves: [
                {
                    name: 'to-read',
                    title: 'To Read',
                    books: [],
                    badgeType: 'warning',
                },
                {
                    name: 'currently-reading',
                    title: 'Current Reading',
                    books: [],
                    badgeType: 'danger',
                },
                {
                    name: 'read',
                    title: 'Read',
                    books: [],
                    badgeType: 'success',
                },
            ],
            activeShelfName: 'currently-reading',
        }
    },
    props: ['cardOpacity', 'carouselInterval'],
    mounted() {
        for (let shelf of this.shelves) {
            setTimeout(() => {
                this.getShelf(shelf.name)
            }, shelf.name === this.activeShelfName ? 100 : 2500) // load active shelf first, others later
        }
    },
    methods: {
        getShelf(shelfName) {
            axios.get(`https://cors-anywhere.herokuapp.com/https://www.goodreads.com/review/list/${GOODREADS_USER_ID}.xml?shelf=${shelfName}&per_page=200&key=${GOODREADS_API}&v=2`)
                .then(res => {
                    // console.log(res)
                    parseString(res.data, {trim: true, explicitArray: false}, (err, result) => {
                        // console.log(result)
                        let books = result.GoodreadsResponse.reviews.review.map(r => r.book)
                        console.log(books)
                        let shelfId = this.shelves.findIndex(s => s.name === shelfName)
                        if (shelfId >= 0) {
                            this.shelves[shelfId].books = books
                        }
                    })
                })
        },
        goToBook(book) {
            // window.location.href = book.link
        }
    },
}
</script>

<style lang="stylus" scoped>
.badge >>> .el-badge__content
    top 10px

.book-item
    height 100%
    background-size cover
</style>