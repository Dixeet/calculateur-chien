import DogDescriptionApi from './api/dogDescriptionApi';
import { KibbleApi, TinCanApi } from '~/composables/api/foodApi';

export default function useApi() {
  return {
    activities: new DogDescriptionApi('activities'),
    sterilizationStatus: new DogDescriptionApi('sterilizationStatus'),
    bodyConditions: new DogDescriptionApi('bodyConditions'),
    livingPlaces: new DogDescriptionApi('livingPlaces'),
    races: new DogDescriptionApi('races'),
    lifeStages: new DogDescriptionApi('lifeStages'),
    [KibbleApi.name]: new KibbleApi(),
    [TinCanApi.name]: new TinCanApi(),
  };
}

export { KibbleApi, TinCanApi } from '~/composables/api/foodApi';
