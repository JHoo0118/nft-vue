<template>
  <div>
    <h2 class="title">업로드</h2>
    <MyUpload />
  </div>
</template>

<script>
import MyUpload from "@/components/MyUpload.vue";

export default {
  components: {
    MyUpload
  }
};
</script>

<style scoped>
.title {
  font-weight: bold;
  color: black;
  text-align: center;
  text-transform: uppercase;
}
</style>