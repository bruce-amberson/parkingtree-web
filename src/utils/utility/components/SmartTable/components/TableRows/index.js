import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import * as types from 'utils/utility/components/SmartTable/constants';

import {
  withStyles,
} from '@material-ui/core';

import LoadingOverlay from 'utils/utility/components/LoadingOverlay';

import DefaultRow from './DefaultRow';
import RowMenu from './RowMenu';

import { dataFormat } from 'utils/utility/components/SmartTable/helper';

import { coreColors } from 'ui/themes/parkingtree/parkingtreeTheme';

import './styles.css';

const styles = theme => ({
  selectedRow: {
    backgroundColor: coreColors.primary,
    '&:hover': {
      backgroundColor: coreColors.primary,
    },
  },
  tableRow: {
    '&:nth-child(even)': {
      backgroundColor: coreColors.tertiary, 
    },
    '&:hover': {
      backgroundColor: coreColors.secondary, 
    },
  }
});

export class TableRows extends Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    CustomRow: PropTypes.elementType.isRequired, // defaults as DefaultRow but will use provided row component otherwise
    CustomRowProps: PropTypes.object, // props that can be passed down to CustomRow

    // from TableContainer
    loading: PropTypes.bool.isRequired,
    tableActions: PropTypes.shape({
      actionsByTypeGet: PropTypes.func.isRequired,
      updateTableState: PropTypes.func.isRequired,
      getVisibleColumns: PropTypes.func.isRequired,
    }),
    tableData: PropTypes.shape({
      columns: PropTypes.array.isRequired,
      emptyMessage: PropTypes.string,
      idKey: PropTypes.string.isRequired,
      paginate: PropTypes.bool,
      rowData: PropTypes.array.isRequired,
      selectEnabled: PropTypes.bool,
      statusOptions: PropTypes.array,
      tableSettings: PropTypes.shape({
        pageIndex: PropTypes.number,
        rowsPerPage: PropTypes.number,
      }).isRequired,
    }),
  };

  render() {
    const {
      classes, CustomRow, CustomRowProps, loading,
      tableData: { rowData, idKey, paginate, emptyMessage, tableSettings: { pageIndex, rowsPerPage, } }
    } = this.props;
    
    let paginatedRows = cloneDeep(rowData).filter(row => row.filtered);

    if (rowsPerPage > 0 && paginatedRows.length > 10) { // if user selects All option, rowsPerPage value should be -1.
      const startIndex = pageIndex * rowsPerPage;
      paginatedRows = paginate ? paginatedRows.slice(startIndex, startIndex + rowsPerPage) : paginatedRows;
    }

    const tableRows = paginatedRows.map(row => {
      return (
        <CustomRow // defaults as DefaultRow unless a CustomRow prop is provided
          key={row[idKey]}
          CustomRowProps={CustomRowProps}
          dataFormat={dataFormat}
          defaultRowClasses={classes}
          idKey={idKey}
          row={row}
          RowMenu={RowMenu}
          tableActions={this.props.tableActions}
          tableData={this.props.tableData}
          types={types}
        />
      );
    });

    let nonDataRow = null;
    if (loading) {
      nonDataRow = (
        <tr id='TableRows_nonDataRow'>
          <td colSpan={99}>
            <LoadingOverlay
              show={true}
              width='100%'
              indicatorHeight='10px'
            />
          </td>
        </tr>
      );
    }
    else if (!loading && paginatedRows.length === 0) {
      nonDataRow = (
        <tr id='TableRows_nonDataRow'>
          <td colSpan={99}>{rowData.length > 0 ? 'No search results.' : emptyMessage}</td>
        </tr>
      );
    }

    return (
      <tbody>
        {nonDataRow || tableRows}
      </tbody>
    );
  }
}

TableRows.defaultProps = {
  CustomRow: DefaultRow,
};

export default withStyles(styles)(TableRows);