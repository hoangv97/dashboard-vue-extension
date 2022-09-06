<template>
  <div>
    <div class="background-container">
      <background-carousel
        :carouselInterval="settings.backgroundCarousel.interval"
        :carouselPhotosNumber="settings.backgroundCarousel.photosNumber"
        :cacheTimeout="settings.backgroundCarousel.cacheTimeout"
      ></background-carousel>
    </div>
    <transition name="el-fade-in">
      <el-container v-show="settings.isShowContent">
        <el-main class="main">
          <el-row :gutter="10">
            <el-col :span="9">
              <div>
                <bookmark
                  :cardOpacity="settings.bookmark.cardOpacity"
                  :cardMaxHeight="settings.bookmark.cardMaxHeight"
                ></bookmark>
              </div>
              <div>
                <goodreads
                  :cardOpacity="settings.goodreads.cardOpacity"
                  :carouselInterval="settings.goodreads.carouselInterval"
                  :cacheTimeout="settings.goodreads.cacheTimeout"
                ></goodreads>
              </div>
            </el-col>
            <el-col :span="15">
              <div>
                <notes :cardOpacity="settings.notes.cardOpacity"></notes>
              </div>
              <div>
                <coin
                  :cardOpacity="settings.coin.cardOpacity"
                  :cacheTimeout="settings.coin.cacheTimeout"
                  @selectCoin="onSelectCoin"
                ></coin>
              </div>
              <div>
                <news
                  :cardOpacity="settings.news.cardOpacity"
                  :cacheTimeout="settings.news.cacheTimeout"
                ></news>
              </div>
              <!-- <div>
                <custom-news
                  :cardOpacity="settings.customNews.cardOpacity"
                ></custom-news>
              </div> -->
              <div>
                <script-executor
                  :cardOpacity="settings.scriptExecutor.cardOpacity"
                ></script-executor>
              </div>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </transition>
    <el-button
      class="left-btn settings-btn"
      icon="el-icon-s-operation"
      circle
      @click="drawer = true"
    ></el-button>
    <el-button
      class="left-btn view-btn"
      icon="el-icon-view"
      circle
      @click="toggleContent()"
    ></el-button>
    <coin-dialog
      :coin="selectedCoin"
      :visible="coinDialogVisible"
    ></coin-dialog>
    <el-drawer title="Settings" :visible.sync="drawer"> </el-drawer>
  </div>
</template>

<script>
import { Container, Main, Row, Col, Button, Drawer } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/base.css';
// import 'element-theme-dark'
import './css/dark.css';
import './css/styles.css';

import BackgroundCarousel from './components/BackgroundCarousel';
import Bookmark from './components/Bookmark';
import TopSites from './components/TopSites';
import Reminder from './components/Reminder';
import Goodreads from './components/Goodreads';
import News from './components/news';
import CustomNews from './components/news/Custom';
import ScriptExecutor from './components/script_executor';
import Notes from './components/notes';
import Coin from './components/coin';
import CoinDialog from './components/coin/Dialog.vue';

import helper from './lib/helper';
import { DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY } from './lib/settings';

export default {
  components: {
    [Container.name]: Container,
    [Main.name]: Main,
    [Row.name]: Row,
    [Col.name]: Col,
    [Button.name]: Button,
    [Drawer.name]: Drawer,

    BackgroundCarousel,
    Bookmark,
    TopSites,
    Reminder,
    Goodreads,
    News,
    CustomNews,
    ScriptExecutor,
    Coin,
    CoinDialog,
    Notes,
  },
  data() {
    return {
      drawer: false,
      settings: DEFAULT_SETTINGS,
      coinDialogVisible: false,
      selectedCoin: {},
    };
  },
  mounted() {
    this.settings = helper.getLocalStorage(
      SETTINGS_STORAGE_KEY,
      DEFAULT_SETTINGS
    );
  },
  methods: {
    toggleContent() {
      this.settings.isShowContent = !this.settings.isShowContent;
    },
    onSelectCoin(coin) {
      this.selectedCoin = coin;
      this.coinDialogVisible = true;
    },
  },
  watch: {
    settings: {
      handler: function(newSettings) {
        // console.log(newSettings)
        helper.setLocalStorage(SETTINGS_STORAGE_KEY, newSettings);
      },
      deep: true,
    },
  },
};
</script>

<style lang="stylus" scoped>
.background-container
  position fixed
  width 100%

.left-btn
  position fixed
  top 0
  right 0
  background transparent
  border-color transparent
  z-index 999

.view-btn
  top 40px

.main
  padding 10px 3%
  max-height calc(100vh - 10px)

>>> .el-col
  > div
    margin-top 10px

  > div:first-child
    margin-top 0
</style>
