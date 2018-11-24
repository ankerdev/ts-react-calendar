import * as React from 'react';
import { Icon } from './icon.component';
import { uppercaseFirstLetter } from '../utils';

interface IProps {
  callback: (val: string) => void;
  colorSelect?: boolean;
  name: string;
  options: string[];
  value: string;
}

export const SelectField = (props: IProps) => (
  <label className="flex-down items-start justify-start full-width mt-1">
    <p>{props.name}</p>
    <div className="flex items-center justify-between full-width">
      <select
        className={props.colorSelect ? `color--${props.value}` : ''}
        defaultValue={props.value}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => props.callback(e.target.value)}
      >
        {props.options.map((option: string, i: number) => (
          <option key={i} value={option}>
            {uppercaseFirstLetter(option)}
          </option>
        ))}
      </select>
      <Icon className="hw-20" name="chevron-down" />
    </div>
  </label>
)
