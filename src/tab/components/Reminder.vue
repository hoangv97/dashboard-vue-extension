<template>
    <el-card shadow="hover" :style="{opacity: cardOpacity}" class="card">
        <el-tree :data="items" :props="defaultProps" show-checkbox node-key="id" 
            @check-change="handleCheckChange" :default-checked-keys="defaultCheckedKeys">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <el-popconfirm title="Are you sure to delete this?" confirmButtonText="Yes" cancelButtonText="No" icon="el-icon-info" iconColor="red" @onConfirm="removeItem(node, data)">
                    <i class="el-icon-close remove-item" slot="reference"></i>
                </el-popconfirm>
            </span>
        </el-tree>
        <el-input placeholder="..." v-model="input" @change="addInput" :clearable="true" suffix-icon="el-icon-edit" class="input"></el-input>
    </el-card>
</template>

<script>
import {Card, Checkbox, Input, Popover, Button, Popconfirm, Tree} from 'element-ui'

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
        [Tree.name]: Tree,
    },
    data () {
        return {
            items: this.$helpers.getLocalStorage(ITEMS_STORAGE_KEY, []),
            defaultCheckedKeys: [],
            input: '',
            defaultProps: {
                label: 'content',
                children: 'children',
            }
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
        this.defaultCheckedKeys = this.items.filter(i => i.checked).map(i => i.id)
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
        removeItem(node, data) {
            // console.log(node, data)
            this.items = this.items.filter(i => i.id != data.id).map((item, id) => {
                item.id = id // recalculate id
                return item
            })
        },
        handleCheckChange(data, checked, indeterminate) {
            // console.log(data, checked, indeterminate)
            let item = this.items.find(i => i.id === data.id)
            if (!item) return
            item.checked = checked
            let today = (new Date()).toISOString().slice(0, 10)
            if (item.checked && !item.history.includes(today)) {
                item.history.push(today)
            } else if (!item.checked) {
                item.history = item.history.filter(d => d !== today)
            }
        },
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
.custom-tree-node 
    flex 1
    display flex
    align-items center
    justify-content space-between
    font-size 14px
    padding-right 8px

.card >>> .el-tree-node__expand-icon
    display none 

.input
    margin-top 10px
</style>