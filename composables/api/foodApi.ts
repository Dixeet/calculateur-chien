import {
  useLocalStorage,
  NotFoundError,
  useObjectFieldsDescriptor,
  type ObjectDescriptor,
  useValidator,
} from '#imports';

const { getDefaultObject } = useObjectFieldsDescriptor();

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
const { getRules, required, min, max } = useValidator();
const compositionRules = getRules(required(), min(0), max(100));
const requiredRule = getRules(required());
const minZeroRule = getRules(min(0));

export function foodApi<Type extends Food | Kibble | TinCan = Food>(
  type: FoodType,
) {
  let data: Array<Type> = localStorage.get(type) ?? [];

  return {
    getFormDescriptor(): ObjectDescriptor {
      return {
        brand: {
          required: true,
          default: '',
          rules: requiredRule,
          label: 'Marque',
        },
        variety: {
          required: true,
          default: '',
          rules: requiredRule,
          label: 'Variété',
        },
        composition: {
          fields: {
            proteines: {
              type: 'number',
              default: 0,
              min: 0,
              max: 100,
              required: true,
              rules: compositionRules,
              label: '% de Protéines *',
            },
            lipides: {
              type: 'number',
              default: 0,
              min: 0,
              max: 100,
              required: true,
              rules: compositionRules,
              label: '% de Lipides / Matières Grasses *',
            },
            fibres: {
              type: 'number',
              default: 0,
              min: 0,
              max: 100,
              required: true,
              rules: compositionRules,
              label: '% de Fibres / Cellulose Brute *',
            },
            cendres: {
              type: 'number',
              default: 0,
              min: 0,
              max: 100,
              required: true,
              rules: compositionRules,
              label: '% de Cendres / Matières Minérales *',
            },
            humidity: {
              type: 'number',
              default: 0,
              min: 0,
              max: 100,
              required: true,
              rules: compositionRules,
              label: "% d'Humidité *",
            },
            dividerOne: {
              type: 'divider',
              custom: true,
            },
            calcium: {
              type: 'number',
              default: 0,
              min: 0,
              max: 100,
              rules: getRules(min(0), max(100)),
              label: '% de Calcium (0 si non renseigné)',
            },
            phosphore: {
              type: 'number',
              default: 0,
              min: 0,
              max: 100,
              rules: getRules(min(0), max(100)),
              label: '% de Phosphore (0 si non renseigné)',
            },
          },
        },
        meta: {
          fields: {
            price: {
              default: 0,
              rules: minZeroRule,
              type: 'number',
              min: 0,
              label: 'Prix',
            },
          },
        },
        variations: {
          default: [],
          custom: true,
          type: 'array',
        },
      };
    },

    new() {
      return getDefaultObject<Food>(this.getFormDescriptor());
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
    getFormDescriptor(): ObjectDescriptor {
      const foodFormDescriptor = kibble.getFormDescriptor();
      return {
        ...foodFormDescriptor,
        meta: {
          fields: {
            ...foodFormDescriptor.meta.fields,
            weight: {
              default: 0,
              type: 'number',
              min: 0,
              label: 'Poids du sac',
              rules: minZeroRule,
            },
          },
        },
      };
    },
    new() {
      return getDefaultObject<Kibble>(this.getFormDescriptor());
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
    getFormDescriptor(): ObjectDescriptor {
      const foodFormDescriptor = tincan.getFormDescriptor();
      return {
        ...foodFormDescriptor,
        meta: {
          fields: {
            ...foodFormDescriptor.meta.fields,
            canWeight: {
              default: 0,
              type: 'number',
              min: 0,
              label: "Poids d'une boite",
              rules: minZeroRule,
            },
            numberOfCans: {
              default: 0,
              type: 'number',
              min: 0,
              label: 'Nombre de boite',
              rules: minZeroRule,
            },
          },
        },
      };
    },
    new() {
      return getDefaultObject<TinCan>(this.getFormDescriptor());
    },
  };
}
