<template>
    <el-card shadow="hover" :style="{opacity: cardOpacity}">
        <el-row gutter="10">
            <el-col :span="2" v-for="(site, i) in sites" :key="i">
                <el-link :href="site.url" :underline="false" :title="site | fullTitle">
                    <el-card :body-style="{ padding: '0px', 'max-width': '200px', 'max-height': '24px' }">
                        <el-image :src="'chrome://favicon/size/24@1px/' + site.url" style="width: 24px; height: 24px" fit="fit"></el-image>
                        <span class="title">{{ site.title }}</span>
                    </el-card>
                </el-link>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
import {Card, Link, Row, Col, Image} from 'element-ui'
export default {
    components: {
        [Card.name]: Card,
        [Link.name]: Link,
        [Row.name]: Row,
        [Col.name]: Col,
        [Image.name]: Image,
    },
    data () {
        return {
            sites: [],
            folderDict: {},
        }
    },
    props: ['cardOpacity'],
    mounted() {
        this.getTree()
    },
    methods: {
        getTree() {
            let scanTree = (bookmarks) => {
                bookmarks.forEach((bookmark) => {
                    // console.log(bookmark, this.folderDict)
                    if (bookmark.children) {
                        this.folderDict[bookmark['id']] = bookmark['title']
                        scanTree(bookmark.children)
                    } else {
                        if (bookmark['parentId']) {
                            let parentTitle = this.folderDict[parseInt(bookmark['parentId'])]
                            if (!['Bookmarks'].includes(parentTitle)) {
                                bookmark['parentTitle'] = parentTitle
                            }
                        }
                        this.sites.push(bookmark)
                    }
                })
            }

            chrome.bookmarks.getTree((bookmarks) => {
                scanTree(bookmarks)
            })
        },
    },
    filters: {
        fullTitle: function(value) {
            return (value.parentTitle ? (value.parentTitle + ' - ') : '') + value.title
        }
    }
}
</script>

<style lang="stylus" scoped>

</style>