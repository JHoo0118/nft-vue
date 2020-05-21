<template>
  <div>
    <h2 class="title"></h2>
    <Marketplace />
  </div>
</template>
<script>
import Marketplace from "@/components/Marketplace.vue";

export default {
  components: {
    Marketplace
  }
};
</script>

<style scoped>
.title {
  color: black;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
}
</style>
