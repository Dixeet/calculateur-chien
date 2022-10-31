<script lang="ts" setup>
  import { computed, round, useLocalStorage } from '#imports';
  import { useTheme } from 'vuetify';

  interface NavElements {
    text?: string;
    icon?: string;
    to?: string;
    type?: string;
    textClass?: string | string[] | object;
  }

  function toggleTheme() {
    theme.global.name.value = theme.global.current.value.dark
      ? 'customLight'
      : 'customDark';
  }

  function emitCloseEvent() {
    emit('close');
  }

  const emit = defineEmits(['close']);

  const storageUsed = computed(() => {
    const res = useLocalStorage().storageUsed.value / 1024;
    return res < 1000 ? `${round(res, 1)}KB` : `${round(res / 1000, 1)}MB`;
  });
  const navElements: NavElements[] = [
    { text: 'Accueil', icon: 'fa-solid fa-house', to: '/' },
    { text: 'Calculateurs', type: 'list-subheader' },
    {
      text: 'Ration de nourriture',
      icon: 'fa-solid fa-scale-unbalanced',
      to: '/calculateurs/ration',
    },
    {
      text: 'Poids idéal',
      icon: 'fa-solid fa-weight-scale',
      to: '',
    },
    {
      type: 'list-subheader',
      text: 'Nourriture',
    },
    {
      text: 'Croquettes',
      icon: 'fa-solid fa-bowl-rice',
      to: '/nourriture/croquettes',
    },
    {
      text: 'Pâtées',
      icon: 'fa-solid fa-bowl-food',
      to: '',
    },
  ];
  const theme = useTheme();
</script>
<template>
  <div class="d-flex flex-row-reverse pa-1">
    <v-btn
      aria-label="close menu"
      class="ma-1"
      variant="text"
      icon="fa-solid fa-xmark"
      @click="emitCloseEvent" />
    <v-spacer />
    <v-btn
      aria-label="change de theme"
      class="ma-1"
      variant="text"
      icon="fa-solid fa-circle-half-stroke"
      @click="toggleTheme" />
  </div>
  <v-divider />
  <div>
    <v-list density="compact">
      <template
        v-for="({ type, text, icon, to, textClass }, index) in navElements"
        :key="index">
        <v-list-subheader
          v-if="type === 'list-subheader'"
          :class="textClass ? textClass : 'text-subtitle-2'"
          >{{ text }}
        </v-list-subheader>

        <v-divider
          v-else-if="type === 'divider'"
          :class="textClass ? textClass : 'mt-2'" />

        <v-list-item
          v-else
          active-color="primary"
          tag="NuxtLink"
          :disabled="!to"
          :to="to">
          <template v-if="icon" #prepend>
            <v-icon class="mr-5" :icon="icon" />
          </template>
          <span :class="textClass ? textClass : ''">{{ text }}</span>
        </v-list-item>
      </template>
      <v-divider class="my-6 mb-1" />
      <client-only>
        <v-list-subheader class="text-subtitle-2 app-data">
          <span>Données</span>
          <span class="float-right">{{ storageUsed }} / 5MB</span>
        </v-list-subheader>
      </client-only>
      <v-list-item link disabled active-color="primary">
        <template #prepend>
          <v-icon class="mr-5" icon="fa-solid fa-download" />
        </template>
        <span>Importer</span>
      </v-list-item>
      <v-list-item disabled link active-color="primary">
        <template #prepend>
          <v-icon class="mr-5" icon="fa-solid fa-upload" />
        </template>
        <span>Exporter</span>
      </v-list-item>
    </v-list>
  </div>
</template>

<style lang="scss" scoped>
  .app-data :deep(.v-list-subheader__text) {
    flex-grow: 1;
  }
</style>
