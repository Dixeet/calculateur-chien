<script setup>
  import { useTheme } from 'vuetify';

  const theme = useTheme();

  const config = useRuntimeConfig();
  const welcomeMsg = `${config.appName} v${config.appVersion}`;
  // eslint-disable-next-line no-console
  console.log(welcomeMsg);
</script>

<template>
  <v-app>
    <NuxtLoadingIndicator :color="theme.current.value.colors.info" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>
