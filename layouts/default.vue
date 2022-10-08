<script setup>
  const drawer = ref(null);

  function toggleDrawer() {
    drawer.value = !drawer.value;
  }
</script>

<template>
  <div>
    <v-navigation-drawer v-model="drawer" app>
      <NavDrawerMenu @close="toggleDrawer" />
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon
        aria-label="bouton menu"
        :aria-expanded="drawer"
        @click.stop="toggleDrawer"></v-app-bar-nav-icon>
      <v-app-bar-title>
        <v-toolbar-title tag="h1" :text="$attrs.title"></v-toolbar-title>
      </v-app-bar-title>
    </v-app-bar>
    <v-main>
      <v-container>
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
