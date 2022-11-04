import { unref } from '#imports';
import type { Ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

type WithoutId<T> = Omit<T, 'id'>;

const isClient = typeof window !== 'undefined';

function deepClone<T extends object | Ref<T> = object>(obj: T | Ref<T>): T {
  return JSON.parse(JSON.stringify(unref(obj)));
}
function byteSize(str: string | null) {
  return str ? new Blob([str]).size : 0;
}
function round(number: number, decimal = 0) {
  const factor = Math.pow(10, decimal);
  return Math.round(number * factor) / factor;
}
function simpleUid() {
  return Math.random().toString(16).slice(2);
}

function uuid() {
  return uuidv4();
}

export {
  isClient,
  deepClone,
  byteSize,
  round,
  simpleUid,
  uuid,
  type Entries,
  type WithoutId,
};
