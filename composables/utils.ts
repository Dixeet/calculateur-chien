import { unref } from '#imports';

export const isClient = typeof window !== 'undefined';

export function deepClone(obj: object): object {
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
