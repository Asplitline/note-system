<template>
  <div class="my-card" :class="{ shadow: shadow }">
    <div class="my-card-title">
      <i class="fa icon" :class="icon" />
      <span class="text">{{ title }}</span>
    </div>
    <div class="my-card-content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    icon: { type: String, default: 'fa-car' },
    title: { type: String, default: '暂无' },
    shadow: { type: Boolean, default: true }
  }
}
</script>

<style lang="scss" scoped>
.my-card {
  padding: 0 0.625rem 0.625rem;
  background-color: #fff;
  border-radius: 4px;
  &.shadow {
    box-shadow: 1px 1px 4px 1px #0003;
  }
  &-title {
    height: 1.875rem;
    /* line-height: 1.875rem; */
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
    .icon {
      border-right: 1px solid #e0e0e0;
      padding-right: 0.3rem;
      color: $main-grey-dark;
    }
    .text {
      color: $main-black;
      padding-left: 0.5rem;
    }
  }
  &-content {
    padding: 0.625rem;
  }
  &-footer {
  }
}
</style>
