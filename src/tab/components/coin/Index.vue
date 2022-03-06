<template>
  <el-card :style="{ opacity: cardOpacity }" class="card-container">
    <div class="coins-container">
      <el-card
        v-for="(coin, i) in coins"
        :key="i"
        shadow="hover"
        :class="{ bookmarked: coin.bookmarked }"
      >
        <el-button @click="openDialog(coin)" type="text" size="mini">
          {{ coin.symbol }}
        </el-button>
        <div class="price">
          {{ coin.quote.USD.price.toFixed(2) }}
        </div>
        <div
          class="change"
          :class="{
            success: priceChange24h(coin) > 0,
            info: priceChange24h(coin) === 0,
            danger: priceChange24h(coin) < 0,
          }"
        >
          {{ priceChange24h(coin) }}%
        </div>
      </el-card>
    </div>
  </el-card>
</template>

<script>
import axios from 'axios';
import { Card, Button } from 'element-ui';
import { COINS_CACHE_KEY, BOOKMARKED_COINS_CACHE_KEY } from './config';

const URL_PREFIX = 'https://pro-api.coinmarketcap.com/v1/';
const { CMC_PRO_API_KEY } = process.env;
const headers = {
  'X-CMC_PRO_API_KEY': CMC_PRO_API_KEY,
};

export default {
  components: {
    [Card.name]: Card,
    [Button.name]: Button,
  },
  data() {
    return {
      coins: [],
      status: null,
      selectedCoin: {},
      dialogVisible: false,
    };
  },
  props: ['cardOpacity', 'cacheTimeout'],
  mounted() {
    this.getCoins();
  },
  methods: {
    setCoins(result) {
      const bookmarkedCoinKeys = this.$helpers.getLocalStorage(
        BOOKMARKED_COINS_CACHE_KEY,
        []
      );
      const coins = [];
      const _coins = [];
      (result.data.data || []).forEach((coin) => {
        if (bookmarkedCoinKeys.includes(coin.name)) {
          coin.bookmarked = true;
          coins.push(coin);
        } else {
          _coins.push(coin);
        }
      });
      this.coins = coins.concat(_coins);
      this.status = result.data.status;
    },
    getCoins() {
      let result = this.$helpers.getLocalStorage(COINS_CACHE_KEY);
      if (result) {
        console.log('cached', COINS_CACHE_KEY, result);
        this.setCoins(result);
      } else {
        axios
          .get(`${URL_PREFIX}cryptocurrency/listings/latest`, { headers })
          .then((res) => {
            console.log(res);
            this.setCoins(res);
            this.$helpers.setLocalStorage(
              COINS_CACHE_KEY,
              res,
              this.cacheTimeout
            );
          });
      }
    },
    priceChange24h(coin) {
      return coin.quote.USD.percent_change_24h.toFixed(0);
    },
    openDialog(coin) {
      this.$emit('selectCoin', coin);
    },
  },
};
</script>

<style lang="stylus" scoped>
.card-container
  >>> .el-card__body
    padding-bottom 5px

.coins-container
  display flex
  flex-direction row
  overflow auto
  padding-bottom 10px

  > *
    flex-shrink 0
    margin 0 5px

  // >>> .el-card.bookmarked
  //   border-color #F56C6C

  >>> .el-card__body
    padding 5px 10px
    text-align center

    .price
      margin-bottom 5px
      color #409EFF

    .change
      &.success
        color #67C23A

      &.danger
        color #F56C6C

      &.info
        color #909399
</style>
