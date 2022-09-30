<template>
  <el-card shadow="hover" :style="{ opacity: cardOpacity }">
    <el-input
      type="textarea"
      :autosize="{ minRows: 3 }"
      v-model="input"
    ></el-input>
  </el-card>
</template>

<script>
import { Card, Input } from 'element-ui';

const INPUT_KEY = 'Popup_Config_Key';

export default {
  components: {
    [Card.name]: Card,
    [Input.name]: Input,
  },
  data() {
    return {
      input: '',
    };
  },
  props: {
    cardOpacity: Number,
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      this.input = await this.$helpers.getSyncStorage(INPUT_KEY, '');
    },
  },
  watch: {
    input: {
      handler: function(newInput) {
        this.$helpers.setSyncStorage(INPUT_KEY, newInput);
      },
      deep: true,
    },
  },
};
</script>

<style lang="stylus" scoped>
>>> .el-card__body
  padding 0

>>> .el-textarea
  background-color transparent

>>> .el-textarea__inner
  border none
  background-color transparent
</style>
