import { useState, isClient, uuid } from '#imports';
import { type VAlert } from 'vuetify/components/VAlert';

type VAlerProps = VAlert['$props'];

interface Notification extends VAlerProps {
  message: string;
  id: string;
  timeout?: number;
  isHtml?: boolean;
}
type DeleteFn = (notif: Notification) => boolean;

const notifications = () => useState<Notification[]>('notifications', () => []);
const defaultNotification: Omit<Notification, 'message' | 'id'> = {
  closable: true,
  timeout: 5000,
  isHtml: false,
  variant: 'tonal',
  density: 'compact',
  border: 'start',
};

function deleteNotification(index: number) {
  notifications().value.splice(index, 1);
  return notifications();
}
function deleteNotificationByFn(fn: DeleteFn) {
  const index = notifications().value.findIndex(fn);
  if (index > -1) {
    deleteNotification(index);
  }
}
export default function useNotification(
  add?: (Omit<Notification, 'id'> & { id?: string }) | null,
  remove?: Notification | string | number | DeleteFn,
) {
  if (isClient) {
    if (add) {
      add.id = add.id ?? uuid();
      notifications().value.push({
        ...defaultNotification,
        ...add,
      } as Notification);
    }
    switch (typeof remove) {
      case 'object':
        deleteNotificationByFn((notif) => notif.id === remove.id);
        break;
      case 'function': {
        deleteNotificationByFn(remove);
        break;
      }
      case 'number':
        deleteNotification(remove);
        break;
      case 'string': {
        deleteNotificationByFn((notif) => notif.id === remove);
        break;
      }
    }
  }
  return notifications();
}

export { type Notification };
