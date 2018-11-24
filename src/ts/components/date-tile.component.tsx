import * as React from 'react';
import * as dateFns from 'date-fns';
import { IReminder } from '../interfaces';
import { calendarStore as store } from '../stores';
import { getFreshReminder } from '../utils';
import { Reminder } from './reminder.component';

interface IProps {
  date: Date;
  selectable: boolean;
}

export const DateTile = (props: IProps) => {
  const { date, selectable } = props;
  const tileProps: object = {
    className: `
      date-tile--${!selectable ? 'un' : ''}selectable
      flex-down items-start justify-start
    `,
    onClick: selectable
      ? () => {
        store.reminder = getFreshReminder(date);
        store.showEditReminderModal = true;
      }
      : undefined,
  };
  const reminders: IReminder[] = store.getRemindersForDate(date);

  return (
    <div {...tileProps}>
      <p className={`${dateFns.isToday(date) ? 'today' : ''}`}>
        {date.getDate()}
      </p>
      {reminders.length > 0 && (
        <div className="reminder-wrapper full-width mt-0p5">
          {reminders.map((reminder, i) => <Reminder key={i} {...reminder} />)}
        </div>
      )}
    </div>
  );
}
