<script lang="ts">
  export default {
    inheritAttrs: false,
  };
</script>

<script lang="ts" setup>
  defineProps({
    pending: {
      type: Boolean,
      default: false,
    },
    transition: {
      type: String,
      default: 'fade-transition',
    },
  });
</script>

<template>
  <div>
    <v-progress-linear
      v-show="pending"
      :active="pending"
      indeterminate
      v-bind="$attrs" />
    <transition :name="transition">
      <div v-show="!pending">
        <slot />
      </div>
    </transition>
  </div>
</template>
