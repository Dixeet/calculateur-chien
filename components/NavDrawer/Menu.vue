<script setup>
const emit = defineEmits(['close']);

const links = [
  { text: 'Accueil', icon: 'mdi-home', to: '/' },
  {
    text: 'Calculateur de ration',
    icon: 'mdi-percent',
    to: '/calculateurs/ration',
  },
  {
    text: 'Poids idéal',
    icon: 'mdi-scale-bathroom',
    to: '',
  },
];
function emitCloseEvent() {
  emit('close');
}
</script>
<template>
  <div class="d-flex flex-row-reverse ma-1">
    <v-btn @click="emitCloseEvent" variant="text" icon="mdi-close" />
  </div>
  <v-divider />
  <div>
    <v-list nav>
      <v-list-item
        v-for="(link, i) in links"
        :key="i"
        active-color="primary"
        tag="NuxtLink"
        :to="link.to"
      >
        <template v-if="link.icon" v-slot:prepend>
          <v-icon class="mr-3" :icon="link.icon" />
        </template>
        <span>{{ link.text }}</span>
      </v-list-item>
    </v-list>
  </div>
</template>

<style lang="scss" scoped></style>
