/*
*
* StaticTemplateIcon Component
*
*/
import React from 'react';
import PropTypes from 'prop-types';
import { getTranslations } from '../helpers/translations';


export function StaticTemplateIcon({ color, width }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 100' width={ width || '18px'}>
      <title>{getTranslations('btn_static_template')}</title>
      <path
        style={{ fill: color || '#000' }}
        d='M 158 83 H 118 a 10 10 0 0 0 -10 10 l 0 80 a 10 10 0 0 0 10 10 H 178 a 10 10 0 0 0 10 -10 V 113 Z m -5 35 V 90.5 L 180.5 118 Z'
        transform='translate(-108,-83)'
      />
      <path
        style={{ fill: '#fff' }}
        d='M130.13,154.61l7.88-.77a9.58,9.58,0,0,0,2.88,5.82,8.74,8.74,0,0,0,5.87,1.86c2.6,0,4.57-.55,5.89-1.65a4.92,4.92,0,0,0,2-3.87,3.68,3.68,0,0,0-.83-2.42,6.84,6.84,0,0,0-2.91-1.74c-.95-.32-3.11-.91-6.49-1.75q-6.5-1.6-9.13-4a10.45,10.45,0,0,1-3.69-8.07,10.3,10.3,0,0,1,1.74-5.73,10.86,10.86,0,0,1,5-4.06,20.07,20.07,0,0,1,7.89-1.39q7.54,0,11.36,3.31a11.69,11.69,0,0,1,4,8.83l-8.1.36a6.85,6.85,0,0,0-2.23-4.45,8.15,8.15,0,0,0-5.12-1.35A9.24,9.24,0,0,0,140.6,135a2.93,2.93,0,0,0-1.28,2.49,3.09,3.09,0,0,0,1.2,2.43q1.53,1.29,7.44,2.68a39.55,39.55,0,0,1,8.74,2.88,11.41,11.41,0,0,1,4.43,4.08,12,12,0,0,1,1.6,6.38,11.81,11.81,0,0,1-1.92,6.46,11.55,11.55,0,0,1-5.41,4.47,22.84,22.84,0,0,1-8.73,1.46c-5.06,0-9-1.17-11.67-3.51S130.66,159.09,130.13,154.61Z'
        transform='translate(-108 -83)'
      />
      <path
        style={{ fill: '#fff' }}
        d='M 180.5 118 l -28 0 l 0 -28 Z'
        transform='translate(-108,-83)'
      />
    </svg>
  );
}

StaticTemplateIcon.propTypes = {
  color: PropTypes.string,
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default StaticTemplateIcon;