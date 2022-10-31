<script lang="ts" setup>
  import {
    useBlockCssProperties,
    type Notification,
    isRef,
    computed,
  } from '#imports';

  function closeTimeout(notif: Notification) {
    if (notif.timeout && notif.timeout > -1) {
      setTimeout(() => close(notif), notif.timeout);
    }
  }
  function close(notif: Notification) {
    const res = props.deleteFn(notif.id, [...props.modelValue]);
    emit('update:modelValue', res);
  }

  const props = defineProps({
    ...useBlockCssProperties({
      zIndex: 3000,
      maxWidth: '400px',
      minWidth: '300px',
    }),
    modelValue: {
      type: [Array],
      default() {
        return [];
      },
      validator(provider) {
        return (
          (isRef(provider) && Array.isArray(provider.value)) ||
          Array.isArray(provider)
        );
      },
    },
    transition: {
      type: String,
      default: 'slide-y-transition',
    },
    deleteFn: {
      type: Function,
      default(val: number | Notification | string, arr: Notification[]) {
        const deleteNotif = (index: number, arr: Notification[]) => {
          arr.splice(index, 1);
          return arr;
        };
        const deleteByFn = (
          fn: (notif: Notification) => boolean,
          arr: Notification[],
        ) => {
          const index = arr.findIndex(fn);
          if (index > -1) {
            return deleteNotif(index, arr);
          }
          return arr;
        };
        switch (typeof val) {
          case 'object':
            return deleteByFn((notif) => notif.id === val.id, arr);
          case 'number':
            return deleteNotif(val, arr);
          case 'string': {
            return deleteByFn((notif) => notif.id === val, arr);
          }
        }
      },
    },
  });
  const emit = defineEmits(['update:modelValue']);

  const notifications = computed(() => {
    return props.modelValue.map((notif: Notification) => {
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars
      -- On purpose to exclude some properties from notif Object
       */
      const alertProps = (({ message, id, timeout, isHtml, ...obj }) => obj)(
        notif,
      );
      const { message, id, timeout, isHtml } = notif;
      return {
        message,
        id,
        timeout,
        isHtml,
        alertProps,
        icon: notif.icon ?? notif.type ? `$${notif.type}` : null,
      };
    });
  });
</script>
<template>
  <div
    v-show="notifications && notifications.length > 0"
    class="app-notifications">
    <v-container>
      <transition-group :name="transition">
        <v-alert
          v-for="notif in notifications"
          :key="notif.id"
          class="app-notifications__alert mb-3 bg-surface"
          :icon="notif.icon"
          v-bind="notif.alertProps"
          :timeout="closeTimeout(notif)"
          @update:model-value="close(notif)">
          <template v-if="notif.icon" #prepend>
            <slot name="icon" :icon="notif.icon">
              <v-icon
                :icon="notif.icon"
                :density="notif.alertProps.density"
                size="large" />
            </slot>
          </template>
          <template v-if="notif.alertProps.title" #title>
            <slot name="title" :title="notif.alertProps.title">
              <div class="text-body-1">
                {{ notif.alertProps.title }}
              </div>
            </slot>
          </template>
          <slot name="default" :notif="notif">
            <!-- eslint-disable vue/no-v-html vue/no-useless-template-attributes -->
            <div
              v-if="notif.isHtml"
              class="text-body-2"
              v-html="notif.message" />
            <div v-else class="text-body-2">
              {{ notif.message }}
            </div>
          </slot>
        </v-alert>
      </transition-group>
    </v-container>
  </div>
</template>
<style lang="scss">
  @use 'assets/scss/variables' as var;
  @include var.app {
    &-notifications {
      position: v-bind('props.position');
      top: v-bind('props.top');
      bottom: v-bind('props.bottom');
      left: v-bind('props.left');
      right: v-bind('props.right');
      z-index: v-bind('props.zIndex');
      width: v-bind('props.width');
      max-width: v-bind('props.maxWidth');
      min-width: v-bind('props.minWidth');
      height: v-bind('props.height');
      max-height: v-bind('props.maxHeight');
      min-height: v-bind('props.minHeight');
      @media (max-width: 600px) {
        top: 0;
      }
      &__alert {
        .v-alert__close {
          margin-inline-start: 15px;
        }
        .v-alert__prepend {
          margin-top: auto;
          margin-bottom: auto;
        }
      }
    }
  }
</style>
