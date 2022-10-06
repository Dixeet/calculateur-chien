import dogDescriptions from './dogDescriptions.json';

export default class DogDescriptionApi {
  name = '';
  #data = [];
  constructor(name) {
    this.name = name;
    this.#data = dogDescriptions[name] || [];
  }
  async find(fn = null) {
    if (typeof fn === 'function') {
      const res = this.#data.filter(fn);
      if (res.length === 0) {
        throw new Error(`No ${this.name} found with this filter`);
      }
      return res;
    }
    return this.#data;
  }
  async findByLabel(label) {
    const res = this.#data.find((entity) => entity.label === label);
    if (res) {
      return res;
    }
    throw new Error(`No ${this.name} found with this label "${label}"`);
  }
}
