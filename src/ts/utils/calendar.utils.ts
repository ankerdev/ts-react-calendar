import * as dateFns from 'date-fns';
import { v4 as uuid } from 'uuid';
import { CONFIG } from '../config';
import { ICalendarMonth, IOptions, IReminderEditObject, ReminderAction } from '../interfaces';

/**
 * Formatters.
 *
 * @param date Date
 * @return {string}
 */
export const formatDate = (date: Date): string => dateFns.format(date, 'DD/MM/YY');
export const formatMonth = (date: Date): string => dateFns.format(date, 'MMMM');
export const formatTime = (date: Date): string => dateFns.format(date, 'HH:mm');

/**
 * Create date instance from datestamp and timestamp.
 *
 * @return {Date}
 */
export const createDateFromStamps = (datestamp: string, timestamp: string): Date => {
  const segments: string[] = datestamp.split('/');
  // @NB A date must be constructed in YYYY-MM-DD format
  const date = new Date(
    parseInt(`20${segments[2]}`, 10),
    parseInt(segments[1], 10) - 1,
    parseInt(segments[0], 10),
  );
  return dateFns.parse(`${dateFns.format(date, 'YYYY-MM-DD')}T${timestamp}:00`);
}

/**
 * Get an array of months and its weeks,
 * which will represent a calendar.
 *
 * @return {ICalendarMonth[]}
 */
const months = (): ICalendarMonth[] => {
  const today: Date = new Date();
  return Array.from({ length: CONFIG.numberOfMonths }, (e: undefined, i: number) => {
    const startDate: Date = dateFns.addMonths(today, i);
    const firstDay: Date = dateFns.startOfWeek(dateFns.startOfMonth(startDate));
    return {
      name: formatMonth(startDate),
      year: dateFns.format(startDate, 'YYYY'),
      weeks: Array.from({ length: 6 }, (e: undefined, j: number) => (
        Array.from({ length: 7 }, (e: undefined, k: number) => (
          dateFns.endOfDay(
            dateFns.addWeeks((dateFns.addDays(firstDay, k)), j)
          )
        ))
      )),
    };
  });
}

export const calendar: ICalendarMonth[] = months();

/**
 * Flatten the array of available dates in the calendar variable,
 * and return an array of datestamps.
 *
 * @return {string[]}
 */
export const dateOptions = (): string[] => {
  return [].concat.apply([], calendar.map(month => (
    [].concat.apply([], month.weeks.map(week => (
      week.map(date => (
        formatMonth(date) === month.name
          ? formatDate(date)
          : null
      ))
    )))
  ))).filter((e: string | null) => e);
}

/**
 * Get every half hour of the day formatted as HH:mm (e.g. 13:00).
 *
 * @return {string[]}
 */
export const timeOptions = (): string[] => {
  const midnight: Date = dateFns.startOfDay(new Date);
  return Array.from({ length: 48 }, (e: undefined, i: number) => (
    formatTime(dateFns.addMinutes(midnight, i * 30))
  ));
}

export const options: IOptions = {
  colors: ['pink', 'purple', 'blue', 'green'],
  dates: dateOptions(),
  times: timeOptions(),
};

/**
 * Get a fresh reminder edit object.
 * Also used to avoid null-checking for calendarStore.reminder.
 *
 * @param dateObject? Date
 * @return {IReminderEditObject}
 */
export const getFreshReminder = (dateObject?: Date): IReminderEditObject => {
  const date: string = dateObject
    ? formatDate(dateObject)
    : options.dates[0];

  return {
    id: uuid(),
    action: ReminderAction.NEW,
    color: options.colors[0],
    date,
    datetime: new Date(date),
    event: '',
    prevIndex: null,
    time: options.times[options.times.length / 2],
  };
}
