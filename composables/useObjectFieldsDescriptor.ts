import { type Validator } from './useValidator';

enum InputType {
  array,
  button,
  checkbox,
  color,
  date,
  'datetime-local',
  divider,
  email,
  file,
  hidden,
  image,
  month,
  number,
  password,
  radio,
  range,
  reset,
  search,
  submit,
  tel,
  text,
  time,
  url,
  week,
}

interface FieldDescriptor {
  default?: any;
  type?: keyof typeof InputType;
  min?: number;
  max?: number;
  required?: boolean;
  rules?: Validator[];
  label?: string;
  custom?: boolean;
}

type ExcludeFieldDescriptorKeys<K> = Exclude<K, keyof FieldDescriptor>;

type ObjectDescriptor<T> = {
  [K in keyof (T & FieldDescriptor)]:
    | FieldDescriptor
    | ObjectDescriptor<T[ExcludeFieldDescriptorKeys<K>]>;
};

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

function isFieldDescriptor<T>(
  obj: FieldDescriptor | ObjectDescriptor<T>,
): obj is FieldDescriptor {
  const isBasic =
    (obj as FieldDescriptor).default !== undefined &&
    (obj as FieldDescriptor).label !== undefined;
  const isCustom = (obj as FieldDescriptor).custom !== undefined;
  return isBasic || isCustom;
}

function useObjectFieldsDescriptor() {
  function getDefaultObject<T>(obj: ObjectDescriptor<T>) {
    const res = {} as T;
    for (const [key, value] of Object.entries(obj) as Entries<T | FieldDescriptor>) {
      if (isFieldDescriptor(value) && typeof value.default !== undefined) {
        res[key] = (value as FieldDescriptor).default;
      } else if (!isFieldDescriptor(value)) {
        res[key] = getDefaultObject(value as ObjectDescriptor<T[typeof key]>);
      }
    }
    return res;
  }

  return {
    getDefaultObject,
  };
}

export default useObjectFieldsDescriptor;
export { type ObjectDescriptor, type FieldDescriptor };
