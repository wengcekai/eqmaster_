<template>
  <view class="bar-item" :class="{ active: isActive }"></view>
</template>

<script>
export default {
  props: {
    isActive: {
      type: Boolean,
      default: false, // 默认是非active状态
    },
  },
}
</script>

<style scoped>
.bar-item {
  width: 40%; /* 这里你可以根据需要调整宽度 */
  height: 5px;
  background-color: rgba(255, 255, 255, 0.3);
  /* 默认灰色背景 */
  border-radius: 20px;
  margin-left: 10px;
}

.active {
  background-color: #D9D9D9; /* active状态为白色背景 */
}
</style>