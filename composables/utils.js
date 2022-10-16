import { unref } from '#imports';

export const isClient = typeof window !== 'undefined';

export function deepClone(obj) {
  return JSON.parse(JSON.stringify(unref(obj)));
}
export function byteSize(str) {
  return new Blob([str]).size;
}
export function round(number, decimal = 0) {
  const factor = Math.pow(10, decimal);
  return Math.round(number * factor) / factor;
}
