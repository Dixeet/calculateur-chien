import DogDescriptionApi from '~/composables/api/dogDescriptionApi';
import { KibbleApi, TinCanApi } from '~/composables/api/foodApi';

export default function useApi() {
  return {
    activities: new DogDescriptionApi('activities'),
    sterilizationStatus: new DogDescriptionApi('sterilizationStatus'),
    bodyConditions: new DogDescriptionApi('bodyConditions'),
    livingPlaces: new DogDescriptionApi('livingPlaces'),
    races: new DogDescriptionApi('races'),
    lifeStages: new DogDescriptionApi('lifeStages'),
    kibbles: new KibbleApi(),
    tinCans: new TinCanApi(),
  };
}

export { KibbleApi } from './api/foodApi';
export { TinCanApi } from './api/foodApi';
