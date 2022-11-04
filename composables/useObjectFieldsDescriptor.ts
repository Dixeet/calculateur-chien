import { type Validator, type Entries } from '#imports';

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
  function,
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
  label?: string;
  subLabel?: string;
  preLabel?: string;
  postLabel?: string;
  type?: keyof typeof InputType;
  min?: number;
  max?: number;
  required?: boolean;
  rules?: Validator[];
  custom?: boolean;
}

type IsNotArrayOrFn<T> = T extends any[] | ((...f: any) => any) ? never : T;
type IsObjectOrUndef<T> = T extends object | undefined ? T : never;
type IsObjectDescriptor<T> = T extends IsObjectOrUndef<T> & IsNotArrayOrFn<T>
  ? T
  : never;

type ObjectDescriptor<T> = {
  [K in keyof T]: T[K] extends IsObjectDescriptor<T[K]>
    ? ObjectDescriptor<T[K]>
    : FieldDescriptor;
};

function isFieldDescriptor<T>(
  obj: FieldDescriptor | ObjectDescriptor<T>,
): obj is FieldDescriptor {
  const isBasic =
    (obj as FieldDescriptor).default !== undefined &&
    (obj as FieldDescriptor).label !== undefined;
  const isCustom = (obj as FieldDescriptor).custom !== undefined;
  return isBasic || isCustom;
}

function isObjectDescriptor<T>(
  obj: FieldDescriptor | ObjectDescriptor<T>,
): obj is ObjectDescriptor<T> {
  return !isFieldDescriptor(obj);
}

function useObjectFieldsDescriptor() {
  function getDefaultObject<T>(obj: ObjectDescriptor<T>) {
    const res = {} as T;
    for (const [key, value] of Object.entries(obj) as Entries<
      ObjectDescriptor<T>
    >) {
      if (isFieldDescriptor(value) && typeof value.default !== undefined) {
        res[key] = value.default;
      } else if (isObjectDescriptor(value)) {
        res[key] = getDefaultObject(value);
      }
    }
    return res;
  }

  return {
    getDefaultObject,
  };
}

export default useObjectFieldsDescriptor;
export { type ObjectDescriptor, type FieldDescriptor, isFieldDescriptor };
