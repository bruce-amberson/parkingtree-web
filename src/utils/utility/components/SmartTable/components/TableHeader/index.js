import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as types from '../../constants';

import {
  Checkbox,
  Icon,
} from '@material-ui/core';

import { dataFilter, dataSort } from 'utils/utility/components/SmartTable/helper';

import './styles.css';

export class TableHeader extends Component {

  static propTypes = {
    customSortedIcon: PropTypes.element,
    stickyHeader: PropTypes.bool,
    
    // props from TableContainer
    loading: PropTypes.bool.isRequired,
    tableActions: PropTypes.shape({
      actionsByTypeGet: PropTypes.func.isRequired,
      getFormattedRowData: PropTypes.func.isRequired,
      selectAllRowsHandle: PropTypes.func.isRequired,
      updateTableState: PropTypes.func.isRequired,
      getVisibleColumns: PropTypes.func.isRequired,
    }),
    tableData: PropTypes.shape({
      bulkActions: PropTypes.array.isRequired,
      bulkStatusChange: PropTypes.bool.isRequired,
      columns: PropTypes.array.isRequired,
      rowData: PropTypes.array.isRequired,
      idKey: PropTypes.string.isRequired,
      selectEnabled: PropTypes.bool,
      statusOptions: PropTypes.array,
      tableSettings: PropTypes.shape({
        searchTerm: PropTypes.string,
        selectedRows: PropTypes.array,
        sortColumn: PropTypes.string,
        sortDirection: PropTypes.string,
      }).isRequired,
    }),
  };

  onSortColumn = (column) => {
    const { 
      tableActions,
      tableData: { columns, idKey, selectEnabled, tableSettings: { searchTerm, sortColumn, selectedRows, sortDirection, }, }
    } = this.props;
    const rowData = tableActions.getFormattedRowData(selectedRows); // use original table data
    
    let nextSortDirection = types.ASCENDING;
    if (column.key === sortColumn) {
      switch (sortDirection) {
        case types.ASCENDING:
          nextSortDirection = types.DESCENDING;
          break;
        case types.DESCENDING:
          nextSortDirection = null;
          break;
        default:
          nextSortDirection = types.ASCENDING;
          break;
      }
    }

    const updatedRowData = searchTerm ? dataSort(nextSortDirection, column, dataFilter(rowData, tableActions.getVisibleColumns(columns), idKey, searchTerm)) : dataSort(nextSortDirection, column, rowData);
    const tableSettings = {
      ...this.props.tableData.tableSettings,
      sortColumn: nextSortDirection ? column.key : '',
      sortDirection: nextSortDirection,
      pageIndex: 0,
    };
    const updatedState = {
      rowData: updatedRowData,
      tableSettings,
    };
    if (selectEnabled) {
      updatedState.selectedRows = updatedRowData.filter(row => row.selected);
    }
    this.props.tableActions.updateTableState(updatedState);
  };
  
  render() {
    const {
      customSortedIcon,
      loading,
      stickyHeader,
      tableActions,
      tableData: {
        bulkActions,
        bulkStatusChange,
        columns,
        selectEnabled,
        rowData,
        tableSettings: { selectedRows, sortColumn, sortDirection, },
      },
    } = this.props;
    const showHeaderCheckbox = !bulkStatusChange && bulkActions.length === 0; // only show if bulk options are not being used in TableToolbar

    const headerRowColumns = tableActions.getVisibleColumns(columns).map(column => {
      const stickyHeaderClass = stickyHeader ? 'TableHeader_stickyHeader' : '';
      const statusOptionsClass = column.statusOptions !== undefined ? 'SmartTable_statusOption' : '';
      const sortedIcon = customSortedIcon ? 
        (customSortedIcon) : (
          <div style={{ display: 'flex' }}>
            <Icon style={{ fontSize: '18px' }} >
              {sortDirection === types.ASCENDING ? 'arrow_drop_down' : 'arrow_drop_up'}
            </Icon>
          </div>
        );

      // eslint-disable-next-line array-callback-return
      if (!column.show) return; // if column.show is false, do not load the column
      
      return (
        <th
          key={column.key}
          className={`${stickyHeaderClass} ${statusOptionsClass}`}
          style={{
            ...column.customStyle,
          }}
        >
          <div
            className='TableHeader_headerCell' 
            onClick={() => this.onSortColumn(column)}
          >
            <span style={column.type === types.CURRENCY ? { width: '100%', textAlign: 'right' } : {} }>{column.title}</span>
            {sortColumn === column.key ? sortedIcon : null }
          </div>
        </th>
      );
    });

    this.props.tableActions.actionsByTypeGet(types.ROW_BUTTON).forEach((button, index) => {
      headerRowColumns.push(
        <th key={`rowButtonColumn_${button.label}${index}`} className={`SmartTable_buttonColumn ${stickyHeader ? 'TableHeader_stickyHeader' : ''}`} >
          {button.displayName ? button.displayName : ''}
        </th>
      );
    });

    this.props.tableActions.actionsByTypeGet(types.ROW_ICON).forEach((iconAction, index) => {
      headerRowColumns.push(
        <th key={`rowIconColumn_${iconAction.icon}${index}`} className={`SmartTable_iconColumn ${stickyHeader ? 'TableHeader_stickyHeader' : ''}`} >
          {iconAction.displayName ? iconAction.displayName : ''}
        </th>
      );
    });

    if (this.props.tableActions.actionsByTypeGet(types.ROW_MENU).length > 0) {
      headerRowColumns.push(
        <th key='rowMenuColumn' className={`SmartTable_iconColumn ${stickyHeader ? 'TableHeader_stickyHeader' : ''}`} />
      );
    }

    if (selectEnabled && !loading) {
      const column = { key: 'selected', type: types.BOOLEAN };
      headerRowColumns.unshift(
        <th key='select' className={stickyHeader ? 'TableHeader_stickyHeader SmartTable_selectColumn' : 'SmartTable_selectColumn'}>
          <div className='TableHeader_checkbox'>
            {/* select all checkbox will show in TableToolbar instead, if bulkActions or bulkStatusChange is used */}
            {showHeaderCheckbox &&
            <Checkbox
              checked={rowData.length > 0 && rowData.length === selectedRows.length}
              onChange={(e, checked) => this.props.tableActions.selectAllRowsHandle(checked)}
              indeterminate={selectedRows.length > 0 && selectedRows.length < rowData.length}
              style={{ marginLeft: '14px' }}
            />}
            <div 
              className='TableHeader_headerCell'
              onClick={() => this.onSortColumn(column)}
              style={{ margin: 'auto', width: '100%', justifyContent: 'center', marginLeft: showHeaderCheckbox ? '-20px' : 'auto' }}
            >
              <div style={{ display: 'flex', visibility: sortColumn === column.key ? 'visible' : 'hidden' }}>
                <Icon style={{ fontSize: '18px' }} >
                  {sortColumn === column.key && sortDirection === types.ASCENDING ? 'arrow_drop_down' : 'arrow_drop_up'}
                </Icon>
              </div>
            </div>
          </div>
        </th>
      );
    }

    return (
      <thead>
        <tr>
          {headerRowColumns}
        </tr>
      </thead>
    );
  }

}

TableHeader.defaultProps = {
  loading: true,
  stickyHeader: true,
};

export default TableHeader;