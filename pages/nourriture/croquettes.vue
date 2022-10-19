<script lang="ts" setup>
  import { definePageMeta, kibbleApi } from '#imports';
  definePageMeta({
    title: 'Gérer les croquettes',
    containerFluid: false,
  });
</script>

<template>
  <FoodSkeleton v-slot="{ onSubmit }" :food-type="kibbleApi().name">
    <FoodFormKibble :on-submit="onSubmit" />
  </FoodSkeleton>
</template>

<style lang="scss" scoped></style>
