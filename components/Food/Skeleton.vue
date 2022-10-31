<script lang="ts" setup>
  import { deepClone, isFoodApi, ref, type Food } from '#imports';

  async function onSubmit(food: Food) {
    try {
      await props.api.create(food);
      closeForm();
    } catch (e) {
      if (e.name === 'DuplicateError') {
        openForm();
        e.customOptions.stopPropagation = 'logError';
      }
      throw e;
    }
  }

  function setFood(f: Food) {
    food.value = deepClone(f);
  }

  function openForm(set?: Food | 'new') {
    if (set) {
      setFood(set === 'new' ? newFood : set);
    }
    modalOpen.value = true;
  }

  function closeForm() {
    modalOpen.value = false;
  }

  const props = defineProps({
    api: {
      type: Object,
      required: true,
      validator(api: object) {
        return isFoodApi(api);
      },
    },
  });

  const newFood: Food = props.api.new();
  const foodFormDescriptor = props.api.getFormDescriptor();
  const modalOpen = ref(false);
  const food = ref<Food>(deepClone(newFood));

  const test = new Array(5);
</script>

<template>
  <BaseProgressPlaceholder color="primary">
    <div class="lg-container">
      <div class="mb-n2">
        <v-btn
          variant="outlined"
          color="primary"
          prepend-icon="fa-solid fa-plus"
          @click.stop="openForm('new')"
          >Ajouter
        </v-btn>
        <FoodForm
          v-model:modal-open="modalOpen"
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
