<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
  console.log("App Launch");
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style>
page {
  background-color: #F8F8F8;
}

/* 页面内容顶部安全区域 */
.safe-area-inset-top {
  padding-top: calc(var(--status-bar-height) + 70px);
}
</style>
