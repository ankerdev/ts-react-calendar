export enum ReminderAction {
  NEW = 'New',
  EDIT = 'Edit',
}

export interface IReminder {
  id: string;
  color: string;
  event: string;
  datetime: Date;
}

export interface IReminderEditObject extends IReminder {
  action: ReminderAction;
  prevIndex: string|null;
  date: string;
  time: string;
}
