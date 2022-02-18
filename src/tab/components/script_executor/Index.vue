<template>
    <el-card shadow="hover" :style="{opacity: cardOpacity}">
        <div v-show="!isShowEditScriptForm">
            <el-button @click="showAddScriptForm" type="text">Add script</el-button>
            <div v-if="isShowAddScriptForm">
                <script-model type="add" @onSubmit="onAddScriptSubmit"></script-model>
            </div>
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column type="expand" width="50">
                    <template slot-scope="props">
                        <pre style="max-height: 300px; overflow: scroll">{{ props.row.code }}</pre>
                    </template>
                </el-table-column>
                <el-table-column prop="enabled" label="" width="50">
                    <template slot-scope="scope">
                        <i v-show="scope.row.enabled" class="el-icon-circle-check"></i>
                    </template>
                </el-table-column>
                <el-table-column prop="url" label="URL"></el-table-column>
                <el-table-column prop="lang" label="Lang" width="100"></el-table-column>
                <!-- <el-table-column prop="code" label="Code" width="120"></el-table-column> -->
                <el-table-column prop="desc" label="Desc" width="200"></el-table-column>
                <el-table-column label="Operations" width="210">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="editRow(scope.$index)" type="text" size="small">Edit</el-button>
                        <el-button @click.native.prevent="copyCodeRow(scope.$index)" type="text" size="small">Copy</el-button>
                        <el-button @click.native.prevent="duplicateRow(scope.$index)" type="text" size="small">Duplicate</el-button>
                        <el-button @click.native.prevent="deleteRow(scope.$index)" type="text" size="small">Delete</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div v-if="isShowEditScriptForm" style="width: 600px">
            <el-button @click="toggleEditScriptForm" type="text">Back</el-button>
            <script-model v-if="editingScriptIndex !== null" type="edit" :edit-script="editingScript" @onSubmit="onEditScriptSubmit"></script-model>
        </div>
    </el-card>
</template>

<script>
import { Card, Table, TableColumn, Button, Form, FormItem, Input, Select, Option, Popconfirm, MessageBox, Message } from 'element-ui'
import ScriptModel from './ScriptModel'

export default {
    components: {
        [Card.name]: Card,
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Button.name]: Button,
        [Form.name]: Form,
        [FormItem.name]: FormItem,
        [Input.name]: Input,
        [Select.name]: Select,
        [Option.name]: Option,
        [Popconfirm.name]: Popconfirm,

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
    props: {
        cardOpacity: Number,
    },
    mounted() {
        this.getTableData()
    },
    methods: {
        async getTableData() {
            this.tableData = await this.$helpers.getSyncStorage(this.tableDataKey, [])
        },
        updateTableData() {
            this.$helpers.setSyncStorage(this.tableDataKey, this.tableData)
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
        async copyCodeRow(index) {
            const row = this.tableData[index]
            const result = await this.$helpers.copyCode(row.code, row.lang)
            if (result) {
                Message.success('Copied!')
            }
        },
        duplicateRow(index) {
            const row = this.tableData[index]
            this.tableData.splice(index, 0, row)
            this.updateTableData()
        },
        deleteRow(index) {
            MessageBox.confirm('This will permanently delete the script. Continue?', 'Warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.tableData = this.tableData.filter((v, i) => i != index)
                this.updateTableData()
            }).catch(() => {
                //
            })
        },
    },
}
</script>

<style lang="stylus" scoped>
</style>