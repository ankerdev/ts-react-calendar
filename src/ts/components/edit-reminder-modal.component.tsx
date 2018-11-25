import * as React from 'react';
import { observer } from 'mobx-react';
import { ReminderAction } from '../interfaces';
import { calendarStore as store } from '../stores';
import { options, preventEvents } from '../utils';
import { SelectField } from './select-field.component';

interface IState {
  showErrorMessage: false,
}

@observer
export class EditReminderModal extends React.Component {
  maxChars: number = 30;
  state: IState = {
    showErrorMessage: false,
  };

  onSubmit() {
    if (this.formIsValid) {
      store.createReminder();
      store.showEditReminderModal = false;
    } else {
      this.setState({ showErrorMessage: true });
    }
  }

  /**
   * Getters.
   *
   * @return {var}
   */

  get formIsValid(): boolean {
    const { event } = store.reminder;
    return event.length > 0;
  }

  get buttonTextPrefix(): string {
    switch (store.reminder.action) {
      case ReminderAction.EDIT:
        return 'Update';

      case ReminderAction.NEW:
        return 'Create';

      default:
        return '';
    }
  }

  get titlePrefix(): string {
    switch (store.reminder.action) {
      case ReminderAction.EDIT:
        return 'Edit';

      case ReminderAction.NEW:
        return 'New';

      default:
        return '';
    }
  }

  render() {
    const { reminder } = store;
    const { showErrorMessage } = this.state;

    return (
      <div
        className="backdrop flex items-center justify-center"
        onClick={() => store.showEditReminderModal = false}
      >
        <div
          className="modal flex-down items-start justify-start"
          onClick={(e: React.MouseEvent) => preventEvents(e)}
        >
          <h3>{this.titlePrefix} reminder</h3>
          <label className="flex-down items-start justify-start full-width mt-1">
            Event
            <input
              className="text-input"
              value={store.reminder.event}
              placeholder="e.g. Lunch with John..."
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value: string = e.target.value;
                if (value.length <= this.maxChars) {
                  store.reminder.event = value;
                }
              }}
            />
          </label>
          <SelectField
            name="Color"
            value={reminder.color}
            options={options.colors}
            callback={(color: string) => store.reminder.color = color}
            colorSelect
          />
          <SelectField
            name="Date"
            value={reminder.date}
            options={options.dates}
            callback={(date: string) => store.reminder.date = date}
          />
          <SelectField
            name="Time"
            value={reminder.time}
            options={options.times}
            callback={(time: string) => store.reminder.time = time}
          />
          <button
            className="button mt-1"
            onClick={() => this.onSubmit()}
          >
            {this.buttonTextPrefix} reminder
          </button>
          {reminder.action === ReminderAction.EDIT && (
            <button
              className="button--purple mt-1"
              onClick={() => {
                store.deleteReminder(reminder);
                store.showEditReminderModal = false;
              }}
            >
              Delete reminder
            </button>
          )}
          {showErrorMessage && <p className="mt-1">Please fill in all of the fields.</p>}
        </div>
      </div>
    );
  }
}
