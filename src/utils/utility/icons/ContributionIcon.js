/*
*
* ContributionIcon Component
*
*/
import React from 'react';
import PropTypes from 'prop-types';
import { getTranslations } from '../helpers/translations';


export function ContributionIcon({ color, width }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 125 145' width={ width || '24px' } style={{ transform: 'rotate(-20deg)' }}>
      <title>{getTranslations('btn_contribution')}</title>
      <path
        style={{ fill: color || '#000' }}
        d='M76.46,125.68,107.29,84c.86.61,1.57,1.1,2.26,1.61,7.81,5.84,15.73,11.53,23.38,17.57,5.52,4.37,12.1,5.58,18.61,7,6,1.32,12,2.32,18.06,3.39a11.67,11.67,0,0,1,7.38,4.46q9.74,12.51,19.43,25.05a11.5,11.5,0,0,1,2.14,10.64q-4.47,15.54-9,31.06a15.28,15.28,0,0,1-.85,1.94c-3.75-1.44-7.29-3.16-11-4.1-2.23-.56-3.44-1.28-4.2-3.48a12.33,12.33,0,0,0-3-4.44,3.37,3.37,0,0,1-.81-3.93c1.47-4.76,2.7-9.59,4.21-14.34a2.72,2.72,0,0,0-1-3.54c-4.28-3.3-8.45-6.73-12.69-10.09-5.38-4.27-12.29-3.65-16.43,1.44a11.31,11.31,0,0,0,1.88,16.54c6.67,5.31,13.48,10.43,20.23,15.63a11.35,11.35,0,0,1,4.5,11.73,11,11,0,0,1-8.37,9,11.63,11.63,0,0,1-10.46-2c-12.79-9.84-25.52-19.75-38.39-29.47-6.22-4.7-9.54-10.49-8.19-18.4a2.78,2.78,0,0,0-1.48-3.18c-8.48-5.74-16.91-11.55-25.35-17.34C77.61,126.53,77.16,126.19,76.46,125.68Z'
        transform='translate(-75 -83)'
      />
      <path
        style={{ fill: color || '#000' }}
        d='M153.21,204c12,2.86,22.14-4.39,24.27-15.82,5.36,0,12.08,5.92,14.39,12.71a20.37,20.37,0,0,1-7,22.6,20.15,20.15,0,0,1-23.42.48C154.85,219.46,151.22,210.8,153.21,204Z'
        transform='translate(-75 -83)'
      />
    </svg>
  );
}

ContributionIcon.propTypes = {
  color: PropTypes.string,
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default ContributionIcon;