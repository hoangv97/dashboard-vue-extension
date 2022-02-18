<template>
  <el-dialog
    :title="`${coin.name} (${coin.symbol})`"
    :visible.sync="visible"
    width="30%"
  >
    <div
      v-for="time in changes"
      :key="time"
      class="change"
      :class="{
        success: priceChange(time) > 0,
        info: priceChange(time) === 0,
        danger: priceChange(time) < 0,
      }"
    >
      {{ time }}: {{ priceChange(time) }}%
    </div>
    <div style="margin-top: 10px">
      <el-link
        type="primary"
        :href="`https://coinmarketcap.com/vi/currencies/${coin.slug}/`"
        target="_blank"
      >
        CoinMarketCap
      </el-link>
    </div>
    <div style="margin-top: 10px">
      Last updated: {{ new Date(coin.quote.USD.last_updated).toLocaleString() }}
    </div>
    <div style="margin-top: 10px">
      <el-button type="text" @click="bookmark">
        {{ isBookmarked ? 'Remove bookmark' : 'Bookmark' }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Dialog, Link, Button } from 'element-ui';
import { BOOKMARKED_COINS_CACHE_KEY } from './config';

export default {
  components: {
    [Dialog.name]: Dialog,
    [Link.name]: Link,
    [Button.name]: Button,
  },
  data() {
    return {
      changes: ['1h', '24h', '7d', '30d', '60d', '90d'],
      isBookmarked: false,
    };
  },
  props: ['coin', 'visible'],
  mounted() {
    this.checkBookmark();
  },
  methods: {
    priceChange(time) {
      return this.coin.quote.USD[`percent_change_${time}`].toFixed(0);
    },
    bookmark() {
      let bookmarkedCoins = this.$helpers.getLocalStorage(
        BOOKMARKED_COINS_CACHE_KEY,
        []
      );
      console.log(bookmarkedCoins);
      const savedCoin = this.coin.name;
      if (bookmarkedCoins.includes(savedCoin)) {
        bookmarkedCoins = bookmarkedCoins.filter((c) => c !== savedCoin);
        this.isBookmarked = false;
      } else {
        bookmarkedCoins.push(savedCoin);
        this.isBookmarked = true;
      }
      this.$helpers.setLocalStorage(
        BOOKMARKED_COINS_CACHE_KEY,
        bookmarkedCoins
      );
    },
    checkBookmark() {
      this.isBookmarked = this.$helpers
        .getLocalStorage(BOOKMARKED_COINS_CACHE_KEY, [])
        .includes(this.coin.name);
    },
  },
  watch: {
    visible: {
      handler: function(newVal) {
        this.checkBookmark();
      },
      deep: true,
    },
  },
};
</script>

<style lang="stylus" scoped>
.change
  margin 10px 0

  &.success
    color #67C23A

  &.danger
    color #F56C6C

  &.info
    color #909399
</style>
