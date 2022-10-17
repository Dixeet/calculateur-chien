import dogDescriptions from './dogDescriptions.json';

interface BaseDogDescription {
  label: string;
  factor: number;
}

interface LifeStages extends BaseDogDescription {
  rpcMinTen: number;
  rpcMinTenTwentyFive: number;
  rpcMinTwentyFive: number;
  rpcMax: number;
  alertLipidesMin: number;
  alertLipidesMax: number;
  alertGlucidesMin: number;
  alertGlucidesMax: number;
  alertFibresMin: number;
  alertFibresMax: number;
  alertCendresMin: number;
  alertCendresMax: number;
  alertCalciumMinMcalBE: number;
  alertCalciumMaxMcalBE: number;
  alertPhosphoreMinMcalBE: number;
  alertPhosphoreMaxMcalBE: number;
  alertCaPMin: number;
  alertCaPMax: number;
  warningLipidesMin: number;
  warningLipidesMax: number;
  warningGlucidesMin: number;
  warningGlucidesMax: number;
  warningFibresMin: number;
  warningFibresMax: number;
  warningCendresMin: number;
  warningCendresMax: number;
  warningCalciumMinMcalBE: number;
  warningCalciumMaxMcalBE: number;
  warningPhosphoreMinMcalBE: number;
  warningPhosphoreMaxMcalBE: number;
  warningCaPMin: number;
  warningCaPMax: number;
}

type Activity = BaseDogDescription;
type SterilizationStatus = BaseDogDescription;
type BodyConditions = BaseDogDescription;
type LivingPlaces = BaseDogDescription;
type Races = BaseDogDescription;

interface DogDescriptions {
  activities: Activity[];
  sterilizationStatus: SterilizationStatus[];
  bodyConditions: BodyConditions[];
  livingPlaces: LivingPlaces[];
  races: Races[];
  lifeStages: LifeStages[];
}

export default function dogDescriptionApi(name: keyof DogDescriptions) {
  const data = dogDescriptions[name];

  return {
    async find(fn: ((entity: object) => boolean) | null = null) {
      if (typeof fn === 'function') {
        const res = data.filter(fn);
        if (res.length === 0) {
          throw new Error(`No ${name} found with this filter`);
        }
        return res;
      }
      return data;
    },
    async findByLabel(label: string) {
      const res = data.find((entity) => entity.label === label);
      if (res) {
        return res;
      }
      throw new Error(`No ${name} found with this label "${label}"`);
    },
  };
}
