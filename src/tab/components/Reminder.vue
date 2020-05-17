<template>
    <el-card shadow="hover" :style="{opacity: cardOpacity}">
        <div slot="header">
            <span>Reminder</span>
        </div>
        <div v-for="item in items" :key="item.id" class="item">
            <!-- <el-popover placement="top-start" :title="item.content" width="200" trigger="hover" content="Current streak: ">
                <el-checkbox v-model="item.checked" class="checkbox" slot="reference">{{ item.content }}</el-checkbox>
            </el-popover> -->
            <el-checkbox v-model="item.checked" class="checkbox" @change="checkItem(item)">{{ item.content }}</el-checkbox>
            <el-popconfirm title="Are you sure to delete this?" confirmButtonText="Yes" cancelButtonText="No" icon="el-icon-info" iconColor="red" @onConfirm="removeItem(item)">
                <i class="el-icon-close remove-item" slot="reference"></i>
            </el-popconfirm>
        </div>
        <el-input placeholder="..." v-model="input" @change="addInput" :clearable="true" suffix-icon="el-icon-edit" class="input"></el-input>
    </el-card>
</template>

<script>
import {Card, Checkbox, Input, Popover, Button, Popconfirm,} from 'element-ui'

const ITEMS_STORAGE_KEY = 'reminder'
const LAST_DATE_STORAGE_KEY = 'reminder_last_date'

export default {
    components: {
        [Card.name]: Card,
        [Checkbox.name]: Checkbox,
        [Input.name]: Input,
        [Popover.name]: Popover,
        [Button.name]: Button,
        [Popconfirm.name]: Popconfirm,
    },
    data () {
        return {
            items: this.$helpers.getLocalStorage(ITEMS_STORAGE_KEY, []),
            input: '',
        }
    },
    props: ['cardOpacity'],
    mounted() {
        let lastDate = this.$helpers.getLocalStorage(LAST_DATE_STORAGE_KEY)
        let today = (new Date()).toISOString().slice(0, 10)
        if (lastDate && lastDate !== today) {
            this.items = this.items.map(i => {
                i.checked = false
                return i
            })
        }
        this.$helpers.setLocalStorage(LAST_DATE_STORAGE_KEY, today)
    },
    methods: {
        addInput() {
            let val = this.input && this.input.trim()
            if (!val) return
            this.items.push({
                id: this.items.length,
                content: val,
                checked: false,
                history: [],
            })
            // console.log(this.items, this.input)
            this.input = ''
        },
        removeItem(item) {
            // console.log(item)
            this.items = this.items.filter(i => i.id != item.id).map((item, id) => {
                item.id = id // recalculate id
                return item
            })
        },
        checkItem(item) {
            // console.log(item)
            let today = (new Date()).toISOString().slice(0, 10)
            if (item.checked && !item.history.includes(today)) {
                item.history.push(today)
            } else if (!item.checked) {
                item.history = item.history.filter(d => d !== today)
            }
        }
    },
    watch: {
        items: {
            handler: function(newItems) {
                // console.log(newItems)
                this.$helpers.setLocalStorage(ITEMS_STORAGE_KEY, newItems)
            },
            deep: true,
        }
    },
}
</script>

<style lang="stylus" scoped>
.item
    margin-bottom 10px

    .checkbox
        width calc(100% - 16px)

.input
    margin-top 10px
</style>