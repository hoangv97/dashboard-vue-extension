<template>
  <el-card :style="{ opacity: cardOpacity }">
    <el-tabs v-model="activeCategoryName">
      <el-tab-pane
        v-for="category in categories"
        :key="category.name"
        :name="category.name"
      >
        <span slot="label">
          {{ category.name | capitalize }}
        </span>
        <article-group
          :articles="category.articles"
          :cols="articleColNum"
        ></article-group>
      </el-tab-pane>
      <el-tab-pane name="search">
        <span slot="label"><i class="el-icon-search"></i></span>
        <el-input
          placeholder="Type something"
          :prefix-icon="'el-icon-' + (search.loading ? 'loading' : 'search')"
          v-model="search.query"
          @change="getQueryNews(1)"
          size="small"
          class="search-input"
          clearable
        ></el-input>
        <article-group
          :articles="search.articles"
          :cols="articleColNum"
        ></article-group>
        <div class="load-more" v-show="search.currentPage >= 1">
          <el-button type="text" @click="loadMore()">Load more</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import axios from 'axios';
import {
  Card,
  Button,
  Badge,
  Link,
  Tabs,
  TabPane,
  Collapse,
  CollapseItem,
  Image,
  Row,
  Col,
  Input,
} from 'element-ui';
import ArticleGroup from './ArticleGroup';

const NEWSAPI_KEY = '09875061c8604df6ad93566a4e876305';
const NEWSAPI_CATEGORIES = [
  'general',
  'business',
  'technology',
  'entertainment',
  'health',
  'science',
  // 'sports',
];
const NEWSAPI_COUNTRY = 'us';
const NEWSAPI_LANGUAGE = 'en';

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

    ArticleGroup,
  },
  data() {
    return {
      categories: NEWSAPI_CATEGORIES.map((c) => ({
        name: c,
        articles: [],
      })),
      activeCategoryName: NEWSAPI_CATEGORIES[0],
      articleColNum: 4, // 1, 2, 3, 4, 6, 8
      search: {
        loading: false,
        query: '',
        articles: [],
        currentPage: 0,
      },
    };
  },
  props: ['cardOpacity', 'cacheTimeout'],
  mounted() {
    for (let category of this.categories) {
      setTimeout(
        () => {
          this.getTopHeadlines(category.name);
        },
        category === this.activeCategoryName ? 0 : 1500
      ); // load active category first, others later
    }
  },
  methods: {
    setArticlesToCategory(categoryName, result) {
      let categoryId = this.categories.findIndex(
        (s) => s.name === categoryName
      );
      if (categoryId >= 0) {
        this.categories[categoryId].articles = result.data.articles;
      }
    },
    getTopHeadlines(categoryName) {
      let cacheKey = 'news_top-headlines_' + categoryName;
      let cacheTimeout = this.cacheTimeout || 1000;
      let result = this.$helpers.getLocalStorage(cacheKey);
      if (result) {
        this.setArticlesToCategory(categoryName, result);
      } else {
        axios
          .get(
            `https://newsapi.org/v2/top-headlines?country=${NEWSAPI_COUNTRY}&category=${categoryName}&apiKey=${NEWSAPI_KEY}`
          )
          .then((res) => {
            // console.log(res)
            this.setArticlesToCategory(categoryName, res);
            this.$helpers.setLocalStorage(cacheKey, res, cacheTimeout);
          });
      }
    },
    getQueryNews(page = 1) {
      if (!this.search.query || this.search.query === '') {
        this.$set(this.search, 'loading', false);
        this.$set(this.search, 'articles', []);
        this.$set(this.search, 'currentPage', 0);
        return;
      }

      let pageSize = 15;
      this.$set(this.search, 'currentPage', page);

      this.$set(this.search, 'loading', true);
      axios
        .get(
          `https://newsapi.org/v2/everything?language=${NEWSAPI_LANGUAGE}&q=${this.search.query}&apiKey=${NEWSAPI_KEY}&pageSize=${pageSize}&page=${page}`
        )
        .then((res) => {
          // console.log(res)
          this.$set(this.search, 'loading', false);
          let articles = res.data.articles;
          if (page === 1) {
            this.$set(this.search, 'articles', articles);
          } else {
            this.search.articles = this.search.articles.concat(articles);
            this.$set(this.search, 'articles', this.search.articles);
          }
        });
    },
    loadMore() {
      this.$set(this.search, 'currentPage', ++this.search.currentPage);
      this.getQueryNews(this.search.currentPage);
    },
  },
  filters: {
    capitalize: function(value) {
      if (!value) return '';
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
};
</script>

<style lang="stylus" scoped>
>>> .el-tabs__content
  max-height 575px
  overflow-y scroll

.search-input
  max-width 50%
  margin-bottom 10px

.load-more
  margin-top 15px
  width 100%
  text-align center
</style>
