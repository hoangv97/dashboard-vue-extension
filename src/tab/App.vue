<template>
    <div>
        <div class="background-container">
            <background-carousel :carouselInterval="settings.backgroundCarousel.interval" :carouselPhotosNumber="settings.backgroundCarousel.photosNumber"></background-carousel>
        </div>
        <transition name="el-fade-in">
            <el-container v-show="settings.isShowContent">
                <el-main class="main">
                    <el-row :gutter="10">
                        <el-col :span="7">
                            <top-sites :cardOpacity="settings.topSites.cardOpacity" :limit="settings.topSites.limit"></top-sites>
                        </el-col>
                        <el-col :span="7">
                            <reminder :cardOpacity="settings.reminder.cardOpacity"></reminder>
                        </el-col>
                        <el-col :span="10">
                            <goodreads :cardOpacity="settings.goodreads.cardOpacity" :carouselInterval="settings.goodreads.carouselInterval"></goodreads>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10" style="margin-top: 10px">
                        <el-col :span="18">
                            <news :cardOpacity="settings.news.cardOpacity"></news>
                        </el-col>
                    </el-row>
                </el-main>
            </el-container>
        </transition>
        <el-button class="toggle-content-btn" icon="el-icon-view" circle @click="toggleContent()"></el-button>
    </div>
</template>

<script>
import {Container, Main, Row, Col, Button} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/base.css'
// import 'element-theme-dark'

import BackgroundCarousel from './components/BackgroundCarousel'
import TopSites from './components/TopSites'
import Reminder from './components/Reminder'
import Goodreads from './components/Goodreads'
import News from './components/News'

const DEFAULT_SETTINGS = {
    isShowContent: false,
    backgroundCarousel: {
        interval: 15 * 1000,
        photosNumber: 3,
    },
    topSites: {
        limit: 10,
        cardOpacity: 0.85,
    },
    reminder: {
        cardOpacity: 0.85,
    },
    goodreads: {
        carouselInterval: 10 * 1000,
        cardOpacity: 0.9,
    },
    news: {
        cardOpacity: 0.9,
    }
}
const SETTINGS_STORAGE_KEY = 'settings'

export default {
    components: {
        [Container.name]: Container,
        [Main.name]: Main,
        [Row.name]: Row,
        [Col.name]: Col,
        [Button.name]: Button,

        BackgroundCarousel,
        TopSites,
        Reminder,
        Goodreads,
        News,
    },
    data () {
        return {
            settings: this.$helpers.getLocalStorage(SETTINGS_STORAGE_KEY, DEFAULT_SETTINGS),
        }
    },
    methods: {
        toggleContent() {
            this.settings.isShowContent = !this.settings.isShowContent
        },
    },
    watch: {
        settings: {
            handler: function(newSettings) {
                // console.log(newSettings)
                this.$helpers.setLocalStorage(SETTINGS_STORAGE_KEY, newSettings)
            },
            deep: true,
        }
    },
}
</script>

<style lang="stylus" scoped>
.background-container
    position fixed
    width 100%

.toggle-content-btn
    position fixed
    top 0
    right 0
    background transparent
    border-color transparent
    z-index 999

.main
    padding 25px 5%
    max-height calc(100vh - 30px)
</style>