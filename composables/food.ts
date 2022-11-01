import { type ObjectDescriptor, useValidator } from '#imports';

interface Composition {
  proteines: number;
  lipides: number;
  fibres: number;
  cendres: number;
  humidity: number;
  calcium?: number;
  phosphore?: number;
}
interface Food {
  id: string;
  brand: string;
  variety: string;
  composition: Composition;
  meta?: { price?: number };
  variations?: Food['meta'][];
}
interface Kibble extends Omit<Food, 'variations'> {
  meta?: Food['meta'] & {
    weight?: number;
  };
  variations?: Kibble['meta'][];
}
interface TinCan extends Omit<Food, 'variations'> {
  meta?: Food['meta'] & {
    numberOfCans?: number;
    canWeight?: number;
  };
  variations?: TinCan['meta'][];
}

type FoodType = 'kibbles' | 'tincans';
type WithoutId<T> = Omit<T, 'id'>;
type FoodDescriptor = WithoutId<Food> & {
  composition: {
    dividerOne?: {
      type: 'divider';
      custom: true;
    };
  };
};

function useFood() {
  const objectDescriptor: ObjectDescriptor<FoodDescriptor> = {
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
    meta: {
      price: {
        default: 0,
        rules: minZeroRule,
        type: 'number',
        min: 0,
        label: 'Prix',
      },
    },
    variations: {
      default: [],
      custom: true,
      type: 'array',
    },
  };

  return {
    objectDescriptor,
  };
}

function useKibble() {
  const foodFormDescriptor = useFood().objectDescriptor;
  const objectDescriptor: ObjectDescriptor<WithoutId<Kibble>> = {
    ...foodFormDescriptor,
    meta: {
      ...foodFormDescriptor.meta,
      weight: {
        default: 0,
        type: 'number',
        min: 0,
        label: 'Poids du sac',
        rules: minZeroRule,
      },
    },
  };

  return {
    objectDescriptor,
  };
}

function useTinCan() {
  const foodFormDescriptor = useFood().objectDescriptor;
  const objectDescriptor: ObjectDescriptor<WithoutId<TinCan>> = {
    ...foodFormDescriptor,
    meta: {
      ...foodFormDescriptor.meta,
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
  };

  return {
    objectDescriptor,
  };
}

const { getRules, required, min, max } = useValidator();
const compositionRules = getRules(required(), min(0), max(100));
const requiredRule = getRules(required());
const minZeroRule = getRules(min(0));

export {
  useFood,
  useKibble,
  useTinCan,
  type Food,
  type FoodType,
  type Kibble,
  type TinCan,
  type WithoutId,
};
