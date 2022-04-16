<template>
  <div class="card">
    <div class="card-title">
      {{ title }}
    </div>
    <div class="card-content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: ['title']
}
</script>

<style lang="scss" scoped>
.card {
  background-color: #fff;
  padding: 20px 10px;
  &-title {
    font-size: 20px;
    font-weight: 700;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f5;
  }
  .card-content {
    display: flex;
    .left {
      padding: 20px;
      flex: 1;

      ::v-deep.ruleForm {
        .el-input.is-active .el-input__inner,
        .el-input__inner:focus {
          border-color: #e5e6eb;
        }
        .el-input__inner {
          color: #1d2129;
          background: #fafafa;
          &:focus {
            background-color: transparent;
          }
          &:hover {
            background-color: #f0f0f0;
          }
        }
      }
      .btns {
        padding-left: 80px;
        .btn {
          width: 160px;
          height: 40px;
          background-color: #fff;
          outline: none;
          border: none;
          background-color: $main-blue;
          color: $main-white;
          border-radius: 2px;
          cursor: pointer;
          &:hover {
            background-color: $main-blue-dark;
          }
          &.grey {
            background-color: $main-grey-dark;
            &:hover {
              background-color: $main-grey;
            }
          }
        }
      }
    }
    .right {
      padding: 40px 46px;
      img {
        width: 160px;
      }
    }
  }
}
</style>
