<script lang="ts" setup>
  import {
    useRuntimeConfig,
    useNotification,
    onErrorCaptured,
    useErrorHandler,
    isClient,
  } from '#imports';
  import { useTheme } from 'vuetify';

  const theme = useTheme();
  const config = useRuntimeConfig();

  const notifications = useNotification();
  const deleteFn = (id: number) => useNotification(null, id);
  const welcomeMsg = `${config.appName} v${config.appVersion}`;
  /* eslint-disable-next-line no-console
  -- Welcome message console
     */
  console.log(welcomeMsg);

  onErrorCaptured((err) => {
    const handler = useErrorHandler(err);
    if (handler.notification) {
      useNotification({ timeout: 7000, ...handler.notification });
    }
    if (isClient && handler.stopPropagation) {
      return false;
    }
  });
</script>

<template>
  <v-app class="app">
    <BaseNotifications
      v-model="notifications"
      :delete-fn="deleteFn"
      position="fixed"
      top="60px"
      right="0">
    </BaseNotifications>
    <NuxtLoadingIndicator :color="theme.current.value.colors.info" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>
