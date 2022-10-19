<script lang="ts" setup>
  import { ref, useRoute } from '#imports';
  import { type RouteMeta } from 'vue-router';

  const drawer = ref<boolean | null>(null);
  const route = useRoute();
  const { title, containerFluid } = route.meta as RouteMeta & {
    title: string;
    containerFluid: boolean;
  };

  function toggleDrawer() {
    drawer.value = !drawer.value;
  }
</script>

<template>
  <div>
    <v-navigation-drawer v-model="drawer" color="surface" app>
      <NavDrawerMenu @close="toggleDrawer" />
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon
        aria-label="bouton menu"
        :aria-expanded="drawer"
        @click.stop="toggleDrawer"></v-app-bar-nav-icon>
      <v-app-bar-title>
        <v-toolbar-title tag="h1" :text="title"></v-toolbar-title>
      </v-app-bar-title>
    </v-app-bar>
    <v-main>
      <v-container :fluid="containerFluid">
        <slot />
      </v-container>
    </v-main>
  </div>
</template>

<style lang="scss" scoped>
  .v-toolbar.v-app-bar {
    width: 100%;
  }
</style>
