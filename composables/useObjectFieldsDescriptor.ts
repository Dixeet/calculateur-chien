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
  fields?: ObjectDescriptor;
}

interface ObjectDescriptor {
  [index: string]: FieldDescriptor;
}

interface DefaultObject {
  [index: string]: any;
}

function useObjectFieldsDescriptor() {
  function isFieldDescriptor(field: FieldDescriptor) {
    return !field.fields;
  }

  function getDefaultObject<T = DefaultObject>(obj: ObjectDescriptor) {
    const res = {} as DefaultObject;
    for (const [key, value] of Object.entries(obj)) {
      if (!isFieldDescriptor(value) && typeof key === 'string') {
        res[key] = getDefaultObject(value.fields as ObjectDescriptor);
      } else if (typeof (value as FieldDescriptor).default !== 'undefined') {
        res[key] = (value as FieldDescriptor).default;
      }
    }
    return res as T;
  }

  return {
    getDefaultObject,
  };
}
export default useObjectFieldsDescriptor;
export { type ObjectDescriptor, type FieldDescriptor };
