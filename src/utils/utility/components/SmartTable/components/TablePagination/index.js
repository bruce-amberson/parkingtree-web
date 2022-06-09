/*
*
* TablePagination
*
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Icon,
  IconButton,
  MenuItem,
  Select,
} from '@material-ui/core';

import IconBtnTooltip from '../../../IconBtnTooltip';

import './styles.css';

export class TablePagination extends Component {

  static propTypes = {
    /**
   * Object that can be provided to give custom rowsPerPage options
   * If All is passed in, it must have value as -1.
   */
    rowsPerPageOptions: PropTypes.arrayOf(
      PropTypes.shape({
        display: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
        ]).isRequired,
        value: PropTypes.number.isRequired,
      }).isRequired,
    ),

    // props from TableContainer
    tableActions: PropTypes.shape({
      updateTableState: PropTypes.func.isRequired,
    }),
    tableData: PropTypes.shape({
      columns: PropTypes.array.isRequired,
      rowData: PropTypes.array.isRequired,
      selectEnabled: PropTypes.bool.isRequired,
      tableSettings: PropTypes.shape({
        pageIndex: PropTypes.number.isRequired,
        rowsPerPage: PropTypes.number.isRequired,
        selectedRows: PropTypes.array.isRequired,
      }).isRequired,
    }),
  };

    // Make the table to scroll to the top when switching the page index or rowsPerPage
    scrollToTableTop = () => { 
      const list = document.getElementById('smartTable');
      list.scrollTop = 0;
    }

    paginationCompose = () => {
      const { rowData, tableSettings } = this.props.tableData;
      const { pageIndex, rowsPerPage, } = tableSettings;
      
      const filteredRowsLength = rowData.filter(row => row.filtered).length;
      const displayStartIndex = pageIndex * rowsPerPage;
      const displayEndIndex = displayStartIndex + (rowsPerPage > 0 ? rowsPerPage : filteredRowsLength);
  
      const isPrevBtnDisabled = pageIndex === 0;
      const isNextBtnDisabled = Math.floor((filteredRowsLength - 1) / rowsPerPage) <= pageIndex;
  
      return (
        <div className='TablePagination_pagination'>
          <div className='TablePagination_leftButtons'>
            {isPrevBtnDisabled ? 
              <IconButton disabled={true} onClick={() => null}>
                <Icon>first_page</Icon>
              </IconButton>
              :
              <IconBtnTooltip 
                icon='first_page'
                onClick={() => {
                  this.props.tableActions.updateTableState({ tableSettings: { ...tableSettings, pageIndex: 0 } });
                  this.scrollToTableTop();
                }}
                title='First Page'
              />}
            {isPrevBtnDisabled ?
              <IconButton disabled={true} onClick={() => null}>
                <Icon>keyboard_arrow_left</Icon>
              </IconButton>
              :
              <IconBtnTooltip 
                icon='keyboard_arrow_left'
                onClick={() => {
                  this.props.tableActions.updateTableState({ tableSettings: { ...tableSettings, pageIndex: pageIndex - 1 } });
                  this.scrollToTableTop();
                }}
                title='Back'
              />}
          </div>

          <div className='TablePagination_paginationCount'>
            {`${(displayStartIndex + 1).toLocaleString()} - ${(displayEndIndex > filteredRowsLength ? filteredRowsLength : displayEndIndex).toLocaleString()}`} of {(filteredRowsLength).toLocaleString()}
          </div>
  
          <div className='TablePagination_rightButtons'>
            {isNextBtnDisabled ?
              <IconButton disabled={true} onClick={() => null}>
                <Icon>keyboard_arrow_right</Icon>
              </IconButton>
              : 
              <IconBtnTooltip 
                icon='keyboard_arrow_right'
                onClick={() => {
                  this.props.tableActions.updateTableState({ tableSettings: { ...tableSettings, pageIndex: pageIndex + 1 } });
                  this.scrollToTableTop();
                }}
                title='Next'
              />}
            {isNextBtnDisabled ?
              <IconButton disabled={true} onClick={() => null}>
                <Icon>last_page</Icon>
              </IconButton>
              :
              <IconBtnTooltip 
                icon='last_page'
                onClick={() => {
                  this.props.tableActions.updateTableState({ 
                    tableSettings: { 
                      ...tableSettings, 
                      pageIndex: Math.max(0, Math.ceil(filteredRowsLength / rowsPerPage) - 1) 
                    } 
                  });
                  this.scrollToTableTop();
                }}
                title='Last Page'
              />}
          </div>
        </div>
      );
    }

    componentDidMount() {
      // since component is being used, turn on pagination
      this.props.tableActions.updateTableState({ paginate: true });
    }

    render() {
      const { rowsPerPageOptions, tableData: { rowData, tableSettings, selectEnabled, } } = this.props;
      const { rowsPerPage, selectedRows } = tableSettings;
      const filteredRowsLength = rowData.filter(row => row.filtered).length;

      return (
        ((filteredRowsLength > 10) || selectedRows.length > 0) && (
          <div className='TablePagination_container'>
            {selectEnabled &&
            <div className='TablePagination_selectedRowsCount'>
              {selectedRows.length > 0 && 
              <span key='selectedRowsCount'>{(selectedRows.length).toLocaleString()} of {(filteredRowsLength).toLocaleString()} selected</span>}
            </div>}
            {filteredRowsLength > 10 && 
            <div className='TablePagination_paginationControls'>
              <div className='TablePagination_rowsPerPage'>
                <span>Rows per page:</span>
                <Select
                  value={rowsPerPage}
                  style={{ width: rowsPerPage === 100 ? '85px' : '75px', textAlign: 'center' }}
                  onChange={e => {
                    this.props.tableActions.updateTableState({ tableSettings: { ...tableSettings, rowsPerPage: e.target.value, pageIndex: 0 } });
                    this.scrollToTableTop();
                  }}
                >
                  {/* rowsPerPage options can be passed in as prop for custom options */}
                  {rowsPerPageOptions.map(({ display, value }) => <MenuItem key={value} value={value}>{display}</MenuItem>)}
                </Select>
              </div>
              {this.paginationCompose()}
            </div>}
          </div>
        ));
    }

}

TablePagination.defaultProps = {
  rowsPerPageOptions: [
    { display: 10, value: 10 },
    { display: 25, value: 25 },
    { display: 50, value: 50 },
    { display: 100, value: 100 },
  ],
};

export default TablePagination;