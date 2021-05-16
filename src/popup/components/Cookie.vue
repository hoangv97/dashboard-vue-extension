<template>
    <div>
        <div v-for="(item, i) in data" :key="i">
            <json-viewer
                :value="item"
                :expand-depth=5
                :copyable="{copyText: 'copy', copiedText: 'copied', timeout: 2000}"
                :boxed="true"
                :expanded="false"
                :timeformat="time => time.toLocaleString()"
                :sort="true">
            </json-viewer>
            <div v-if="item._expirationDate" style="margin-top: 15px">
                Change expired date: 
                <el-date-picker
                    v-model="item._expirationDate"
                    type="datetime"
                    size="small"
                    placeholder="Select date and time"
                    :picker-options="pickerOptions">
                </el-date-picker>
                <el-button type="text" @click="saveExpiredDate(item)">Save</el-button>
            </div>
            <el-divider v-if="i != data.length - 1"></el-divider>
        </div>
        <div v-if="!data.length">
            No cookies in this website!
        </div>
    </div>
</template>

<script>
import { Button, Divider, DatePicker, Notification } from 'element-ui'
import JsonViewer from 'vue-json-viewer'

export default {
    components: {
        [Button.name]: Button,
        [Divider.name]: Divider,
        [DatePicker.name]: DatePicker,
        [Notification.name]: Notification,

        JsonViewer,
    },
    data () {
        return {
            data: [],
            date: '',

            pickerOptions: {
                shortcuts: [
                    {
                        text: 'Today',
                        onClick: picker => {
                            picker.$emit('pick', new Date())
                        }
                    }, 
                    {
                        text: 'Tomorrow',
                        onClick: picker => {
                            const date = new Date()
                            date.setTime(date.getTime() + 3600 * 1000 * 24)
                            picker.$emit('pick', date)
                        }
                    }, 
                    {
                        text: 'Next week',
                        onClick: picker => {
                            const date = new Date()
                            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
                            picker.$emit('pick', date)
                        }
                    }
                ]
            },
        }
    },
    props: {
        
    },
    mounted() {
        this.getCookies()
    },
    methods: {
        getCookies() {
            chrome.tabs.getSelected(null, tab => {
                chrome.cookies.getAll({url: tab.url}, cookies => {
                    this.data = cookies.map(item => {
                        if (item.expirationDate) {
                            item._expirationDate = new Date(item.expirationDate * 1000)
                        }
                        return item
                    })
                })
            })
        },
        saveExpiredDate(item) {
            if (item._expirationDate) {
                item.expirationDate = item._expirationDate.getTime() / 1000
            }

            let updateItem = {}
            let updateKeys = ['domain', 'name', 'expirationDate']
            for (let key of updateKeys) {
                updateItem[key] = item[key]
            }

            chrome.tabs.getSelected(null, tab => {
                updateItem.url = tab.url

                console.log(updateItem)

                chrome.cookies.set(updateItem, () => {
                    Notification.success({
                        message: 'Cookie is updated',
                    })
                })
            })
        }
    },
    
}
</script>

<style lang="stylus" scoped>

</style>