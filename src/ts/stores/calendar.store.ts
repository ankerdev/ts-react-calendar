import * as dateFns from 'date-fns';
import { action, computed, observable } from 'mobx';
import { CONFIG } from '../config';
import { ICalendarMonth, IKeyReminderArray, IReminder, IReminderEditObject } from '../interfaces';
import { calendar, formatDate, getFreshReminder, createDateFromStamps } from '../utils';

class CalendarStore {
  @observable selectedMonthIndex: number = 0;
  @observable showEditReminderModal: boolean = false;
  @observable reminder: IReminderEditObject = getFreshReminder();
  @observable remindersForDate: IKeyReminderArray = {};

  /**
   * Actions.
   *
   * @return {void|var}
   */

  /**
   * Change month for the given action.
   *
   * @param action string
   */
  @action
  changeMonth(action: string): void {
    switch (action) {
      case 'decrement':
        this.canDecrement && this.selectedMonthIndex--;
        break;

      case 'increment':
        this.canIncrement && this.selectedMonthIndex++;
        break;

      case 'today':
        this.selectedMonthIndex = 0;
        break;
    }
  }

  @action
  createOrUpdateReminder(): void {
    const { reminder } = this;
    reminder.datetime = createDateFromStamps(reminder.date, reminder.time);
    const index: string = formatDate(reminder.datetime);

    // If editing existing reminder, remove the previous version
    reminder.prevIndex && this.deleteReminder();

    if (index in this.remindersForDate) {
      // If other reminders exist for the given index, insert reminder in correct, timely order
      const reminders: IReminder[] = this.remindersForDate[index];
      const indexToInsert: number = reminders.findIndex(r => dateFns.isBefore(reminder.datetime, r.datetime))
      if (indexToInsert > -1) {
        this.remindersForDate[index].splice(indexToInsert, 0, reminder);
      } else {
        this.remindersForDate[index].push(reminder);
      }
    } else {
      this.remindersForDate[index] = [reminder];
    }
  }

  @action
  deleteReminder(): void {
    const { reminder } = this;
    const { prevIndex } = reminder;
    if (prevIndex) {
      const reminders: IReminder[] = this.remindersForDate[prevIndex];
      const indexToRemove: number = reminders.findIndex(r => r.id === reminder.id);
      this.remindersForDate[prevIndex].splice(indexToRemove, 1);
      // If no more reminders exist for the given index, delete key in remindersForDate
      if (reminders.length === 0) {
        delete this.remindersForDate[prevIndex];
      }
    }
  }

  @action
  getRemindersForDate(date: Date): IReminder[] {
    const dateStamp: string = formatDate(date);
    if (dateStamp in this.remindersForDate) {
      return this.remindersForDate[dateStamp];
    }
    return [];
  }

  /**
   * Getters.
   *
   * @return {var}
   */

  @computed
  get canDecrement(): boolean {
    return this.selectedMonthIndex > 0;
  }

  @computed
  get canIncrement(): boolean {
    return this.selectedMonthIndex < (CONFIG.numberOfMonths - 1);
  }

  @computed
  get selectedMonth(): ICalendarMonth {
    return calendar[this.selectedMonthIndex];
  }
}

export const calendarStore = new CalendarStore();
