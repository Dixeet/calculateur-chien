import { useLocalStorage, NotFoundError } from '#imports';

export interface Food {
  brand: string;
  variety: string;
  composition: {
    proteines: number;
    lipides: number;
    fibres: number;
    cendres: number;
    humidity: number;
    calcium?: number;
    phosphore?: number;
  };
  meta?: { price?: number };
  variations?: Food['meta'][];
}

export interface Kibble extends Omit<Food, 'variations'> {
  meta?: Food['meta'] & {
    weight?: number;
  };
  variations?: Kibble['meta'][];
}

export interface TinCan extends Omit<Food, 'variations'> {
  meta?: Food['meta'] & {
    numberOfCans?: number;
    canWeight?: number;
  };
  variations?: TinCan['meta'][];
}

export type FoodType = 'kibbles' | 'tincans';

const localStorage = useLocalStorage();

export function foodApi<Type extends Food | Kibble | TinCan = Food>(
  type: FoodType,
) {
  let data: Array<Type> = localStorage.get(type) ?? [];

  return {
    new(): Food {
      return {
        brand: '',
        variety: '',
        composition: {
          proteines: 0,
          lipides: 0,
          fibres: 0,
          cendres: 0,
          humidity: 0,
          calcium: 0,
          phosphore: 0,
        },
        meta: {
          price: 0,
        },
        variations: [],
      };
    },

    async find(fn: ((entity: Type) => boolean) | null = null) {
      if (typeof fn === 'function') {
        const res = data.filter(fn);
        if (res.length === 0) {
          throw new NotFoundError(`No ${type} found with this filter`);
        }
        return res;
      }
      return data;
    },

    async create(food: Type) {
      data.push(food);
      this.updateStorage();
      return food;
    },

    async delete(fn: (entity: Type) => boolean) {
      const index = data.findIndex(fn);
      if (index === -1) {
        throw new NotFoundError(`No ${type} found to delete with this filter`);
      }
      const res = data.splice(index, 1);
      this.updateStorage();
      return res;
    },

    async clear() {
      data = [];
      useLocalStorage().remove(type);
      return data;
    },

    updateStorage() {
      useLocalStorage().set(type, data);
    },
  };
}

export function kibbleApi() {
  const kibblesName: FoodType = 'kibbles';
  localStorage.registerService(kibblesName);
  const kibble = foodApi<Kibble>(kibblesName);
  return {
    name: kibblesName,
    ...kibble,
    new(): Kibble {
      const food = kibble.new();
      return {
        ...food,
        meta: {
          ...food.meta,
          weight: 0,
        },
        variations: [],
      };
    },
  };
}

export function tinCanApi() {
  const tincanName: FoodType = 'tincans';
  localStorage.registerService(tincanName);
  const tincan = foodApi<TinCan>(tincanName);
  return {
    name: tincanName,
    ...tincan,
    new() {
      const food = tincan.new();
      return {
        ...food,
        meta: {
          ...food.meta,
          numberOfCans: 0,
          canWeight: 0,
        },
        variations: [],
      };
    },
  };
}
