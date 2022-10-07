import { isClient } from './utils';

export default function useLocalStorage() {
  return {
    get(key) {
      if (isClient) {
        const result = localStorage.getItem(key);
        try {
          return JSON.parse(result);
        } catch (e) {
          if (e instanceof SyntaxError) {
            return result;
          }
          throw e;
        }
      }
      return null;
    },
    set(key, value) {
      if (isClient) {
        const data = typeof value === 'object' ? JSON.stringify(value) : value;
        localStorage.setItem(key, data);
      }
    },
    remove(key) {
      if (isClient) {
        localStorage.removeItem(key);
      }
    },
    clear() {
      if (isClient) {
        localStorage.clear();
      }
    },
  };
}
