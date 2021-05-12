<template>
    <div>
        <div v-show="!isShowEditScriptForm">
            <el-button @click="showAddScriptForm" type="text">Add script</el-button>
            <div v-show="isShowAddScriptForm">
                <script-model type="add" @onSubmit="onAddScriptSubmit"></script-model>
            </div>
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column fixed prop="url" label="URL" width="150"></el-table-column>
                <el-table-column prop="lang" label="Lang" width="100"></el-table-column>
                <el-table-column prop="code" label="Code" width="120"></el-table-column>
                <el-table-column prop="desc" label="Desc" width="120"></el-table-column>
                <el-table-column fixed="right" label="Operations" width="150">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="runScriptRow(scope.$index)" type="text" size="small">Run</el-button>
                        <el-button @click.native.prevent="duplicateRow(scope.$index)" type="text" size="small">Duplicate</el-button>
                        <el-button @click.native.prevent="editRow(scope.$index)" type="text" size="small">Edit</el-button>
                        <el-button @click.native.prevent="removeRow(scope.$index)" type="text" size="small">Remove</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div v-show="isShowEditScriptForm">
            <el-button @click="toggleEditScriptForm" type="text">Back</el-button>
            <script-model v-if="editingScriptIndex !== null" type="edit" :edit-script="editingScript" @onSubmit="onEditScriptSubmit"></script-model>
        </div>
    </div>
</template>

<script>
import { PrismEditor } from 'vue-prism-editor'
import 'vue-prism-editor/dist/prismeditor.min.css'

import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/themes/prism-tomorrow.css'

import { Table, TableColumn, Button, Form, FormItem, Input, Select, Option, Popconfirm } from 'element-ui'
import ScriptModel from './ScriptModel'

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
        [Popconfirm.name]: Popconfirm,

        PrismEditor,
        ScriptModel,
    },
    data () {
        return {
            tableData: [],
            tableDataKey: 'ScriptExecutor_TableData',
            isShowAddScriptForm: false,
            isShowEditScriptForm: false,
            editingScript: null,
            editingScriptIndex: null,
        }
    },
    props: [],
    mounted() {
        this.getTableData()
    },
    methods: {
        getTableData() {
            this.tableData = this.$helpers.getLocalStorage(this.tableDataKey, [])
        },
        updateTableData() {
            this.$helpers.setLocalStorage(this.tableDataKey, this.tableData)
        },

        // Add Form
        showAddScriptForm() {
            this.isShowAddScriptForm = !this.isShowAddScriptForm
        },
        onAddScriptSubmit(script) {
            this.tableData.push({...script})
            this.updateTableData()
        },

        // Edit form
        editRow(index) {
            this.editingScriptIndex = index
            this.editingScript = this.tableData[index]
            this.toggleEditScriptForm()
        },
        toggleEditScriptForm() {
            this.isShowEditScriptForm = !this.isShowEditScriptForm
        },
        onEditScriptSubmit(script) {
            this.$set(this.tableData, this.editingScriptIndex, script)
            this.toggleEditScriptForm()
            this.updateTableData()
        },

        // Table Operations
        runScriptRow(index) {
            let row = this.tableData[index]
            this.executeCode(row.code, row.lang)
        },
        duplicateRow(index) {
            let row = this.tableData[index]
            this.tableData.splice(index, 0, row)
            this.updateTableData()
        },
        removeRow(index) {
            this.tableData = this.tableData.filter((v, i) => i != index)
            this.updateTableData()
        },
        
        // helper
        executeCode(code, lang) {
            chrome.tabs.getSelected(null, tab => {
                if (lang === 'css') {
                    chrome.tabs.insertCSS(tab.id, {code})
                } else {
                    chrome.tabs.executeScript(tab.id, {code})
                }
            })
        },

        // deprecated
        highlighter(code) {
            return highlight(code, languages.js); // languages.<insert language> to return html with markup
        },
    },
}
</script>

<style lang="stylus" scoped>
.editor 
    background #2d2d2d
    color #ccc

    font-family Fira code, Fira Mono, Consolas, Menlo, Courier, monospace
    font-size 14px
    line-height 1.5
    padding 5px

.prism-editor__textarea:focus
    outline none
</style>