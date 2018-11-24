import { IReminder } from './reminder.interface';

export interface IKeyAny {
  [key: string]: any;
}

export interface IKeyReminderArray {
  [key: string]: IReminder[];
}

export interface IKeyString {
  [key: string]: string;
}
