import * as React from 'react';
import * as dateFns from 'date-fns';
import { observer } from 'mobx-react';
import { DateTile, Icon, EditReminderModal } from '../components';
import { calendarStore as store } from '../stores';

@observer
export class Calendar extends React.Component {
  /**
   * Get the days of the week,
   * formatted as the three first letters only.
   *
   * @return {string[]}
   */
  get daysOfTheWeek(): string[] {
    const startOfWeek: Date = dateFns.startOfWeek(new Date());
    return Array.from({ length: 7 }, (e: undefined, i: number) => (
      dateFns.format(dateFns.addDays(startOfWeek, i), 'ddd').toUpperCase()
    ));
  }

  render() {
    const { name, year } = store.selectedMonth;

    return (
      <main className="flex items-center justify-center full-screen">
        <div className="calendar-wrapper flex-down items-start justify-start">
          <div className="month-wrapper flex items-end justify-between full-width mb-1">
            <h2>{name}, {year}</h2>
            <div className="action-wrapper flex items-center justify-center">
              <button
                className={`${!store.canDecrement ? 'muted' : ''}`}
                onClick={() => store.changeMonth('decrement')}
              >
                <Icon name="chevron-left" />
              </button>
              <button onClick={() => store.changeMonth('today')}>
                Today
              </button>
              <button
                className={`${!store.canIncrement ? 'muted' : ''}`}
                onClick={() => store.changeMonth('increment')}
              >
                <Icon name="chevron-right" />
              </button>
            </div>
          </div>
          <div className="calendar flex-down items-center justify-center">
            <div className="headers flex items-center justify-center">
              {this.daysOfTheWeek.map((day, i) => <p key={i}>{day}</p>)}
            </div>
            {store.selectedMonth.weeks.map((week: Date[], i: number) => (
              <div key={i} className="week flex full-width">
                {week.map((date: Date, j: number) => (
                  <DateTile
                    key={j}
                    date={date}
                    selectable={dateFns.format(date, 'MMMM') === name}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        {store.showEditReminderModal && <EditReminderModal />}
      </main>
    );
  }
}
