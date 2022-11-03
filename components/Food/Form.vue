<script lang="ts" setup>
  import { useDisplay } from 'vuetify';
  import {
    deepClone,
    simpleUid,
    ref,
    watchEffect,
    computed,
    type Food,
    type WithoutId,
    type ObjectDescriptor,
    FieldDescriptor,
  } from '#imports';
  import { type VForm } from 'vuetify/components/VForm';
  import { PropType } from 'vue';

  type FormError = {
    id: string | number;
    errorMessages: string[];
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used in template
  type IsReturningFieldDescriptor<T> = {
    [K in keyof Required<T>]: FieldDescriptor;
  };

  function copyFoodProp() {
    foodRef.value = deepClone(props.food);
    tab.value = 'description';
  }

  function closeForm() {
    open.value = false;
  }

  function addVariation() {
    if (!foodRef.value.variations) {
      foodRef.value!.variations = [];
    }
    if (foodRef.value.meta) {
      foodRef.value?.variations.push(deepClone(foodRef.value.meta));
    }
  }

  function deleteVariation(index: number) {
    if (foodRef.value.variations) {
      foodRef.value?.variations.splice(index, 1);
    }
  }

  function parseFormErrors(errors: FormError[]) {
    let descriptionStatusChanged: boolean,
      compositionStatusChanged = false;
    errors.forEach((error) => {
      if (typeof error.id === 'string') {
        if (error.id.includes('description')) {
          form.descriptionInError.value = true;
          descriptionStatusChanged = true;
        } else if (!descriptionStatusChanged) {
          form.descriptionInError.value = false;
        }
        if (error.id.includes('composition')) {
          form.compositionInError.value = true;
          compositionStatusChanged = true;
        } else if (!compositionStatusChanged) {
          form.compositionInError.value = false;
        }
      }
    });
  }

  async function onSave() {
    const formValidation = await form.element.value!.validate();
    parseFormErrors(formValidation.errors);
    if (formValidation.valid) {
      emit('submit', deepClone(foodRef.value!));
    }
  }

  const props = defineProps({
    onSubmit: {
      type: Function,
      default: null,
    },
    food: {
      type: Object as PropType<WithoutId<Food>>,
      required: true,
    },
    foodFormDescriptor: {
      type: Object as PropType<ObjectDescriptor<WithoutId<Food>>>,
      required: true,
    },
    modalOpen: {
      type: Boolean,
      default: false,
    },
  });
  const emit = defineEmits(['submit', 'update:modalOpen']);

  const { mobile } = useDisplay();

  const open = computed({
    get() {
      return props.modalOpen;
    },
    set(value) {
      emit('update:modalOpen', value);
    },
  });
  const foodRef = ref<WithoutId<Food>>(deepClone(props.food));
  const foodIdentityDescriptor = computed(() => ({
    brand: props.foodFormDescriptor.brand,
    variety: props.foodFormDescriptor.variety,
  }));

  const form = {
    element: ref<VForm | null>(null),
    valid: ref(false),
    id: simpleUid(),
    descriptionInError: ref(false),
    compositionInError: ref(false),
  };
  const tab = ref<'description' | 'composition'>('description');

  watchEffect(() => {
    copyFoodProp();
  });
</script>

<template>
  <client-only>
    <v-dialog
      v-model="open"
      scrollable
      :fullscreen="mobile"
      :persistent="mobile">
      <v-card class="mx-auto" :width="mobile ? undefined : 600">
        <v-card-item>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Croquette</span>
            <div>
              <v-btn
                class="ml-2 text-caption"
                prepend-icon="fa-solid fa-retweet"
                variant="text"
                density="compact"
                @click="copyFoodProp">
                Reset
              </v-btn>
              <v-btn
                aria-label="fermer le formulaire"
                variant="text"
                class="ml-0"
                icon="fa-solid fa-xmark"
                density="comfortable"
                @click="closeForm" />
            </div>
          </v-card-title>
          <v-divider class="mb-2" />
          <v-tabs v-model="tab" fixed-tabs>
            <v-tab
              value="description"
              :color="form.descriptionInError.value ? 'error' : null"
              :class="form.descriptionInError.value ? 'text-error' : null"
              title="Description"></v-tab>
            <v-tab
              value="composition"
              title="Composition"
              :color="form.compositionInError.value ? 'error' : null"
              :class="
                form.compositionInError.value ? 'text-error' : null
              "></v-tab>
          </v-tabs>
        </v-card-item>
        <v-form
          :id="`food-form-${form.id}`"
          :ref="(el: VForm) => form.element.value = el"
          v-model="form.valid.value"
          @submit.prevent="onSave">
          <v-card-text>
            <v-window v-model="tab">
              <v-window-item eager value="description">
                <v-row no-gutters class="mx-n3">
                  <BaseFormInput
                    v-for="(field, key) in foodIdentityDescriptor"
                    :id="`description-${key}-${form.id}`"
                    :key="key"
                    v-model="foodRef[key]"
                    class="px-3"
                    cols="12"
                    :field="field" />
                </v-row>
                <div>
                  <div class="d-flex justify-space-between align-center">
                    <span class="text-subtitle-2 app--is-opaque">Détails</span>
                    <v-btn
                      class="ml-2 mb-2 text-caption app--is-opaque"
                      prepend-icon="fa-solid fa-plus"
                      variant="outlined"
                      density="compact"
                      @click="addVariation()">
                      Ajouter une variation
                    </v-btn>
                  </div>
                  <v-divider class="mb-3 mt-1" />
                  <v-row no-gutters class="mx-n3">
                    <BaseFormInput
                      v-for="(field, key) in foodFormDescriptor.meta as IsReturningFieldDescriptor<Food['meta']>"
                      :id="`description-meta-${key}-${form.id}`"
                      :key="key"
                      v-model="foodRef.meta![key]"
                      class="px-3"
                      cols="12"
                      sm="6"
                      :field="field" />
                  </v-row>
                </div>
                <div
                  v-for="(variation, index) in foodRef.variations"
                  :key="index">
                  <div class="d-flex justify-space-between align-center my-n2">
                    <span class="text-subtitle-2 app--is-opaque"
                      >Variation {{ index + 1 }}</span
                    >
                    <v-btn
                      class="ml-2 mb-2 text-caption"
                      variant="text"
                      density="compact"
                      icon="fa-solid fa-trash-can"
                      @click="deleteVariation(index)">
                    </v-btn>
                  </div>
                  <v-divider class="mb-3 mt-1" />
                  <v-row no-gutters class="mx-n3">
                    <BaseFormInput
                      v-for="(field, key) in foodFormDescriptor.meta as IsReturningFieldDescriptor<Food['meta']>"
                      :id="`description-variation${index}-${key}-${form.id}`"
                      :key="key"
                      v-model="variation![key]"
                      class="px-3"
                      cols="12"
                      sm="6"
                      :field="field" />
                  </v-row>
                </div>
              </v-window-item>
              <v-window-item eager value="composition">
                <v-row no-gutters class="mx-n3">
                  <BaseFormInput
                    v-for="(field, key) in foodFormDescriptor.composition  as IsReturningFieldDescriptor<Food['composition']>"
                    :id="`composition-${key}-${form.id}`"
                    :key="key"
                    v-model="foodRef.composition[key]"
                    class="px-3"
                    cols="12"
                    :field="field"
                    sm="6" />
                </v-row>
              </v-window-item>
            </v-window>
          </v-card-text>
          <v-card-actions>
            <v-btn class="ml-2 mb-2" variant="outlined" @click="closeForm">
              Annuler
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              class="mr-2 mb-2"
              type="submit"
              :color="form.valid.value != false ? 'primary' : 'error'"
              variant="tonal">
              Enregistrer
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </client-only>
</template>

<style lang="scss" scoped></style>
