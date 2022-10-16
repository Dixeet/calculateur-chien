import useLocalStorage from '#imports';

const localStorage = useLocalStorage();
export class FoodApi {
  type = '';
  #data = [];
  constructor(type) {
    this.type = type;
    this.#data = localStorage.get(type) ?? [];
  }

  static new() {
    return {
      proteines: 0,
      lipides: 0,
      fibres: 0,
      cendres: 0,
      humidity: 0,
      calcium: 0,
      phosphore: 0,
      meta: {
        price: 0,
        brand: '',
        variety: '',
      },
      variations: [],
    };
  }

  async find(fn = null) {
    if (typeof fn === 'function') {
      const res = this.#data.filter(fn);
      if (res.length === 0) {
        throw new Error(`No ${this.type} found with this filter`);
      }
      return res;
    }
    return this.#data;
  }

  async create(food) {
    this.#data.push(food);
    this.updateStorage();
    return food;
  }

  async delete(fn) {
    const index = this.#data.findIndex(fn);
    const res = this.#data.splice(index, 1);
    this.updateStorage();
    return res;
  }

  async clear() {
    this.#data = [];
    useLocalStorage().remove(this.type);
    return this.#data;
  }

  updateStorage() {
    useLocalStorage().set(this.type, this.#data);
  }
}

const kibblesName = 'kibbles';
localStorage.registerService(kibblesName);
export class KibbleApi extends FoodApi {
  constructor() {
    super(kibblesName);
  }

  static name = kibblesName;

  static new() {
    const food = super.new();
    return {
      ...food,
      meta: {
        ...food.meta,
        weight: 0,
      },
    };
  }
}

const tincanName = 'tincan';
localStorage.registerService(tincanName);
export class TinCanApi extends FoodApi {
  constructor() {
    super(tincanName);
  }

  static name = tincanName;

  static new() {
    const food = super.new();
    return {
      ...food,
      meta: {
        ...food.meta,
        numberOfCans: 0,
        canWeight: 0,
      },
    };
  }
}
