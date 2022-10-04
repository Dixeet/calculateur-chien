<script setup>
const emit = defineEmits(['close']);

const navElements = [
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
    to: '',
  },
  {
    text: 'Pâtées',
    icon: 'fa-solid fa-bowl-food',
    to: '',
  },
];
function emitCloseEvent() {
  emit('close');
}
</script>
<template>
  <div class="d-flex flex-row-reverse pa-1">
    <v-btn
      class="ma-1"
      variant="text"
      icon="fa-solid fa-xmark"
      @click="emitCloseEvent"
    />
  </div>
  <v-divider />
  <div>
    <v-list nav density="compact">
      <template
        v-for="({ type, text, icon, to, textClass }, index) in navElements"
        :key="index"
      >
        <v-list-subheader
          v-if="type === 'list-subheader'"
          :class="textClass ? textClass : 'text-subtitle-2'"
          >{{ text }}</v-list-subheader
        >

        <v-divider
          v-else-if="type === 'divider'"
          :class="textClass ? textClass : 'mt-2'"
        />

        <v-list-item v-else active-color="primary" tag="NuxtLink" :to="to">
          <template v-if="icon" #prepend>
            <v-icon class="mr-5" :icon="icon" />
          </template>
          <span :class="textClass ? textClass : ''">{{ text }}</span>
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>

<style lang="scss" scoped></style>
