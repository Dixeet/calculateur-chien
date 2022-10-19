<script lang="ts" setup>
  import { kibbleApi, tinCanApi, type FoodType } from '#imports';
  defineProps({
    foodType: {
      type: String,
      required: true,
      validator(value: FoodType) {
        return [kibbleApi().name, tinCanApi().name].includes(value);
      },
    },
  });

  // console.log(await kibbleApi().find((f) => f.brand === 'tata'));

  const test = new Array(5);

  function onSubmit() {
    console.log('submit');
  }
</script>

<template>
  <BaseProgressPlaceholder color="primary">
    <div class="lg-container">
      <slot :on-submit="onSubmit">
        <div class="mb-n2"></div>
      </slot>
      <v-row class="mt-2" justify="center" justify-sm="start">
        <template v-for="(t, index) in test" :key="index">
          <v-col>
            <v-card class="mx-auto" min-width="300" max-width="400">
              <v-card-item>
                <v-card-title>This is a title</v-card-title>
                <v-card-subtitle>This is a subtitle</v-card-subtitle>
              </v-card-item>
              <v-card-text> This is content</v-card-text>
            </v-card>
          </v-col>
        </template>
        <v-col>
          <div style="min-width: 300px; max-width: 400px"></div>
        </v-col>
        <v-col>
          <div style="min-width: 300px; max-width: 400px"></div>
        </v-col>
        <v-col>
          <div style="min-width: 300px; max-width: 400px"></div>
        </v-col>
      </v-row>
    </div>
  </BaseProgressPlaceholder>
</template>
