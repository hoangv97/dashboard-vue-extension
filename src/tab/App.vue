<template>
    <div>
        <div class="background-container">
            <background-carousel></background-carousel>
        </div>
        <el-container v-if="isShowContent">
            <el-main class="main">
                <el-row>
                    <el-col :span="10" :offset="2">
                        <top-sites :cardOpacity="cardOpacity"></top-sites>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
        <el-button class="toggle-content-btn" icon="el-icon-view" circle @click="toggleContent()"></el-button>
    </div>
</template>

<script>
import {Container, Main, Row, Col, Button} from 'element-ui'
import BackgroundCarousel from './components/BackgroundCarousel'
import TopSites from './components/TopSites'
export default {
    components: {
        [Container.name]: Container,
        [Main.name]: Main,
        [Row.name]: Row,
        [Col.name]: Col,
        [Button.name]: Button,

        BackgroundCarousel,
        TopSites,
    },
    data () {
        return {
            isShowContent: true,
            cardOpacity: 0.85,
        }
    },
    methods: {
        toggleContent() {
            this.isShowContent = !this.isShowContent
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
    padding-top 25px
</style>