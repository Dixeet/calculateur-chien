import dogDescriptionApi from './api/dogDescriptionApi';
import { kibbleApi, tinCanApi } from './api/foodApi';

export default function useApi() {
  return {
    activities: dogDescriptionApi('activities'),
    sterilizationStatus: dogDescriptionApi('sterilizationStatus'),
    bodyConditions: dogDescriptionApi('bodyConditions'),
    livingPlaces: dogDescriptionApi('livingPlaces'),
    races: dogDescriptionApi('races'),
    lifeStages: dogDescriptionApi('lifeStages'),
    kibbles: kibbleApi(),
    tincans: tinCanApi(),
  };
}

export {
  type FoodType,
  type Food,
  type Kibble,
  type TinCan,
  isFoodApi,
} from './api/foodApi';

export { type DogDescriptionsType } from './api/dogDescriptionApi';
