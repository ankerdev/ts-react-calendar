import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-16';
import * as enzyme from 'enzyme';
import { v4 as uuid } from 'uuid';
import { calendarStore as store } from '../stores';
import * as utils from '../utils';
import { Calendar } from '../views';

enzyme.configure({ adapter: new Adapter() });

// Calendar view components
describe('<Calendar />', () => {
  const calendar = enzyme.mount(<Calendar />);

  it('renders div.calendar', () => {
    expect(calendar.find('div.calendar')).toHaveLength(1);
  });

  it('correctly formats and renders a header for every day of the week', () => {
    expect(calendar.find('div.headers p')).toHaveLength(7);
    expect((calendar.instance() as any).daysOfTheWeek)
      .toEqual(['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']);
  });

  it('opens edit modal when clicking a date-tile', () => {
    calendar.find('div.date-tile--selectable').first().simulate('click');
    expect(calendar.find('div.modal')).toHaveLength(1);
  });
});

// Calendar object representation
describe('Calendar object representation', () => {
  const firstMonth = utils.calendar[0];

  it('creates a calendar of 12 months', () => {
    expect(utils.calendar.length).toBe(12);
  });

  it('creates 6 weeks per month', () => {
    expect(firstMonth.weeks.length).toBe(6);
  });

  it('creates 7 days per week', () => {
    expect(firstMonth.weeks[0].length).toBe(7);
  });

  it('creates date objects for every week', () => {
    expect(utils.formatDate(firstMonth.weeks[0][0])).toMatch(/^\d\d\/\d\d\/\d\d$/);
  });
});

// Calendar store
describe('calendarStore', () => {
  const today = new Date();
  const getSecondReminder = () => store.getRemindersForDate(today)[1];

  it('can change the selected month', () => {
    store.selectedMonthIndex = 1;

    store.changeMonth('decrement');
    expect(store.selectedMonthIndex).toBe(0);

    store.changeMonth('increment');
    expect(store.selectedMonthIndex).toBe(1);
  });

  it('will not decrement further than index 0', () => {
    store.selectedMonthIndex = 0;
    store.changeMonth('decrement');
    expect(store.selectedMonthIndex).toBe(0);
  });

  it('can add one or more reminders for a date', () => {
    store.reminder = utils.getFreshReminder(today);
    store.createOrUpdateReminder();

    store.reminder = {
      ...store.reminder,
      id: uuid(),
      event: 'Second reminder',
    };
    store.createOrUpdateReminder();

    expect(store.getRemindersForDate(today).length).toBe(2);
  });

  it('can modify a reminder', () => {
    const prevReminder = Object.assign({}, getSecondReminder());

    // New attributes
    const event: string = 'Something new!';
    const color: string = 'green';
    const prevIndex: string = utils.formatDate(store.reminder.datetime);
    store.reminder = {
      ...store.reminder,
      event,
      color,
      prevIndex,
    };

    store.createOrUpdateReminder();
    const updatedReminder = getSecondReminder();

    expect(updatedReminder.event).toBe(event);
    expect(updatedReminder.color).toBe(color);
    expect(JSON.stringify(prevReminder)).not.toBe(JSON.stringify(updatedReminder));
  });

  it('can delete a reminder', () => {
    store.deleteReminder();
    expect(store.getRemindersForDate(today).length).toBe(1);
  });
});
