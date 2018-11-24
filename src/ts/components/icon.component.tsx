import * as React from 'react';
import { IKeyString } from '../interfaces';

const icons: IKeyString = {
  'chevron-down': require('../../assets/icons/chevron-down.svg'),
  'chevron-left': require('../../assets/icons/chevron-left.svg'),
  'chevron-right': require('../../assets/icons/chevron-right.svg'),
};

interface IProps {
  className?: string;
  name: string;
}

export const Icon = (props: IProps) => (
  <i
    className={`flex align-center justify-center ${props.className ? props.className : ''}`}
    dangerouslySetInnerHTML={{ __html: icons[props.name] }}
  />
);
