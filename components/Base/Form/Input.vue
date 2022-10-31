<script lang="ts">
  export default {
    inheritAttrs: false,
  };
</script>
<script lang="ts" setup>
  defineProps({
    modelValue: {
      type: [String, Number],
      default: null,
    },
    field: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
      default: null,
    },
  });
  function update(value: string | number) {
    emit('update:modelValue', value);
  }
  const emit = defineEmits(['update:modelValue']);
</script>
<template>
  <v-divider v-if="field.type === 'divider'" class="mb-5" />
  <v-col v-else-if="!field.fields && !field.custom" v-bind="$attrs">
    <v-text-field
      :id="id"
      :model-value="modelValue"
      :min="field!.min"
      :max="field!.max"
      :type="field!.type"
      :rules="field!.rules"
      :label="field!.label"
      :required="field!.required"
      @update:model-value="update" />
  </v-col>
</template>
<style lang="scss"></style>
