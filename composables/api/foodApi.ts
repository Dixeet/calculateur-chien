import {
  uuid,
  NotFoundError,
  DuplicateError,
  useLocalStorage,
  useObjectFieldsDescriptor,
  useFood,
  useKibble,
  useTinCan,
  type Food,
  type Kibble,
  type TinCan,
  type FoodType,
} from '#imports';

type TinCanApi = ReturnType<typeof tinCanApi>;
type FoodApi = ReturnType<typeof foodApi>;
type KibbleApi = ReturnType<typeof kibbleApi>;

function isFoodApi(obj: object): obj is FoodApi {
  return (obj as FoodApi).getFormDescriptor !== undefined;
}

function foodApi<Type extends Food | Kibble | TinCan = Food>(type: FoodType) {
  let data: Array<Type> = localStorage.get(type) ?? [];

  return {
    getFormDescriptor() {
      return useFood().objectDescriptor;
    },

    new() {
      return getDefaultObject<Food>(this.getFormDescriptor());
    },

    async find(fn: ((entity: Type) => boolean) | null = null) {
      if (typeof fn === 'function') {
        const res = data.filter(fn);
        if (res.length === 0) {
          throw new NotFoundError(`No ${type} found with this filter`, {
            reason: {
              entity: type,
            },
          });
        }
        return res;
      }
      return data;
    },

    async findById(id: 'string') {
      try {
        return this.find((f: Type) => f.id === id);
      } catch (e) {
        if (e instanceof NotFoundError) {
          throw new NotFoundError(`No ${type} found with this id : ${id}`, {
            reason: {
              entity: type,
              searchParams: [{ name: 'id', value: id }],
            },
          });
        } else {
          throw e;
        }
      }
    },

    async create(
      food: Type,
      checkForDuplicate: ((entity: Type) => boolean) | null = (f: Type) => {
        return (
          (f.brand === food.brand && f.variety === food.variety) ||
          f.id === food.id
        );
      },
    ) {
      food.id = uuid();
      if (checkForDuplicate) {
        try {
          const found = await this.find(checkForDuplicate);
          if (found?.length > 0) {
            const isIdDuplicate = found[0].id === food.id;
            const message = isIdDuplicate
              ? `Food with id : ${food.id} already exists`
              : `${food.brand} ${food.variety} already exists`;
            throw new DuplicateError(message, {
              reason: {
                entity: type,
                searchParams: isIdDuplicate
                  ? [{ name: 'id', value: food.id }]
                  : [
                      { name: 'marque', value: food.brand },
                      { name: 'variété', value: food.variety },
                    ],
              },
            });
          }
        } catch (e) {
          if (!(e instanceof NotFoundError)) {
            throw e;
          }
        }
      }
      data.push(food);
      this.updateStorage();
      return food;
    },

    async delete(fn: (entity: Type) => boolean) {
      const index = data.findIndex(fn);
      if (index === -1) {
        throw new NotFoundError(`No ${type} found to delete with this filter`, {
          reason: {
            entity: type,
          },
        });
      }
      const res = data.splice(index, 1);
      this.updateStorage();
      return res;
    },

    async deleteById(id: string) {
      try {
        return this.delete((f: Type) => f.id === id);
      } catch (e) {
        if (e instanceof NotFoundError) {
          throw new NotFoundError(
            `No ${type} found to delete with this id : ${id}`,
            {
              reason: {
                entity: type,
                searchParams: [{ name: 'id', value: id }],
              },
            },
          );
        } else {
          throw e;
        }
      }
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

function isKibbleApi(obj: object): obj is KibbleApi {
  return (obj as KibbleApi).name !== 'kibbles';
}

function kibbleApi() {
  const kibblesName: FoodType = 'kibbles';
  localStorage.registerService(kibblesName);
  const kibble = foodApi<Kibble>(kibblesName);
  return {
    name: kibblesName,
    ...kibble,
    getFormDescriptor() {
      return useKibble().objectDescriptor;
    },
    new() {
      return getDefaultObject<Kibble>(this.getFormDescriptor());
    },
  };
}

function isTinCanApi(obj: object): obj is TinCanApi {
  return (obj as TinCanApi).name !== 'tincans';
}

function tinCanApi() {
  const tincanName: FoodType = 'tincans';
  localStorage.registerService(tincanName);
  const tincan = foodApi<TinCan>(tincanName);
  return {
    name: tincanName,
    ...tincan,
    getFormDescriptor() {
      return useTinCan().objectDescriptor;
    },
    new() {
      return getDefaultObject<TinCan>(this.getFormDescriptor());
    },
  };
}

const localStorage = useLocalStorage();
const { getDefaultObject } = useObjectFieldsDescriptor();

export {
  isFoodApi,
  foodApi,
  isKibbleApi,
  kibbleApi,
  isTinCanApi,
  tinCanApi,
  type FoodApi,
};
