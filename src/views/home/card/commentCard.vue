<template>
  <div class="comment-card">
    <!-- <ul class="comment-list">
			<li class="comment-item"></li>
		</ul> -->
    <el-row class="comment-header">
      <el-col :span="6">
        评论者
      </el-col>
      <el-col :span="10">
        评论内容
      </el-col>
      <el-col :span="8">
        评论
      </el-col>
    </el-row>
    <template v-if="notEmpty(list)">
      <el-row v-for="i in list" :key="i.id" class="comment-item">
        <el-col :span="6">
          <span class="type"><img :src="file_url(i.extend1)" alt="" width="30" height="30" class="img" />{{ i.userId }}</span>
        </el-col>
        <el-col :span="10">
          <span class="content">{{ i.content }}</span>
        </el-col>
        <el-col :span="8">
          <span class="date">{{ i.createTime | formatDate }}</span>
        </el-col>
      </el-row>
    </template>
  </div>
</template>

<script>
import { API_OTHER, getOther } from '@/api'
import { notEmpty, file_url } from '@/utils'
export default {
  data() {
    return {
      list: []
    }
  },
  mounted() {
    this.fetchComment()
  },
  methods: {
    notEmpty,
    file_url,
    async fetchComment() {
      const { data } = await getOther(API_OTHER.NEW_COMMENT)
      this.list = data
      console.log(data)
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-header {
}
.img {
  vertical-align: middle;
  margin-right: 4px;
}
::v-deep.comment-card {
  overflow-x: hidden;
  overflow-y: auto;
  .comment-header {
    font-weight: 700;
  }
  .el-col {
    height: 40px;
    line-height: 40px;
    .title {
      color: $main-blue-dark;
      cursor: pointer;
    }
    .type {
      color: #888;
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
