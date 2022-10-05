<script setup>
  import { useTheme } from 'vuetify';

  const route = useRoute();
  const theme = useTheme();
</script>

<template>
  <v-app>
    <NuxtLoadingIndicator :color="theme.current.value.colors.info" />
    <NuxtLayout :title="route.meta.title">
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>
