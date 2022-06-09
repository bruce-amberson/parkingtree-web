/*
*
* DefaultRow
*
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, } from 'lodash';

import {
  Button,
  Checkbox,
} from '@material-ui/core';

import Dropdown from '../../../../Dropdown';
import IconBtnTooltip from '../../../../IconBtnTooltip';
import LoadingOverlay from '../../../../LoadingOverlay';

import './styles.css';

export class DefaultRow extends Component {

  static propTypes = {
    // from TableRows
    dataFormat: PropTypes.func.isRequired,
    defaultRowClasses: PropTypes.object.isRequired,
    idKey: PropTypes.string.isRequired,
    row: PropTypes.object.isRequired,
    RowMenu: PropTypes.elementType.isRequired, // React component prop
    tableActions: PropTypes.shape({
      actionsByTypeGet: PropTypes.func.isRequired,
      updateTableState: PropTypes.func.isRequired,
      getVisibleColumns: PropTypes.func.isRequired,
    }).isRequired,
    tableData: PropTypes.shape({
      columns: PropTypes.array.isRequired,
      rowData: PropTypes.array.isRequired,
      selectEnabled: PropTypes.bool,
      statusOptions: PropTypes.array,
      tableSettings: PropTypes.shape({
        selectedRows: PropTypes.array.isRequired,
      }).isRequired,
    }).isRequired,
    types: PropTypes.object.isRequired,
  };


  onStatusChange = (row, value) => {
    const { idKey, tableActions, tableData: { rowData }, } = this.props;
    const updatedRowData = cloneDeep(rowData);
    const rowIndex = updatedRowData.findIndex(rowData => rowData[idKey] === row[idKey]);

    updatedRowData[rowIndex].statusOption = value;

    tableActions.updateTableState({ rowData: updatedRowData });
  }

  selectRowHandle = (row, selected) => {
    const { idKey, tableActions, tableData: { rowData, tableSettings, }, } = this.props;
    const updatedRowData = cloneDeep(rowData);
    const rowIndex = updatedRowData.findIndex(rowData => rowData[idKey] === row[idKey]);
    
    updatedRowData[rowIndex].selected = selected;
    const updatedSelectedRows = updatedRowData.filter(row => row.selected);
    const updatedTableSettings = {
      ...tableSettings,
      selectedRows: updatedSelectedRows,
    };
    tableActions.updateTableState({
      rowData: updatedRowData,
      tableSettings: updatedTableSettings,
    });
  };

  render() {
    const { dataFormat, defaultRowClasses, idKey, RowMenu, tableActions, tableData: { columns, selectEnabled, statusOptions, }, types } = this.props;
    const row = cloneDeep(this.props.row);

    const rowColumns = tableActions.getVisibleColumns(columns).map(column => {
    // eslint-disable-next-line array-callback-return
      if (!column.show) return; // if column.show is false, do not load the column

      if (column.statusOptions !== undefined) { // insert Dropdown selection if statusOptions are provided in the columns
        const disabled = column.dropdownDisabled !== undefined ? column.dropdownDisabled : false;
        return (
          <td key='statusOptions' className='SmartTable_statusOption'>
            <Dropdown
              value={row.statusOption || statusOptions[0].value} // defaults to show first value provided, if statusOption is not yet set
              onChange={value => this.onStatusChange(row, value)}
              options={statusOptions}
              FormControlProps={{ style: { margin: 0, justifyContent: 'center', width: '100%' } }}
              SelectProps={{ disableUnderline: true, disabled }}
            />
          </td>
        );
      }
      else { // insert a normal row cell
        return (
          <td
            key={`${row[idKey]}_${column.key}`}
            onClick={() => selectEnabled ? this.selectRowHandle(row, !row.selected) : null}
            style={{
              ...column.type === types.CURRENCY ? { textAlign: 'right', } : {},
              ...column.customStyle,
            }}
          >
            {column.format ? column.format(row[column.key], row) : dataFormat(row[column.key], column.type)}
          </td>
        );
      }
    });

    tableActions.actionsByTypeGet(types.ROW_BUTTON).forEach((button, actionIndex) => {
      const color = button.variant === 'text' || button.variant === 'outlined' ? 'primary' : 'default';
      const loading = button.loading(row);
      const composedIconAction = (
        <td key={`rowButtonColumn_${button.label}${actionIndex}`} className='SmartTable_buttonColumn'>
          <LoadingOverlay show={loading} width='100%'>
            <Button
              color={color}
              variant={button.variant || 'contained'}
              onClick={() => button.onSelect(row)}
              disabled={button.disabled || loading}
              fullWidth
            >
              {button.label}
            </Button>
          </LoadingOverlay>
        </td>
      );
    
      if (button.showIf) {
        if (button.showIf(row)) {
          rowColumns.push(composedIconAction);
        }
        else {
          rowColumns.push(<td key={`emptyButtonColumn_${button.label}${actionIndex}`} className='SmartTable_buttonColumn' />);
        }
      }
      else {
        rowColumns.push(composedIconAction);
      }
    });

    tableActions.actionsByTypeGet(types.ROW_ICON).forEach((iconAction, actionIndex) => {
      const composedIconAction = (
        <td key={`rowIconColumn_${iconAction.icon}${actionIndex}`} className='SmartTable_iconColumn'>
          <IconBtnTooltip
            icon={iconAction.icon}
            onClick={() => iconAction.onSelect(row)}
            title={iconAction.iconTitle ? iconAction.iconTitle : ''}
          />
        </td>
      );
    
      if (iconAction.showIf) {
        if (iconAction.showIf(row)) {
          rowColumns.push(composedIconAction);
        }
        else {
          rowColumns.push(<td key={`emptyIconColumn_${iconAction.icon}${actionIndex}`} className='SmartTable_iconColumn' />);
        }
      }
      else {
        rowColumns.push(composedIconAction);
      }
    });

    const rowMenuActions = tableActions.actionsByTypeGet(types.ROW_MENU);
    if (rowMenuActions.length > 0) {
      rowColumns.push(
        <td key='rowMenuColumn' className='SmartTable_iconColumn'>
          <RowMenu
            options={rowMenuActions}
            rowData={row}
          />
        </td>
      );
    }

    if (selectEnabled) {
      rowColumns.unshift(
        <td 
          key='select' 
          className='SmartTable_selectColumn'
          onClick={() => selectEnabled ? this.selectRowHandle(row, !row.selected) : null}
        >
          <Checkbox
            checked={row.selected}
            onChange={(e, checked) => this.selectRowHandle(row, checked)}
          />
        </td>
      );
    }

    return (
      <tr
        key={row[idKey]}
        className={(row.selected && selectEnabled) ? (defaultRowClasses.tableRow, defaultRowClasses.selectedRow) : defaultRowClasses.tableRow}
      >
        {rowColumns}
      </tr>
    );
  }

}

export default (DefaultRow);