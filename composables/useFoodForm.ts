import useValidator, { type Validator } from '~/composables/useValidator';

export interface FieldDescription {
  attribut?: string;
  type?: string;
  min?: number;
  max?: number;
  required?: boolean;
  rules?: Validator[];
  label?: string;
}

export default function useFoodForm() {
  function getCompositionsFields(): FieldDescription[] {
    const { getRules, required, min, max } = useValidator();
    const compositionRules = getRules(required(), min(0), max(100));
    return [
      {
        attribut: 'proteines',
        type: 'number',
        min: 0,
        max: 100,
        required: true,
        rules: compositionRules,
        label: '% de Protéines *',
      },
      {
        attribut: 'lipides',
        type: 'number',
        min: 0,
        max: 100,
        required: true,
        rules: compositionRules,
        label: '% de Lipides / Matières Grasses *',
      },
      {
        attribut: 'fibres',
        type: 'number',
        min: 0,
        max: 100,
        required: true,
        rules: compositionRules,
        label: '% de Fibres / Cellulose Brute *',
      },
      {
        attribut: 'cendres',
        type: 'number',
        min: 0,
        max: 100,
        required: true,
        rules: compositionRules,
        label: '% de Cendres / Matières Minérales *',
      },
      {
        attribut: 'humidity',
        type: 'number',
        min: 0,
        max: 100,
        required: true,
        rules: compositionRules,
        label: "% d'Humidité *",
      },
      {
        type: 'divider',
      },
      {
        attribut: 'calcium',
        type: 'number',
        min: 0,
        max: 100,
        rules: getRules(min(0), max(100)),
        label: '% de Calcium (0 si non renseigné)',
      },
      {
        attribut: 'phosphore',
        type: 'number',
        min: 0,
        max: 100,
        rules: getRules(min(0), max(100)),
        label: '% de Phosphore (0 si non renseigné)',
      },
    ];
  }

  function getBasicDescriptionFields(): FieldDescription[] {
    const { getRules, required } = useValidator();
    const requiredRule = getRules(required());
    return [
      {
        attribut: 'brand',
        required: true,
        rules: requiredRule,
        label: 'Marque',
      },
      {
        attribut: 'variety',
        required: true,
        rules: requiredRule,
        label: 'Variété',
      },
    ];
  }

  return {
    getCompositionsFields,
    getBasicDescriptionFields,
  };
}
