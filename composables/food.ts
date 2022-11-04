import {
  type ObjectDescriptor,
  useValidator,
  round,
  type WithoutId,
  Entries,
  isFieldDescriptor,
} from '#imports';

interface Composition {
  proteines: number;
  lipides: number;
  fibres: number;
  cendres: number;
  humidity: number;
  calcium?: number;
  phosphore?: number;
}
interface CompleteComposition extends Composition {
  ena: number;
}
interface Matter {
  raw: number;
  dry?: number;
  label: string;
  subLabel?: string;
}
type CompositionDetails = {
  [K in keyof CompleteComposition]: Matter;
};
type MetaDetail<T> = {
  [K in keyof T]: { value: unknown; label: unknown; unit: unknown };
};
interface Food {
  id: string;
  brand: string;
  variety: string;
  composition: Composition;
  meta: { price?: number; pricePerKg?: (m: Food['meta']) => number };
  variations: Food['meta'][];
}
interface Kibble extends Omit<Food, 'variations'> {
  meta: Food['meta'] & {
    weight?: number;
    pricePerKg?: number;
  };
  variations: Kibble['meta'][];
}
interface TinCan extends Omit<Food, 'variations'> {
  meta: Food['meta'] & {
    numberOfCans?: number;
    canWeight?: number;
    pricePerKg?: number;
  };
  variations: TinCan['meta'][];
}

type FoodTypeName = 'kibbles' | 'tincans';
type FoodType = Kibble | TinCan;
type FoodDescriptor = WithoutId<Food> & {
  composition: {
    dividerOne?: 'divider';
  };
};

function getEna(comp: Composition) {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars
  -- composition object without phosphore and calcium*/
  const { phosphore, calcium, ...composition } = comp;
  return Object.values(composition).reduce((p, c) => p - c, 100);
}

function getDryComposition(
  composition: CompleteComposition,
): CompleteComposition {
  const dry = (matter: number) =>
    round((matter * 100) / (100 - composition.humidity), 1);

  return {
    proteines: dry(composition.proteines),
    lipides: dry(composition.lipides),
    fibres: dry(composition.fibres),
    cendres: dry(composition.cendres),
    humidity: 0,
    ena: dry(composition.ena),
  };
}

function getCompositionDetails(
  compositionObj: Composition,
  compositionDescriptor: ObjectDescriptor<Composition>,
) {
  const rawComp: CompleteComposition = {
    ...compositionObj,
    ena: getEna(compositionObj),
  };
  const dryComp = getDryComposition(rawComp);
  const getDetail = (property: keyof Composition): Matter => ({
    raw: rawComp[property]!,
    dry: dryComp[property],
    label: compositionDescriptor[property]?.label ?? '',
    subLabel: compositionDescriptor[property]?.subLabel ?? '',
  });
  const res: CompositionDetails = {
    proteines: getDetail('proteines'),
    lipides: getDetail('lipides'),
    fibres: getDetail('fibres'),
    cendres: getDetail('cendres'),
    humidity: getDetail('humidity'),
    ena: {
      raw: rawComp.ena,
      dry: dryComp.ena,
      label: 'ENA',
      subLabel: 'Glucides',
    },
  };
  if (rawComp.calcium) {
    res.calcium = getDetail('calcium');
  }
  if (rawComp.phosphore) {
    res.phosphore = getDetail('phosphore');
  }

  return res;
}

function getMetaDetail<T extends Food>(
  meta: T['meta'],
  metaDescriptor: ObjectDescriptor<T['meta']>,
) {
  const res = {} as MetaDetail<T['meta']>;
  for (const [key, m] of Object.entries(metaDescriptor) as Entries<
    typeof metaDescriptor
  >) {
    if (isFieldDescriptor(m)) {
      if (meta[key]) {
        res[key] = {
          value: meta[key],
          label: m.label,
          unit: m.unit!,
        };
      } else if (m.type === 'function') {
        const value = m.default(meta);
        if (typeof value !== 'undefined') {
          res[key] = {
            value: m.default(meta),
            label: m.label,
            unit: m.unit!,
          };
        }
      }
    }
  }
  return res;
}

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
        label: 'Protéines',
        preLabel: '% de ',
      },
      lipides: {
        type: 'number',
        default: 0,
        min: 0,
        max: 100,
        required: true,
        rules: compositionRules,
        label: 'Lipides',
        subLabel: 'Matières Grasses',
        preLabel: '% de ',
      },
      fibres: {
        type: 'number',
        default: 0,
        min: 0,
        max: 100,
        required: true,
        rules: compositionRules,
        label: 'Fibres',
        subLabel: 'Cellulose Brute',
        preLabel: '% de ',
      },
      cendres: {
        type: 'number',
        default: 0,
        min: 0,
        max: 100,
        required: true,
        rules: compositionRules,
        label: 'Cendres',
        subLabel: 'Matière Minérales',
        preLabel: '% de ',
      },
      humidity: {
        type: 'number',
        default: 0,
        min: 0,
        max: 100,
        required: true,
        rules: compositionRules,
        label: 'Humidité',
        preLabel: "% d'",
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
        label: 'Calcium',
        preLabel: '% de ',
        postLabel: ' (0 si non renseigné)',
      },
      phosphore: {
        type: 'number',
        default: 0,
        min: 0,
        max: 100,
        rules: getRules(min(0), max(100)),
        label: 'Phosphore',
        preLabel: '% de ',
        postLabel: ' (0 si non renseigné)',
      },
    },
    meta: {
      price: {
        default: 0,
        rules: minZeroRule,
        type: 'number',
        min: 0,
        label: 'Prix',
        unit: '€',
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
    getCompositionDetails(composition: Composition) {
      return getCompositionDetails(
        composition,
        this.objectDescriptor.composition,
      );
    },
    getMetaDetail<T extends Food>(meta: T['meta']) {
      return getMetaDetail(meta, this.objectDescriptor.meta);
    },
  };
}

function useKibble() {
  const foodFormDescriptor = useFood().objectDescriptor;
  const objectDescriptor: ObjectDescriptor<WithoutId<Kibble>> = {
    ...foodFormDescriptor,
    meta: {
      ...foodFormDescriptor.meta,
      pricePerKg: {
        custom: true,
        label: 'Prix au kilo',
        type: 'function',
        unit: '€/kg',
        default: (meta: Kibble['meta']) =>
          typeof meta.price !== 'undefined' && meta?.weight
            ? round(meta.price / meta.weight, 2)
            : undefined,
      },
      weight: {
        default: 0,
        type: 'number',
        min: 0,
        label: 'Poids du sac',
        rules: minZeroRule,
        unit: 'kg',
      },
    },
  };

  return {
    ...useFood(),
    objectDescriptor,
  };
}

function useTinCan() {
  const foodFormDescriptor = useFood().objectDescriptor;
  const objectDescriptor: ObjectDescriptor<WithoutId<TinCan>> = {
    ...foodFormDescriptor,
    meta: {
      ...foodFormDescriptor.meta,
      pricePerKg: {
        custom: true,
        label: 'Prix au kilo',
        unit: '€/kg',
        type: 'function',
        default: (meta: TinCan['meta']) =>
          typeof meta.price !== 'undefined' &&
          meta?.canWeight &&
          meta?.numberOfCans
            ? round(meta.price / (meta.canWeight * meta.numberOfCans), 2)
            : undefined,
      },
      canWeight: {
        default: 0,
        type: 'number',
        min: 0,
        label: "Poids d'une boite",
        unit: 'kg',
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
    ...useFood(),
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
  type FoodTypeName,
  type Kibble,
  type TinCan,
};
