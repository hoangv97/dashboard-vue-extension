<template>
    <el-form ref="form" :model="script" @submit.native.prevent label-width="80px" size="mini">
        <el-form-item label="URL">
            <el-input v-model="script.url"></el-input>
        </el-form-item>
        <el-form-item label="Language">
            <el-select v-model="script.lang" placeholder="Select language" default-first-option>
                <el-option label="JS" value="js"></el-option>
                <el-option label="CSS" value="css"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="Code">
            <el-input type="textarea" v-model="script.code"></el-input>
        </el-form-item>
        <el-form-item label="Desc">
            <el-input v-model="script.desc"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="text" @click="onSubmit">{{ submitBtnName }}</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { Table, TableColumn, Button, Form, FormItem, Input, Select, Option } from 'element-ui'

export default {
    components: {
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Button.name]: Button,
        [Form.name]: Form,
        [FormItem.name]: FormItem,
        [Input.name]: Input,
        [Select.name]: Select,
        [Option.name]: Option,
    },
    data () {
        return {
            script: {
                url: '',
                lang: 'js',
                code: 'console.log("Hello World")',
                desc: '',
            },
            defaultScript: {
                url: '',
                lang: 'js',
                code: 'console.log("Hello World")',
                desc: '',
            },
            submitBtnName: '',
        }
    },
    props: {
        type: String,
        editScript: {
            type: Object,
            required: false,
            default: () => ({}),
        },
    },
    mounted() {
        if (!Object.keys(this.editScript).length) {
            this.script = Object.assign({}, this.defaultScript)
        } else {
            this.script = Object.assign({}, this.editScript)
        }
        this.submitBtnName = this.type === 'add' ? 'Create' : 'Save'
    },
    methods: {
        onSubmit() {
            this.$emit('onSubmit', this.script)
            Object.assign(this.script, this.defaultScript)
        }
    },
}
</script>

<style lang="stylus" scoped>

</style>