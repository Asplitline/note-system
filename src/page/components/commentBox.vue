<template>
  <div class="comment-box">
    <el-input type="textarea" :autosize="autosize" :value="value" resize="none" class="comment-editor" @input="input" />
    <button class="comment-button" :class="{ disabled: isDisabled, reply: isReply }" @click="handle">
      {{ isReply ? '回复' : '评论' }}
    </button>
  </div>
</template>

<script>
import { notEmpty } from '@/utils'
export default {
  props: {
    value: {
      type: String
    },
    isReply: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: '评论'
    }
  },
  data() {
    return {
      editor: null,
      content: ''
    }
  },
  computed: {
    autosize() {
      return { minRows: 3, maxRows: 4 }
    },
    isDisabled() {
      const val = this.value?.trim()
      return !notEmpty(val)
    }
  },
  mounted() {},
  methods: {
    notEmpty,
    input(v) {
      // console.log(e)
      this.$emit('input', v)
    },
    handle() {
      this.$emit('handle')
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-box {
  ::v-deep.comment-editor {
    margin-bottom: 0.1rem;
    .el-textarea__inner {
      border-radius: 0;
      &:hover {
        color: $main-blue-dark;
      }
    }
  }
  .comment-button {
    width: 100%;
    height: 2.5rem;
    background-color: $main-blue-dark;
    color: #fff;
    border: none;
    outline: none;
    cursor: pointer;
    &.reply {
      background-color: $main-green-dark;
      &:hover {
        background-color: $main-green;
      }
    }
    &:hover {
      background-color: $main-blue;
    }
    &.disabled {
      pointer-events: none;
      opacity: 0.7;
    }
  }
}
</style>
