<script lang="ts" setup>
  import { definePageMeta, kibbleApi } from '#imports';
  definePageMeta({
    title: 'Gérer les croquettes',
    containerFluid: false,
  });
</script>

<template>
  <FoodSkeleton :api="kibbleApi" />
</template>

<style lang="scss" scoped></style>
