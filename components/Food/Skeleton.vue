<script lang="ts" setup>
  import {
    deepClone,
    isClient,
    isFoodApi,
    ref,
    toRef,
    type Food,
    type FoodApi,
  } from '#imports';
  import { PropType } from 'vue';

  async function onSubmit(food: Food) {
    try {
      await api.value.create(food);
      closeForm();
      await getFoods();
    } catch (e) {
      if (e.name === 'DuplicateError') {
        openForm();
        e.customOptions.stopPropagation = 'logError';
      }
      throw e;
    }
  }

  function setFoodFormEntity(f: Food) {
    foodFormEntity.value = deepClone(f);
  }

  async function getFoods() {
    foods.value = await api.value.find();
  }

  function openForm(set?: Food | 'new') {
    if (set) {
      setFoodFormEntity(set === 'new' ? newFood : set);
    }
    modalOpen.value = true;
  }

  function closeForm() {
    modalOpen.value = false;
  }

  const props = defineProps({
    api: {
      type: Object as PropType<FoodApi>,
      required: true,
      validator(api: object) {
        return isFoodApi(api);
      },
    },
  });

  const api = toRef(props, 'api');
  const newFood = api.value.new();
  const foodFormDescriptor = api.value.getFormDescriptor();
  const modalOpen = ref(false);
  const foodFormEntity = ref<Food>(deepClone(newFood));
  const foods = ref<Food[]>([]);
  if (isClient) {
    await getFoods();
  }
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
          :food="foodFormEntity"
          :food-form-descriptor="foodFormDescriptor"
          @submit="onSubmit" />
      </div>
      <client-only>
        <p v-if="!foods || foods.length === 0" class="mt-4 pa-2 app--is-opaque">
          Aucun résultats
        </p>
        <v-row v-else class="mt-2" justify="center" justify-sm="start">
          <template v-for="food in foods" :key="food.id">
            <v-col>
              <FoodCard :food="food" :helper="api.helper" />
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
      </client-only>
    </div>
  </BaseProgressPlaceholder>
</template>
