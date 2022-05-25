<template>
  <el-carousel trigger="click" arrow="never" :interval="carouselInterval">
    <el-carousel-item v-for="photo in photos" :key="photo.id">
      <div :style="{ 'background-image': `url('${photo._url}')` }" class="img">
        <el-button
          class="link-btn"
          icon="el-icon-picture"
          circle
          @click="openWindow(photo.links.html)"
        ></el-button>
      </div>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
import axios from 'axios';
import { Carousel, CarouselItem, Button } from 'element-ui';

const { UNSPLASH_ID } = process.env;

export default {
  data() {
    return {
      photos: [],
    };
  },
  components: {
    [Carousel.name]: Carousel,
    [CarouselItem.name]: CarouselItem,
    [Button.name]: Button,
  },
  props: ['carouselInterval', 'carouselPhotosNumber', 'cacheTimeout'],
  mounted() {
    this.getRandomPhotos(this.carouselPhotosNumber);
  },
  methods: {
    setBackground(result) {
      this.photos = result.data.map((d) => {
        d._url = d.urls.regular;
        d._download_url = `${d.links.download}?force=true`;
        return d;
      });
    },
    /*
      Unsplash API    
      Get random photos
      */
    getRandomPhotos(number) {
      let cacheKey = 'bgCarousel';
      let cacheTimeout = this.cacheTimeout || 1000;
      let result = this.$helpers.getLocalStorage(cacheKey);
      if (result) {
        this.setBackground(result);
      } else {
        axios
          .get(
            `https://api.unsplash.com/photos/random?client_id=${UNSPLASH_ID}&orientation=landscape&count=${number}`
          )
          .then((res) => {
            // console.log(res)
            this.setBackground(res);
            this.$helpers.setLocalStorage(cacheKey, res, cacheTimeout);
          });
      }
    },

    download(url) {
      let link = document.createElement('a');
      link.href = url;
      link.download = '';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    openWindow(url) {
      window.open(url, '_blank');
    },
  },
};
</script>

<style lang="stylus" scoped>
.el-carousel
  height 100vh

  .el-carousel__item
    height 100vh

    .img
      width 100%
      height 100%
      background-size cover

    .link-btn
      background transparent
      border-color transparent
      position absolute
</style>
