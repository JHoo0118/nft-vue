<template>
  <div>
    <h2 class="title">내 지갑</h2>
    <MyWallet />
  </div>
</template>

<script>
import MyWallet from "@/components/MyWallet.vue";

export default {
  components: {
    MyWallet
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