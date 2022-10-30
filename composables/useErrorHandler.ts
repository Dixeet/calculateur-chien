import {
  CustomError,
  NewNotification,
  FoodType,
  DogDescriptionsType,
} from '#imports';

interface ErrorHandler {
  stopPropagation: boolean;
  err: Error;
  notification?: NewNotification;
}

function searchParamsToString(
  searchParams: Required<
    CustomError['customOptions']
  >['reason']['searchParams'],
) {
  let str = '';
  for (const param of searchParams!) {
    const paramStr = ` ${param.name} = "${param.value}"`;
    str += str ? ` et${paramStr}` : paramStr;
  }
  return str;
}

function entityToString(entity: FoodType | DogDescriptionsType) {
  switch (entity) {
    case 'activities':
      return 'activité';
    case 'bodyConditions':
      return 'état corporel';
    case 'kibbles':
      return 'marque de croquette';
    case 'lifeStages':
      return 'stade de vie';
    case 'livingPlaces':
      return 'lieu de vie';
    case 'races':
      return 'race';
    case 'sterilizationStatus':
      return 'état de stérilisation';
    case 'tincans':
      return 'marque de pâtée';
  }
}

export default function useErrorHandler(error: Error) {
  const res: ErrorHandler = {
    stopPropagation: false,
    err: error,
  };

  if (error instanceof CustomError) {
    const { customOptions: options } = error;
    res.stopPropagation = !!options.stopPropagation;
    if (options.stopPropagation === 'logError') {
      // eslint-disable-next-line no-console -- Throw error catched on console
      console.error(error);
    }
    if (options.notify) {
      const notification: {
        -readonly [K in keyof NewNotification]: NewNotification[K];
      } = { message: '' };
      if (options.type) {
        notification.type = options.type;
      }
      if (options.timeout) {
        notification.timeout = options.timeout;
      }

      if (error.name === 'NotFoundError') {
        notification.title = 'Aucun résultat';
        let message = '';
        if (options.reason) {
          const { entity, searchParams } = options.reason;
          message += `Aucun(e) ${entityToString(
            entity as FoodType | DogDescriptionsType,
          )} trouvé(e)`;
          if (searchParams && searchParams.length > 0) {
            message += ` avec${searchParamsToString(searchParams)}`;
          }
        } else {
          message += 'Aucun résultat trouvé';
        }
        notification.message = message;
      }

      if (error.name === 'DuplicateError') {
        notification.title = 'Ajout impossible';
        let message = '';
        if (options.reason) {
          const { entity, searchParams } = options.reason;
          message += `Un(e) ${entityToString(
            entity as FoodType | DogDescriptionsType,
          )}`;
          if (searchParams && searchParams.length > 0) {
            message += ` avec ces paramètres${searchParamsToString(
              searchParams,
            )} existe déjà`;
          }
        } else {
          message += "L'entité existe déjà avec ces paramètres";
        }
        notification.message = message;
      }

      res.notification = notification;
    }
  }

  return res;
}
