<template>
  <v-app>
    <div class="d-flex justify-space-between">
      <v-tabs v-model="currentTab" centered>
        <v-tab v-for="(n, index) in cartTabs" :key="index">
          {{ n.title }}
        </v-tab>
      </v-tabs>
      <v-btn
        class="mx-2 my-2 accent-3"
        x-small
        fab
        color="green"
        elevation="1"
        @click="addCartTab"
      >
        <v-icon color="black">
          mdi-plus
        </v-icon>
      </v-btn>
    </div>
    <v-tabs-items v-model="currentTab">
      <v-tab-item v-for="(n, index) in cartTabs" :key="index">
        <v-card flat v-if="currentTab === index">
          <v-card-text class="px-0 py-0">
            <CartPage @closeTab="closeCurrentTab" :tabIndex="index" />
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import CartPage from "./CartPage.vue";
import loadData from "../mixins/loadData";
export default {
  mixins: [loadData],
  components: {
    CartPage
  },
  data: () => ({
    currentTab: null,
    loadDataInterval: null
    // currentScaleWeight: 0,
  }),
  computed: {
    ...mapGetters({
      cartTabs: "cartTabs"
      // comPortName: "settings/comPortName",
    })
  },
  methods: {
    ...mapActions([
      "appendCartTab",
      "closeTabByIndex",
      "setTabItemsByIndex",
      "loadData"
    ]),
    addCartTab() {
      this.appendCartTab();
    },
    closeCurrentTab() {
      if (this.cartTabs.length === 1) {
        this.addCartTab();
      }
      this.closeTabByIndex({ index: this.currentTab });
    },
    setItems(items) {
      console.log(items);
    }
  },
  mounted() {
    this.loadDataInterval = setInterval(async () => {
      await this.loadData();
    }, 600000);
  },
  beforeDestroy() {
    clearInterval(this.loadDataInterval);
  }
};
</script>
