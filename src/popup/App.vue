<template>
    <el-container class="container">
        <el-menu
            :default-active="activeMenuId"
            class="el-menu-vertical"
            @select="handleSelectMenu">
            <el-menu-item v-for="(item, i) in menuItems" :key="i" :index="(i + 1) + ''">
                <i :class="['el-icon-' + item.icon]"></i>
                <span>{{ item.name }}</span>
            </el-menu-item>
        </el-menu>
        <div v-if="activeMenuId == 1">
            <giphy tags="cat,dog"></giphy>
        </div>
        <div v-if="activeMenuId == 2">
            <cookie></cookie>
        </div>
    </el-container>
</template>

<script>
import {Container, Menu, MenuItem} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/base.css'

import Giphy from './components/Giphy'
import Cookie from './components/Cookie'

export default {
    components: {
        [Container.name]: Container,
        [Menu.name]: Menu,
        [MenuItem.name]: MenuItem,

        Giphy,
        Cookie,
    },
    data () {
        return {
            menuItems: [
                {
                    name: 'Pet Gif',
                    icon: 'menu',
                },
                {
                    name: 'Cookies',
                    icon: 's-home',
                },
            ],
            activeMenuId: '1',
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
    min-width 800px
    padding 10px 20px 20px 20px

.el-menu
    margin-right 20px
</style>
