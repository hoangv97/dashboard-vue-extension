<template>
    <el-container class="container">
        <el-menu
            :default-active="activeMenuId"
            class="el-menu-vertical"
            @select="handleSelectMenu">
            <el-menu-item index="1">
                <i class="el-icon-s-finance"></i>
                <span>Scripts</span>
            </el-menu-item>
            <el-menu-item index="2">
                <i class="el-icon-menu"></i>
                <span>Pet</span>
            </el-menu-item>
        </el-menu>
        <div v-if="activeMenuId == 1">
            <script-executor></script-executor>
        </div>
        <div v-if="activeMenuId == 2">
            <giphy tags="cat,dog"></giphy>
        </div>
    </el-container>
</template>

<script>
import {Container, Menu, MenuItem} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/base.css'

import Giphy from './components/Giphy'
import ScriptExecutor from './components/script_executor/Main.vue'

export default {
    components: {
        [Container.name]: Container,
        [Menu.name]: Menu,
        [MenuItem.name]: MenuItem,

        Giphy,
        ScriptExecutor,
    },
    data () {
        return {
            activeMenuId: '1'
        }
    },
    methods: {
        handleSelectMenu(key, keyPath) {
            this.activeMenuId = key
        },
    }
}
</script>

<style lang="stylus" scoped>
.container
    min-width 600px
    padding 10px 20px 20px 20px

.el-menu
    margin-right 20px
</style>
