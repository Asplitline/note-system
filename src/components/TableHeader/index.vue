<template>
  <div class="table-header">
    <div v-if="showLeft" class="t-btns">
      <el-button class="t-btn" type="success" icon="el-icon-plus" @click="$emit('add')" />
      <!-- <el-button class="t-btn" type="danger" plain icon="el-icon-delete"
				@click="$emit('delete')"> </el-button> -->
    </div>
    <div v-if="showRight" class="search">
      <el-input placeholder="请输入内容" :value="value" clearable @input="input" @clear="$emit('clear')" />
      <el-button icon="el-icon-search" type="primary" @click="$emit('search')" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showLeft: {
      type: Boolean,
      default: true
    },
    showRight: {
      type: Boolean,
      default: true
    },
    value: {
      type: String
    }
  },
  data() {
    return { search: this.value }
  },
  methods: {
    input(val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.table-header {
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  padding: 0 0 1.5rem;
  .el-button {
    padding: 0.75rem;
    margin-left: 0;
    margin-right: 0.1rem;
    border-radius: 0;
  }
  .t-btns {
    margin-right: auto;
    border: 1px solid #f0f0f0;
    border-radius: 0.25rem;
    padding: 0.5rem;
  }
  .search {
    margin-left: auto;
    display: flex;
    align-items: center;
    .el-button {
      margin-left: 0.2rem;
    }
  }
}
</style>
