import DogDescriptionApi from './api/dogDescriptionApi';

export default function useApi() {
  return {
    activities: new DogDescriptionApi('activities'),
    sterilizationStatus: new DogDescriptionApi('sterilizationStatus'),
    bodyConditions: new DogDescriptionApi('bodyConditions'),
    livingPlaces: new DogDescriptionApi('livingPlaces'),
    races: new DogDescriptionApi('races'),
    lifeStages: new DogDescriptionApi('lifeStages'),
  };
}
