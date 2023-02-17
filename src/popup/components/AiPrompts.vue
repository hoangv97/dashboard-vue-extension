<template>
  <div style="width: 100%">
    <el-button @click="showPromptInput = !showPromptInput" type="text">
      Add prompt
    </el-button>
    <el-input
      v-show="showPromptInput"
      type="textarea"
      :rows="5"
      placeholder="Prompt"
      v-model="promptInput"
    >
    </el-input>
    <el-button
      v-show="showPromptInput"
      @click="add"
      :disabled="!promptInput"
      type="text"
    >
      Update
    </el-button>
    <el-table
      height="450"
      show-header="false"
      :data="
        prompts.filter(
          (data) =>
            !search || data.content.toLowerCase().includes(search.toLowerCase())
        )
      "
      style="width: 100%"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="Prompt"
            v-model="props.row.content"
          ></el-input>
          <el-button
            @click="handleEdit(props.$index, props.row)"
            :disabled="!props.row.content"
            type="text"
          >
            Update
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="Content" prop="content"> </el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="Type to search" />
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleCopy(scope.$index, scope.row)"
            >Copy</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { Button, Input, Table, TableColumn } from 'element-ui';

const STORAGE_KEY = 'ai_prompts_list';
const STORAGE_KEY_SEARCH = 'ai_prompts_list_search';

export default {
  components: {
    [Button.name]: Button,
    [Input.name]: Input,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  data() {
    return {
      search: '',
      promptInput: '',
      showPromptInput: false,
      prompts: [],
    };
  },
  props: {},
  mounted() {
    this.getPrompts();
  },
  methods: {
    add() {
      chrome.storage.sync.set(
        {
          [STORAGE_KEY]: JSON.stringify([
            ...this.prompts,
            { content: this.promptInput },
          ]),
        },
        () => {
          this.getPrompts();
        }
      );
    },
    handleEdit(index, row) {
      chrome.storage.sync.set(
        {
          [STORAGE_KEY]: JSON.stringify([
            ...this.prompts.map((item, i) =>
              i === index ? { ...item, content: row.content } : item
            ),
          ]),
        },
        () => {
          this.getPrompts();
        }
      );
    },
    handleDelete(index, row) {
      chrome.storage.sync.set(
        {
          [STORAGE_KEY]: JSON.stringify([
            ...this.prompts.filter((_, i) => i !== index),
          ]),
        },
        () => {
          this.getPrompts();
        }
      );
    },
    handleCopy(index, row) {
      navigator.clipboard
        .writeText(row.content)
        .then(() => {
          console.log('Text copied to clipboard');
        })
        .catch((error) => {
          console.error('Failed to copy text: ', error);
        });
    },
    getPrompts() {
      chrome.storage.sync.get(STORAGE_KEY, (result) => {
        result = result[STORAGE_KEY] ? JSON.parse(result[STORAGE_KEY]) : [];
        this.prompts = result;
      });
      chrome.storage.sync.get(STORAGE_KEY_SEARCH, (result) => {
        result = result[STORAGE_KEY_SEARCH] || '';
        this.search = result;
      });
    },
  },
  watch: {
    search(newVal) {
      chrome.storage.sync.set({ [STORAGE_KEY_SEARCH]: newVal });
    },
  },
};
</script>

<style lang="stylus" scoped></style>
