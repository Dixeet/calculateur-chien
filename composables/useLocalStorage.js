import { reactive, ref, watch, byteSize, isClient } from '#imports';

const servicesRegistered = reactive([]);
let storageUsed = ref(getStorageUsage());

function getStorageUsage() {
  let res = 0;
  if (isClient) {
    servicesRegistered.forEach((service) => {
      res += byteSize(localStorage.getItem(service));
    });
  }
  return res;
}

watch(servicesRegistered, () => (storageUsed.value = getStorageUsage()));

export default function useLocalStorage() {
  return {
    storageUsed,
    registerService(name) {
      if (!servicesRegistered.includes(name)) {
        servicesRegistered.push(name);
      }
    },
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
        this.refreshStorageUsed();
      }
    },
    remove(key) {
      if (isClient) {
        localStorage.removeItem(key);
        this.refreshStorageUsed();
      }
    },
    clear() {
      if (isClient) {
        localStorage.clear();
        this.refreshStorageUsed();
      }
    },
    refreshStorageUsed() {
      this.storageUsed.value = getStorageUsage();
    },

    testLocalStorage() {
      function add(num) {
        return new Array(num * 1024 + 1).join('a');
      }

      if (isClient) {
        this.remove('test');
        let i;
        try {
          for (i = 0; i <= 10000; i += 250) {
            this.set('test', add(i));
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(i - 250);
        }
      }
    },
  };
}
