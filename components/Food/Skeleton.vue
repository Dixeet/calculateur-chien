<script lang="ts" setup>
  const props = defineProps({
    api: {
      type: Object,
      required: true,
    },
  });

  const food = props.api.new();
  type Food = typeof food;
  const foodFormDescriptor = props.api.getFormDescriptor();

  const test = new Array(5);

  async function onSubmit(food: Food) {
    await props.api.create(food);
  }
</script>

<template>
  <BaseProgressPlaceholder color="primary">
    <div class="lg-container">
      <div class="mb-n2">
        <FoodForm
          :food="food"
          :food-form-descriptor="foodFormDescriptor"
          @submit="onSubmit" />
      </div>
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
