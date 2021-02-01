<template>
  <div id="app" v-cloak>
    <loading></loading>
    <div v-show="!isShow">
      <layout-header></layout-header>
      <layout-body></layout-body>
      <layout-footer></layout-footer>
    </div>
    <div v-show="isShow">
      <router-view />
    </div>
  </div>
</template>
<script>
import layoutHeader from "@/components/layout/layout-header";
import layoutBody from "@/components/layout/layout-body";
import layoutFooter from "@/components/layout/layout-footer";
import Loading from "@/components/loading";
export default {
  name: "app",
  components: {
    layoutHeader,
    layoutBody,
    layoutFooter,
    Loading,
  },
  data() {
    return {
      isShow: false,
    };
  },
  watch: {
    $route(to, from) {
      if (to.name === "login" || to.name === "register") {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    },
  },
};
</script>
<style lang="less">
#app {
  font-size: 17px;
  color: #6f6f6f;
}
</style>
