<template>
  <div class="my-follow">
    <Card title="我的关注">
      <template v-if="notEmpty(list)">
        <ul class="star-list">
          <li v-for="i in list" :key="i.id" class="star-item">
            <img :src="file_url(i.fileUrl)" alt="" onerror="this.src='http://www.bianbiangou.cn/index/ICON2.png'" />
            <div class="info">
              <p class="author">
                {{ i.userName }}
              </p>
              <p class="desc">
                {{ i.description || '这个人太懒了' }}
              </p>
            </div>
            <button class="btn" @click="handleFocus(i)"><i class="fa fa-star" />已关注</button>
          </li>
        </ul>
      </template>
      <myEmpty v-else />
    </Card>
  </div>
</template>

<script>
import Card from './card.vue'
import { API, starUserList, deleteOne } from '@/api'
import { mapGetters } from 'vuex'
import * as types from '@/store/mutation_types'
import { notEmpty, file_url, handleMsg } from '@/utils'
export default {
  components: {
    Card
  },
  props: ['user'],
  data() {
    return {
      list: []
    }
  },
  watch: {
    user() {
      this.getList()
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    notEmpty,
    file_url,
    async getList() {
      const { data } = await starUserList({ id: this.user.id })
      this.list = data.map((i) => {
        const pwd = Object.entries(i)
        const [key, value] = pwd[0]
        return { key, ...value }
      })
      // this.list = data
    },
    async handleFocus(i) {
      const { success, message } = await deleteOne(API.FOCUSON, { id: i.key })
      handleMsg(success, message, () => {
        this.getList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.star-list {
  width: 100%;
  .star-item {
    display: flex;
    width: 100%;
    padding: 10px;
    align-items: center;

    img {
      width: 60px;
      height: 60px;
    }
    .btn {
      background-color: #06f;
      color: #fff;
      min-width: 96px;
      font-size: 14px;
      line-height: 32px;
      border-radius: 4px;
      border: 1px solid;
      cursor: pointer;
      &.star {
        border-color: #06f;
        background-color: #8590a6;
      }
    }
    .info {
      padding-left: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 60px;
      flex: 1;
      .author {
        font-size: 18px;
        font-weight: 600;
      }
      .desc {
        color: #8590a6;
        font-size: 14px;
      }
      p {
        margin: 0;
      }
    }
  }
}
</style>
