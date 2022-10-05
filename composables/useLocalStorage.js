export default function useLocalStorage() {
  return {
    get(key) {
      if (typeof window !== 'undefined') {
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
      if (typeof window !== 'undefined') {
        const data = typeof value === 'object' ? JSON.stringify(value) : value;
        localStorage.setItem(key, data);
      }
    },
    remove(key) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    },
    clear() {
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
    },
  };
}
