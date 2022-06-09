/*
*
* OptionChangeIcon Component
*
*/
import React from 'react';
import PropTypes from 'prop-types';
import { getTranslations } from '../helpers/translations';


import { lighten } from '@material-ui/core/styles/colorManipulator';

export function OptionChangeIcon({ color, width }) {

  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 46 46' width={width || '28px'}>
      <title>{getTranslations('btn_option_change')}</title>
      <circle
        cx='23'
        cy='23'
        r='15'
        fill='#fff'
      />
      <circle
        cx='23'
        cy='23'
        r='15.91549430918954'
        fill='transparent'
        stroke={lighten(color, 0.8)}
        strokeWidth='13'
      />
      <circle
        cx='23'
        cy='23'
        r='15.91549430918954'
        fill='transparent'
        stroke={lighten(color, 0.6)}
        strokeWidth='13'
        strokeDasharray='85 15'
        strokeDashoffset='25'
      />
      <circle
        cx='23'
        cy='23'
        r='15.91549430918954'
        fill='transparent'
        stroke={lighten(color, 0.4)}
        strokeWidth='13'
        strokeDasharray='60 40'
        strokeDashoffset='25'
      />
      <circle
        cx='23'
        cy='23'
        r='15.91549430918954'
        fill='transparent'
        stroke={color}
        strokeWidth='13'
        strokeDasharray='50 50'
        strokeDashoffset='25'
      />
    </svg>
  );
}

OptionChangeIcon.propTypes = {
  color: PropTypes.string,
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default OptionChangeIcon;