export type Validator<T = any> = (field: T) => string | true;

export default function useValidator() {

  function required(message = '*Champs requis'): Validator {
    return function (field: any) {
      return !!field || message;
    };
  }

  function min(m: number, message = `*Champs < ${m}`): Validator<number> {
    return function (field: number) {
      return field >= m || message;
    };
  }

  function max(m: number, message = `*Champs > ${m}`): Validator<number> {
    return function (field: number) {
      return field <= m || message;
    };
  }

  function getRules(...rules: Validator[]) {
    return [...rules];
  }

  return {
    required,
    min,
    max,
    getRules,
  };
}
