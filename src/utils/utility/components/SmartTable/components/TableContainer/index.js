/*
*
* TableContainer
*
*/
import React from 'react';
import PropTypes from 'prop-types';

import './styles.css';

export function TableContainer({ children, maxHeight, minWidth, style, tableActions, tableData, loading }) {
  const clonedChildren = React.Children.toArray(children).map(child => React.cloneElement(child, { tableActions, tableData, loading }));

  return (
    <div className='SmartTable_tableBody' id='smartTable' style={{ maxHeight }}>
      <table className='SmartTable_table' style={{ minWidth, ...style }}>
        {clonedChildren}
      </table>
    </div>
  );
}

TableContainer.propTypes = {
  maxHeight: PropTypes.string,
  minWidth: PropTypes.string,
  style: PropTypes.object,
  tableActions: PropTypes.object,
  tableData: PropTypes.object,
  loading: PropTypes.bool,
};

TableContainer.defaultProps = {
  minWidth: '950px',
  maxHeight: '560px',
};

export default TableContainer;