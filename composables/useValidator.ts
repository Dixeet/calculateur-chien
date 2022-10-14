export default function useValidator() {
  type Validator = string | true;

  function required(message = '*Champs requis') {
    return function (field: any) {
      return !!field || field === 0 || message;
    };
  }

  function min(m: number, message = `*Champs < ${m}`) {
    return function (field: number) {
      return field >= m || message;
    };
  }

  function max(m: number, message = `*Champs > ${m}`) {
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
