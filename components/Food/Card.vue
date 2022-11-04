<script lang="ts" setup>
  import { type Food, type FoodApi } from '#imports';
  import { PropType } from 'vue';

  const props = defineProps({
    food: {
      type: Object as PropType<Food>,
      required: true,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    helper: {
      type: Object as PropType<FoodApi['helper']>,
      required: true,
    },
  });
  const composition = props.helper.getCompositionDetails(
    props.food.composition,
  );
  const meta = props.helper.getMetaDetail(props.food.meta);
</script>
<template>
  <v-card class="mx-auto" min-width="300" max-width="400">
    <v-card-item class="app-food-card">
      <v-card-title>{{ food.brand }}</v-card-title>
      <v-card-subtitle>{{ food.variety }}</v-card-subtitle>
    </v-card-item>
    <v-card-text>
      <div class="app--is-opaque text-body-3 px-2">
        <template v-for="(m, key) in meta" :key="key">
          {{ m!.label }}: {{ m!.value }} {{ m!.unit }}<br />
        </template>
      </div>
    </v-card-text>
    <v-expansion-panels variant="accordion">
      <v-expansion-panel class="app-food-card__panel" title="Variations">
        <v-expansion-panel-text class="app-food-card__panel--no-gutter">
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-expansion-panels>
      <v-expansion-panel class="app-food-card__panel" title="Composition">
        <v-expansion-panel-text class="app-food-card__panel--no-gutter">
          <v-table>
            <thead>
              <tr>
                <th class="text-left">Composition</th>
                <th class="text-left">Matière brute</th>
                <th class="text-left">Matière sèche</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(comp, key) in composition" :key="key">
                <td>
                  <span class="text-body-2">{{ comp!.label }}</span
                  ><br v-if="comp!.subLabel" /><span
                    v-if="comp!.subLabel"
                    class="app--is-opaque text-body-4"
                    >{{ comp!.subLabel }}</span
                  >
                </td>
                <td class="text-body-2">{{ comp!.raw }}%</td>
                <td class="text-body-2">
                  {{ comp!.dry ? `${comp!.dry}%` : '-' }}
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>
<style lang="scss">
  @use 'assets/scss/variables' as var;
  @include var.app {
    &-food-card {
      .v-card-subtitle {
        min-height: 44px;
        text-overflow: clip;
        white-space: normal;
      }
      &__panel {
        .v-expansion-panel-title {
          border-radius: 0;
        }
        &--no-gutter {
          .v-expansion-panel-text__wrapper {
            padding-left: 0;
            padding-right: 0;
          }
        }
      }
    }
  }
</style>
