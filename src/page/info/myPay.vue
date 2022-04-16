<template>
  <div class="my-note">
    <Card title="我的购买">
      <div class="note-tabpane">
        <template v-if="notEmpty(list)">
          <div v-for="i in list" :key="i.id" class="note-brief">
            <div class="brief-box">
              <h3 @click="gotoDetail(i)">
                {{ i.title }} <span class="fa fa-jpy">{{ i.price }}</span>
              </h3>
              <p>{{ i.title }}</p>
              <div class="other">
                <span class="fa fa-eye">浏览({{ i.view || 0 }})</span>
                <span class="fa fa-commenting-o">评论({{ i.replyNum || 0 }})</span>
                <span class="fa fa-thumbs-o-up">点赞({{ i.likeNum || 0 }})</span>
              </div>
            </div>
            <div class="cover-box">
              <img src="http://www.bianbiangou.cn/index/ICON2.png" alt="" @click="gotoDetail(i)" />
            </div>
          </div>
        </template>
        <template v-else>
          <myEmpty />
        </template>
      </div>
    </Card>
  </div>
</template>

<script>
import Card from './card.vue'
import { API, getAllList, starNoteList } from '@/api'
import { POST_STATE } from '@/utils/global'
import { notEmpty } from '@/utils'
import { mapMutations } from 'vuex'
import * as types from '@/store/mutation_types'
export default {
  components: {
    Card
  },
  props: ['id'],
  data() {
    return {
      list: [],
      POST_STATE,
      active: 0
    }
  },
  mounted() {
    this.getList()
  },
  // computed: {
  // 	filterList() {
  // 		const list_1 = this.list.filter((i) => i.userId === this.id)
  // 		return list_1.filter((i) => i.type === this.active)
  // 	}
  // },
  methods: {
    ...mapMutations('post', [types.SET_CURRENT_POST]),
    notEmpty,
    setActive(i) {
      this.active = i.type
    },
    async getList() {
      const { data } = await starNoteList({ id: this.id, type: 2 })
      this.list = data.map((i) => {
        const pwd = Object.entries(i)
        const [key, value] = pwd[0]
        return { ...value, key }
      })
    },
    gotoDetail(i) {
      this[types.SET_CURRENT_POST](i)
      this.$router.push({ name: 'pArticle', params: { id: i.id } })
    }
  }
}
</script>

<style lang="scss" scoped>
.my-note {
  .note-tabs {
    display: flex;
    padding: 20px 0 10px;
    border-bottom: 1px solid #f0f0f0;

    &-item {
      position: relative;
      padding: 8px 16px;
      &:hover {
        cursor: pointer;
        color: $main-red;
      }
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 0;
        height: 10px;
        width: 1px;
        background-color: #ccc;
      }
      &.active {
        color: $main-red-dark;
        font-weight: 700;
      }
    }
  }
  ::v-deep.card-content {
    flex-direction: column;
    /* align-items: center; */
  }
  .note-tabpane {
    display: flex;
    flex-direction: column;
  }
  .note-brief {
    display: flex;
    padding: 10px 0;
    /* display: flex; */
    flex: 1;
    .brief-box {
      flex: 1;
      h3 {
        color: #666;
        font-size: 18px;
        .fa-jpy {
          margin-left: 20px;
          color: $main-red;
        }
        &:hover {
          cursor: pointer;
          text-decoration: underline;
        }
      }
      p {
        font-size: 13px;
        line-height: 24px;
        color: #333;
      }
    }

    .other {
      span {
        font-size: 13px;
        color: #888;
        margin-right: 12px;
      }
      .fa-star {
        color: $main-red-dark;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
  .cover-box {
    display: flex;
    height: 100px;
    width: auto;
    overflow: hidden;
    img {
      cursor: pointer;
      width: 100%;
      height: 100%;
      transition: all 0.5s linear;
      &:hover {
        transform: scale(1.2);
      }
    }
  }
}
</style>
