<script lang="ts" setup>
  import { definePageMeta, useApi } from '#imports';
  definePageMeta({
    title: 'Gérer les croquettes',
    containerFluid: false,
  });
  const api = useApi().kibbles;
</script>

<template>
  <FoodSkeleton :api="api" />
</template>

<style lang="scss" scoped></style>
