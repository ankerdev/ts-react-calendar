import * as React from 'react';
import { IReminder, ReminderAction } from '../interfaces';
import { preventEvents, formatDate, formatTime } from '../utils';
import { calendarStore as store } from '../stores';

export const Reminder = (reminder: IReminder) => (
  <div
    className="reminder flex items-stretch jusitfy-start full-width"
    onClick={(e: React.MouseEvent<HTMLDivElement>) => {
      preventEvents(e);
      const date: string = formatDate(reminder.datetime);
      store.reminder = {
        ...reminder,
        // editObject specific properties
        action: ReminderAction.EDIT,
        date,
        prevIndex: date,
        time: formatTime(reminder.datetime),
      };
      store.showEditReminderModal = true;
    }}
  >
    <span className={`pillar background--${reminder.color}`} />
    <div className="inner-wrapper flex-down items-start justify-start">
      <b>{reminder.event}</b>
      <p>{formatTime(reminder.datetime)}</p>
    </div>
  </div>
);
