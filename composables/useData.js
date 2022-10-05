import data from '../data/data.json';

export default function useData() {
  class Entities {
    constructor(name) {
      this.name = name;
      this._data = data[name] || [];
    }
    find(fn = null) {
      return new Promise((resolve, reject) => {
        if (typeof fn === 'function') {
          const res = this._data.filter(fn);
          if (res.length === 0) {
            reject(`No ${this.name} found with this filter`);
          }
          resolve(res);
        }
        resolve(this._data);
      });
    }
    findByLabel(label) {
      return new Promise((resolve, reject) => {
        const res = this._data.find((entity) => entity.label === label);
        if (res) {
          resolve(res);
        }
        reject(`No ${this.name} found with this label "${label}"`);
      });
    }
  }
  return {
    activities: new Entities('activities'),
    sterilizationStatus: new Entities('sterilizationStatus'),
    bodyConditions: new Entities('bodyConditions'),
    livingPlaces: new Entities('livingPlaces'),
    races: new Entities('races'),
    lifeStages: new Entities('lifeStages'),
  };
}
