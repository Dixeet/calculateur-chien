import { unref } from '#imports';
import type { Ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

export const isClient = typeof window !== 'undefined';

export function deepClone<T extends object | Ref<T> = object>(
  obj: T | Ref<T>,
): T {
  return JSON.parse(JSON.stringify(unref(obj)));
}
export function byteSize(str: string | null) {
  return str ? new Blob([str]).size : 0;
}
export function round(number: number, decimal = 0) {
  const factor = Math.pow(10, decimal);
  return Math.round(number * factor) / factor;
}
export function simpleUid() {
  return Math.random().toString(16).slice(2);
}

export function uuid() {
  return uuidv4();
}
