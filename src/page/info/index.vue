<template>
  <div class="info">
    <div class="top-banner">
      <div class="brief">
        <div class="img-box mask">
          <img :src="file_url(user.fileUrl)" alt="" onerror="this.src='http://www.bianbiangou.cn/index/ICON2.png'" />
          <el-upload
            class="icon"
            :action="UPLOAD_URL + 'file/uploadFile'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            name="files"
            :data="{ owerId: user.userId }"
          >
            <i class="fa fa-camera-retro" />
            <p>修改我的头像</p>
          </el-upload>
        </div>
        <div class="content ">
          <span class="title">{{ user.userName }}</span>
          <span class="desc">{{ user.description || '这个人太懒了，没有简介' }}</span>
        </div>
      </div>
    </div>
    <div class="bottom-container">
      <el-tabs v-model="activeTab" tab-position="left" class="my-tabs">
        <el-tab-pane key="myInfo" label="个人资料" :lazy="true" name="myInfo">
          <myInfo :user="user" @updateUser="updateUser" />
        </el-tab-pane>
        <el-tab-pane key="setting" label="账号设置" :lazy="true" name="setting">
          <setting :user="user" />
        </el-tab-pane>
        <el-tab-pane key="myNote" label="我的笔记" :lazy="true" name="myNote">
          <myNote :id="user.id" />
        </el-tab-pane>
        <el-tab-pane key="myPay" label="我的购买" :lazy="true" name="myPay">
          <myPay :id="user.id" />
        </el-tab-pane>
        <el-tab-pane key="starNote" label="收藏笔记" :lazy="true" name="starNote">
          <starNote :user="user" :userlist="userlist" />
        </el-tab-pane>
        <el-tab-pane key="myFollow" label="我的关注" :lazy="true" name="myFollow">
          <myFollow :user="user" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import myInfo from './myInfo'
import setting from './setting'
import myNote from './myNote'
import payList from './payList'
import starNote from './starNote'
import myPay from './myPay'
import myFollow from './myFollow'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { deepClone, file_url, handleMsg } from '@/utils'
import { BASE_URL, UPLOAD_URL } from '@/utils/global'
import { API, editUser } from '@/api'
import * as types from '@/store/mutation_types'
export default {
  components: {
    myInfo,
    setting,
    myNote,
    payList,
    starNote,
    myFollow,
    myPay
  },
  data() {
    return {
      activeTab: 'myInfo',
      BASE_URL,
      user: {},
      UPLOAD_URL
    }
  },
  computed: {
    ...mapGetters(['currentUser', 'userlist'])
  },
  watch: {
    currentUser(val) {
      this.user = deepClone(val)
    }
  },
  mounted() {
    this.user = deepClone(this.currentUser)
    this[types.FETCH_USER]()
  },
  methods: {
    ...mapMutations('user', [types.SET_CRTUSER]),
    ...mapActions('user', [types.FETCH_USER]),
    file_url,
    async handleAvatarSuccess(res, file) {
      this.$set(this.user, 'fileUrl', res)
      // this._avatar = res
      const { success, message } = await editUser(this.user)
      handleMsg(success, '', () => {
        this.updateUser(this.user)
      })
    },
    updateUser(user) {
      this[types.SET_CRTUSER](user)
    },
    beforeAvatarUpload() {}
  }
}
</script>

<style lang="scss" scoped>
.info {
  width: 1000px;
  margin: 0 auto;
  .top-banner {
    margin-top: 10px;
    height: 250px;
    background-color: #999999;
    box-shadow: 0 1px 3px rgb(18 18 18 / 10%);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    .brief {
      height: 125px;
      background-color: #fff;
      display: flex;
      padding-left: 20px;
      .img-box {
        position: relative;
        border-radius: 8px;
        border: 4px solid #fff;
        width: 170px;
        height: 170px;
        transform: translateY(-50%);
        .icon {
          display: none;
          cursor: pointer;
          position: absolute;
          flex-direction: column;
          align-items: center;
          content: '';
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #f0f0f0;
          font-size: 30px;
          p {
            white-space: nowrap;
            margin-top: 10px;
            font-size: 14px;
          }
          .fa-upload {
            font-size: 30px;
          }
        }
        &.mask {
          &:hover:before {
            cursor: pointer;
            position: absolute;
            content: '';
            background-color: rgba(0, 0, 0, 0.5);
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
          }
        }
        &:hover {
          .icon {
            display: flex;
          }
        }
        img {
          width: 100%;
          height: 100%;
        }
      }
      .content {
        padding-top: 16px;
        padding-left: 32px;
        .title {
          font-size: 26px;
          font-weight: 600;
        }
        .desc {
          margin-left: 12px;
          font-size: 18px;
          white-space: nowrap;
        }
        /* &.mask {

				} */
      }
    }
  }
  ::v-deep.my-tabs {
    margin-top: 8px;
    padding: 8px;
    .el-tabs__nav {
      width: 190px;
    }
    .el-tabs__active-bar {
      background-color: transparent;
    }
    .el-tabs__nav-wrap::after {
      background-color: transparent;
    }
    .el-tabs__item {
      height: 48px;
      width: 100%;
      background-color: #fff;
      color: $main-black;
      text-align: center;
      &:hover {
        background: #f0f0f0;
        font-weight: 500;
        color: #222226;
      }
      &.is-active {
        border-color: transparent;
        background: #f0f0f5;
        font-weight: 500;
        color: #222226;
      }
    }
  }
}
</style>
