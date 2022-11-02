<script lang="ts">
  export default {
    inheritAttrs: false,
  };
</script>
<script lang="ts" setup>
  import { computed, FieldDescriptor } from '#imports';
  import { PropType } from 'vue';
  function update(value: string | number) {
    emit('update:modelValue', value);
  }
  const props = defineProps({
    modelValue: {
      type: [String, Number],
      default: null,
    },
    field: {
      type: Object as PropType<FieldDescriptor>,
      required: true,
    },
    id: {
      type: String,
      default: null,
    },
  });
  const emit = defineEmits(['update:modelValue']);
  const shapedField = computed(() => {
    return {
      ...props.field,
      label: `${props.field.preLabel ?? ''}${props.field.label}${
        props.field.subLabel ? ' | ' + props.field.subLabel : ''
      }${props.field.postLabel ?? ''}${props.field.required ? ' *' : ''}`,
    };
  });
</script>
<template>
  <v-divider v-if="shapedField.type === 'divider'" class="mb-5" />
  <v-col v-else-if="!shapedField.custom" v-bind="$attrs">
    <v-text-field
      :id="id"
      :model-value="modelValue"
      :min="shapedField!.min"
      :max="shapedField!.max"
      :type="shapedField!.type"
      :rules="shapedField!.rules"
      :label="shapedField!.label"
      :required="shapedField!.required"
      @update:model-value="update" />
  </v-col>
</template>
<style lang="scss"></style>
