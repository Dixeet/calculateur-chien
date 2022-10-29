import { reactive, ref, watch, byteSize, isClient } from '#imports';

const servicesRegistered: string[] = reactive([]);
const storageUsed = ref(getStorageUsage());

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
    registerService(name: string) {
      if (!servicesRegistered.includes(name)) {
        servicesRegistered.push(name);
      }
    },
    get(key: string) {
      if (isClient) {
        const result = localStorage.getItem(key);
        return result ? JSON.parse(result) : null;
      }
      return null;
    },
    set(key: string, value: object) {
      if (isClient) {
        const data = typeof value === 'object' ? JSON.stringify(value) : value;
        localStorage.setItem(key, data);
        this.refreshStorageUsed();
      }
    },
    remove(key: string) {
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
      function add(num: number) {
        return new Array(num * 1024 + 1).join('a');
      }

      if (isClient) {
        this.remove('test');
        let i = 0;
        try {
          for (i = 0; i <= 10000; i += 250) {
            this.set('test', add(i));
          }
        } catch (e) {
          // eslint-disable-next-line no-console -- print results
          console.log(i - 250);
        }
      }
    },
  };
}
