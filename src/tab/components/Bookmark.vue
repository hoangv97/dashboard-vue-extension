<template>
    <el-card shadow="hover" :style="{opacity: cardOpacity}">
        <div v-for="(folder, i) in folders" :key="i">
            <el-divider content-position="left">
                <div :class="{'folder-title': canToggleFolder(i)}" class="noselect" @click="toggleFolder(i)">{{ folder.title }}</div>
            </el-divider>
            <el-collapse-transition>
                <el-row :gutter="10" v-show="folder.show">
                    <el-col :span="3" v-for="(site, j) in folder.sites" :key="j" style="text-align: center">
                        <a :href="site.url" :title="site.title">
                            <el-card :body-style="{ padding: '2px 1px' }" shadow="hover">
                                <el-image :src="'chrome://favicon/size/' + faviconSize + '@1px/' + site.url" :style="{'min-height': faviconSize + 'px'}" fit="fit"></el-image>
                                <el-button type="text" size="mini">{{ site.title }}</el-button>
                            </el-card>
                        </a>
                    </el-col>
                </el-row>
            </el-collapse-transition>
        </div>
    </el-card>
</template>

<script>
import {Card, Link, Row, Col, Image, Button, Divider} from 'element-ui'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';

export default {
    components: {
        [Card.name]: Card,
        [Link.name]: Link,
        [Row.name]: Row,
        [Col.name]: Col,
        [Image.name]: Image,
        [Button.name]: Button,
        [Divider.name]: Divider,
        [CollapseTransition.name]: CollapseTransition,
    },
    data () {
        return {
            folders: [],
            faviconSize: 24,
            alwaysShowFolderNames: ['Top Sites', "Bookmarks"]
        }
    },
    props: {
        cardOpacity: Number,
    },
    mounted() {
        this.getTree()
    },
    methods: {
        getTree() {
            let scanTree = (bookmarks) => {
                bookmarks.forEach((bookmark) => {
                    // console.log(bookmark, this.folderDict)
                    if (bookmark.children) {
                        let fid = this.folders.findIndex(i => i.id === bookmark.id)
                        if (fid === -1) {
                            this.folders.push({
                                id: bookmark.id,
                                title: bookmark.title,
                                show: true,
                                sites: [],
                            })
                        }
                        scanTree(bookmark.children)
                    } else {
                        let fid = this.folders.findIndex(i => i.id === bookmark.parentId)
                        if (fid !== -1) {
                            this.folders[fid].sites.push(bookmark)
                        }
                    }
                })
            }

            chrome.bookmarks.getTree((bookmarks) => {
                scanTree(bookmarks)

                chrome.topSites.get(results => {
                    this.folders.unshift({
                        id: 100,
                        title: 'Top Sites',
                        show: true,
                        sites: results,
                    })
                    
                    this.folders = this.folders.filter(f => f.sites.length)
                })
            })
        },
        toggleFolder(i) {
            if (!this.canToggleFolder(i)) {
                return
            }
            this.folders[i].show = !this.folders[i].show
        },
        canToggleFolder(i) {
            return !this.alwaysShowFolderNames.includes(this.folders[i].title)
        },
    },
}
</script>

<style lang="stylus" scoped>
.el-divider--horizontal
    margin 20px 0

.folder-title
    cursor pointer

.noselect 
    -webkit-touch-callout none
    -webkit-user-select none
    -khtml-user-select none
    -moz-user-select none
    -ms-user-select none
    user-select none

.el-col
    margin-bottom 3px
</style>