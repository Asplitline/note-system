<template>
  <div class="my-empty" :style="{ backgroundColor: bg }">
    <i class="fa" :class="icon" :style="{ fontSize: size + 'px' }" />
    <p class="desc">
      {{ desc }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'MyEmpty',
  props: {
    icon: {
      type: String,
      default: 'fa-file-o'
    },
    size: {
      type: String,
      default: '60'
    },
    desc: {
      type: String,
      default: '暂无数据'
    },
    bg: {
      type: String,
      default: '#fafafa'
    }
  }
}
</script>

<style lang="scss" scoped>
.my-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  width: 100%;
  /* background-color: #fafafa; */
  color: #999;
  .desc {
    color: #666;
    font-size: 1.1rem;
    letter-spacing: 0.1em;
  }
}
</style>
