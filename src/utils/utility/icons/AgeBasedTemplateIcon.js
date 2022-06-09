/*
*
* AgeBasedTemplateIcon Component
*
*/
import React from 'react';
import PropTypes from 'prop-types';
import { getTranslations } from '../helpers/translations';


export function AgeBasedTemplateIcon({ color, width }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 100' width={ width || '18px'}>
      <title>{getTranslations('btn_age_based_template')}</title>
      <path
        style={{ fill: color || '#000' }}
        d='M 158 83 H 118 a 10 10 0 0 0 -10 10 l 0 80 a 10 10 0 0 0 10 10 H 178 a 10 10 0 0 0 10 -10 V 113 Z m -5 35 V 90.5 L 180.5 118 Z'
        transform='translate(-108,-83)'
      />
      <path
        style={{ fill: '#fff' }}
        d='M 167.3 167.7 h -8.8 l -3.5 -9.1 H 139 l -3.3 9.1 h -8.6 l 15.6 -40.1 h 8.6 Z m -14.9 -15.9 l -5.5 -14.9 l -5.4 14.9 Z'
        transform='translate(-108,-83)'
      />
      <path
        style={{ fill: '#fff' }}
        d='M 180.5 118 l -28 0 l 0 -28 Z'
        transform='translate(-108,-83)'
      />
    </svg>
  );
}

AgeBasedTemplateIcon.propTypes = {
  color: PropTypes.string,
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default AgeBasedTemplateIcon;