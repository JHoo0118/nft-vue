import Vue from "vue";
import Router from "vue-router";
import Main from "./views/Main.vue";
import Wallet from "./views/Wallet.vue";
import Upload from "./views/Upload.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "main",
      component: Main
    },
    {
      path: "/wallet",
      name: "wallet",
      component: Wallet
    },
    {
      path: "/upload",
      name: "upload",
      component: Upload
    }
  ]
});
