<template>
  <div class="note-card">
    <!-- <ul class="note-list">
			<li class="note-item"></li>
		</ul> -->
    <el-row class="note-header">
      <el-col :span="14">
        笔记标题
      </el-col>
      <!-- <el-col :span="4">笔记分类</el-col> -->
      <el-col :span="4">
        浏览数
      </el-col>
      <el-col :span="6">
        发布时间
      </el-col>
    </el-row>
    <el-row v-for="i in list" :key="i.id" class="note-item">
      <el-col :span="14">
        <span class="title" @click="gotoDetail(i)">{{ i.title }}</span>
      </el-col>
      <el-col :span="4">
        <span class="type">{{ i.view }}</span>
      </el-col>
      <!-- <el-col :span="4"><span class="view">{{i.likeNum || 0}}</span></el-col> -->
      <el-col :span="6">
        <span class="date">{{ i.createTime | formatDate }}</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { API_OTHER, getOther } from '@/api'
import { notEmpty, file_url } from '@/utils'
import * as types from '@/store/mutation_types'
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      list: []
    }
  },
  methods: {
    ...mapMutations('post', [types.SET_CURRENT_POST]),
    notEmpty,
    file_url,
    async fetchNote() {
      const { data } = await getOther(API_OTHER.NEW_NOTES)
      this.list = data
      console.log(data)
    },
    gotoDetail(i) {
      this.$router.push({ name: 'pArticle', params: { id: i.id } })
      this[types.SET_CURRENT_POST](i)
    }
  },
  mounted() {
    this.fetchNote()
  }
}
</script>

<style lang="scss" scoped>
.note-header {
}
::v-deep.note-card {
  overflow-x: hidden;
  overflow-y: auto;
  .note-header {
    font-weight: 700;
  }
  .el-col {
    height: 30px;
    line-height: 30px;
    .title {
      display: inline-block;
      color: $main-blue-dark;
      cursor: pointer;
      max-width: 300px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .type {
      color: $main-blue;
      cursor: pointer;
    }
    .view,
    .date {
      white-space: nowrap;
      font-size: 14px;
      color: #666;
    }
  }
}
</style>
