<script lang="ts" setup>
  import { useDisplay } from 'vuetify';
  import {
    kibbleApi,
    deepClone,
    simpleUid,
    useFoodForm,
    ref,
    watchEffect,
    type Kibble,
  } from '#imports';
  import { type VForm } from 'vuetify/components/VForm';

  type CompositionKey = keyof Kibble['composition'];

  const props = defineProps({
    onSubmit: {
      type: Function,
      default: null,
    },
    kibble: {
      type: Object,
      default: kibbleApi().new(),
    },
  });

  const { mobile } = useDisplay();
  const { getCompositionsFields, getBasicDescriptionFields } = useFoodForm();
  const compositionFields = getCompositionsFields();
  const basicDescriptionFields = getBasicDescriptionFields();

  const open = ref(false);
  const kibbleRef = ref<Kibble | null>(null);
  const form = ref<VForm | null>(null);
  const formValid = ref(false);
  const formId = simpleUid();
  const tab = ref<'description' | 'composition'>('description');
  watchEffect(() => {
    copyKibbleProp();
  });

  function copyKibbleProp() {
    kibbleRef.value = deepClone(props.kibble);
  }

  function openForm() {
    open.value = true;
  }

  function closeForm() {
    open.value = false;
  }

  async function onSave() {
    console.log(kibbleRef.value);
    console.log(await form.value!.validate());
  }

  defineExpose({
    openForm,
  });
</script>

<template>
  <client-only>
    <v-dialog v-model="open" scrollable :fullscreen="mobile">
      <template #activator>
        <v-btn
          variant="outlined"
          color="primary"
          prepend-icon="fa-solid fa-plus"
          @click.stop="openForm"
          >Ajouter
        </v-btn>
      </template>
      <v-card class="mx-auto" :width="mobile ? undefined : 600">
        <v-card-item>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Croquette</span>
            <v-btn
              aria-label="fermer le formulaire"
              variant="text"
              class="ml-3"
              icon="fa-solid fa-xmark"
              density="comfortable"
              @click="closeForm" />
          </v-card-title>
          <v-divider class="mb-2" />
          <v-tabs v-model="tab" fixed-tabs>
            <v-tab value="description">Description</v-tab>
            <v-tab value="composition">Composition</v-tab>
          </v-tabs>
        </v-card-item>
        <v-form
          :id="`food-form-${formId}`"
          ref="form"
          v-model="formValid"
          @submit.prevent="onSave">
          <v-card-text>
            <v-window v-model="tab">
              <v-window-item eager value="description">
                <v-row no-gutters class="mx-n3">
                  <template
                    v-for="(field, index) in basicDescriptionFields"
                    :key="index">
                    <v-divider v-if="field.type === 'divider'" class="mb-5" />
                    <v-col v-else class="px-3" cols="12">
                      <v-text-field
                        :id="`description-${field.attribut}-${formId}`"
                        v-model="kibbleRef!.composition[field.attribut as CompositionKey]"
                        :rules="field.rules"
                        :label="field.label"
                        :required="field.required" />
                    </v-col>
                  </template>
                </v-row>
              </v-window-item>
              <v-window-item eager value="composition">
                <v-row no-gutters class="mx-n3">
                  <template
                    v-for="(field, index) in compositionFields"
                    :key="index">
                    <v-divider v-if="field.type === 'divider'" class="mb-5" />
                    <v-col v-else class="px-3" cols="12" sm="6">
                      <v-text-field
                        :id="`composition-${field.attribut}-${formId}`"
                        v-model="kibbleRef!.composition[field.attribut as CompositionKey]"
                        :min="field.min"
                        :max="field.max"
                        :type="field.type"
                        :rules="field.rules"
                        :label="field.label"
                        :required="field.required" />
                    </v-col>
                  </template>
                </v-row>
              </v-window-item>
            </v-window>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn type="submit" color="error" variant="tonal">
              Enregistrer
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </client-only>
</template>

<style lang="scss" scoped></style>
