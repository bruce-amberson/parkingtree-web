/*
*
* SmartTable
*
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, isEqual, } from 'lodash';
import requiredIf from 'react-required-if';
import * as types from '../../constants';
import sizify from '../../../Sizify';

import { dataFilter, dataSort } from '../../helper';

import './styles.css';

const defaultTableSettings = {
  pageIndex: 0,
  rowsPerPage: 10,
  searchTerm: '',
  selectedRows: [],
  selectedFilters: {},
  sortColumn: '',
  sortDirection: null,
};

export class SmartTable extends Component {

  static propTypes = {
    // should absolutely be provided
    /** The key of a unique ID on the table data */
    idKey: PropTypes.string.isRequired,
    /** The columns to be displayed on the table */
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        /**
         * Callback to apply custom formatting to a column. Does not affect filtering or sorting.
         * Callback is passed the data value for the column key and row data for each row.
         * Must return a value or element for the table to use.
         * 
         * @example
         * row[columnKey] = 10;
         * ...
         * format: (value, rowData) => `value%` // row will show as "10%"
         */
        format: PropTypes.func,
        /** the key on the data object for the column */
        key: PropTypes.string.isRequired,
        /** the name to be displayed as the column header */
        title: PropTypes.string.isRequired,
        /** number that can be provided to give different search priority, default is 1, higher is more priority */
        weight: PropTypes.number,
        /** boolean that determines if the column is shown or not */
        show: PropTypes.bool,
        /**
         * The devices (screen widths) to hide a column on.
         * Screen widths:
         *   phone: < 600px
         *   tablet: >= 600px && < 1200px
         *   desktop: >= 1200px
         * 
         * @example
         * hideOn: ['phone'] // will display on tablet and desktop
         * hideOn: ['phone', 'tablet'] // will only display on desktop
         * Missing hideOn prop // will show on phone, tablet, and desktop
         */
        hideOn: PropTypes.arrayOf(PropTypes.oneOf([
          types.PHONE,
          types.TABLET,
        ])),
        /** the inline styles to be applied to the column */
        customStyle: PropTypes.object,
        /** options provided for a dropdown selection */
        statusOptions: PropTypes.arrayOf(
          PropTypes.shape({
            display: PropTypes.string, // value will be used as display, if not provided
            value: PropTypes.string.isRequired,
            disabled: PropTypes.bool,
            onClick: PropTypes.func, // custom onClick for a status value, callback that provides all rowData and the value clicked
          }),
        ),
        /** the data type of the column */
        type: PropTypes.oneOf([
          types.STRING,
          types.NUMBER,
          types.DATE,
          types.DATE_STRING,
          types.DATE_TIME,
          types.CURRENCY,
          types.BOOLEAN,
        ]).isRequired,
        /** boolean that can be provided to set column as filterable. false will exclude it from filter list */
        canFilter: PropTypes.bool,
        /** list of items that can override the filter list for a given column */
        customFilterList: PropTypes.array,
        /** boolean provided to disable dropdown. only used if also using statusOptions */
        dropdownDisable: PropTypes.bool,
      })
    ).isRequired,
    /** The data to be used by the table */
    rows: PropTypes.array.isRequired,
    
    /// optional props ///
    loading: PropTypes.bool.isRequired,
    /** Callback to receive rowData back on any change as 1st argument and tableSettings as optional 2nd argument */
    onChange: PropTypes.func,
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        /** The display name for ROW_BUTTON, ROW_ICON, ROW_MENU, and BULK_ACTION actions */
        displayName: PropTypes.string,
        /** The type of the action */
        type: PropTypes.oneOf([
          types.ROW_MENU,
          types.ROW_ICON,
          types.ROW_BUTTON,
          types.BULK_ACTION,
        ]).isRequired,
        /**
         * Callback to be fired when action is clicked
         * For ROW_ICON & ROW_MENU, callback will be passed the row data for the row that was clicked
         * For ROW_BUTTON, callback will be passed the row data for the row that was clicked
         * For BULK_ACTION, callback will be passed an array of the row data for the selected rows
         */
        onSelect: PropTypes.func.isRequired,
        /**
         * Callback to determine if action should be displayed for a row. Used only for ROW_BUTTON, ROW_ICON, and ROW_MENU actions.
         * Callback must return truthy or falsy value.
         */
        showIf: PropTypes.func,
        /// props for icons ///
        /** Material Icon key for icon */
        icon: requiredIf(PropTypes.string, props => (props.type === types.ROW_ICON || props.type === types.BULK_ACTION)),
        /** Title for icon that shows on hover, won't show if not provided */
        iconTitle: PropTypes.string,
        /// props for button ///
        /** 
         * Variant for button, default is contained.
         * Button color will default as default, if different variant is provided, it will change to primary
         */
        variant: PropTypes.string,
        /** Label for button */
        label: requiredIf(PropTypes.string, props => (props.type === types.ROW_BUTTON)),
        /**
         * Callback that provides the row and determines if the row button should be loading. Used only for ROW_BUTTON.
         * Callback must return truthy or falsy value.
         */
        loading: PropTypes.func,
        /** Boolean to disable button */
        disabled: PropTypes.bool,
      })
    ),
    /** Boolean to turn on checkbox selection for rows, default is false */
    selectEnabled: PropTypes.bool.isRequired,
    style: PropTypes.object,
    /** String to display as Title over table, goes in TableToolbar section */
    title: PropTypes.string,
    /** String to display in TableRows area when no data is provided */
    emptyMessage: PropTypes.string,
    /** Settings that can be provided to set the initial mounting of the table */
    tableSettings: PropTypes.shape({
      pageIndex: PropTypes.number,
      rowsPerPage: PropTypes.number,
      searchTerm: PropTypes.string,
      selectedRows: PropTypes.array,
      selectedFilters: PropTypes.object,
      sortColumn: requiredIf(PropTypes.string, props => props.sortDirection !== undefined), // required is sortDirection is provided
      sortDirection: PropTypes.string,
    }).isRequired,
    /** Size of component and window (injected by Sizify) */
    size: PropTypes.object.isRequired,
  };
  
  state = {
    bulkActions: [], // provided from TableToolbar
    bulkStatusChange: false, // provided from TableToolbar
    columns: [],
    emptyMessage: '',
    searchTerm: '',
    idKey: '',
    isFiltered: false,
    paginate: false,
    rowData: [],
    selectEnabled: false,
    showSearchSuggestions: false,
    statusOptions: null,
    tableSettings: {
      ...defaultTableSettings, // start with defaults
      ...this.props.tableSettings, // overwrite defaults with anything that is provided in table props
    },
    title: '',
  }

  getFormattedRowData = (selectedRows, resetData = false, statusOptions = this.state.statusOptions) => {
    const { columns, rows, idKey, selectEnabled } = this.props;
    const visibleColumns = this.getVisibleColumns(columns);
    let rowData = cloneDeep(rows);
    const tableSettings = this.state.tableSettings;

    if (!resetData) {
      const column = columns.find(column => column.key === tableSettings.sortColumn);
      rowData = tableSettings.sortColumn // sort if sortColumn is provided
        ? dataSort(tableSettings.sortDirection, column, dataFilter(rowData, visibleColumns, idKey, tableSettings.searchTerm)) 
        : dataFilter(rowData, visibleColumns, idKey, tableSettings.searchTerm);

      rowData.forEach(row => {
        if (row.filtered) {
          // If anything in row becomes a filter status of false, the entire row should be filtered out of displayed data (filter: false)
          const isFiltered = !Object.entries(tableSettings.selectedFilters).some(([key, filters]) => !filters.includes(row[key]) && filters.length > 0);
          row.filtered = isFiltered;
          row.selected = isFiltered ? row.selected : false; // if row is now filtered out (false), unselect row
        }
      });

      if (selectEnabled) {
        rowData.forEach(row => {
          row.selected = row.selected ? row.selected : selectedRows.some(selected => selected[idKey] === row[idKey]);
        });
      }
      if (statusOptions) {
        rowData.forEach(row => {
          row.statusOption = row.statusOption ? row.statusOption : statusOptions[0].value;
        });
      }
    }
    else {
      // resets to original data and removes all filtering
      rowData.forEach(row => row.filtered = true);
    }
    
    this.props.onChange(rowData, tableSettings);
    return rowData;
  }

  // formats columns to include the 'show' property
  getFormattedColumns = columns => columns.map(column => ({ ...column, show: column.show !== undefined ? column.show : true }));

  getFormattedStatusOptions = () => {
    // formats statusOptions to move a potential disabled property into a props object for the Dropdown to use
    const statusOptionsColumn = this.props.columns.find(column => column.statusOptions !== undefined) || {};
    const statusOptions = statusOptionsColumn.statusOptions || null;
    statusOptions && statusOptions.forEach(option => option.props = { disabled: option.disabled === undefined ? false : option.disabled });
    return statusOptions;
  }

  // handles when the selectAll checkbox has been clicked. This is used in both TableHeader and TableToolbar (for bulkActions or bulkStatusChange)
  selectAllRowsHandle = (allSelected) => {
    const { tableSettings } = this.state;
    const updatedRowData = cloneDeep(this.state.rowData);
    let updatedSelectedRows = [];

    if (allSelected && tableSettings.selectedRows.length === 0) { // nothing is currently selected
      updatedRowData.forEach(row => row.selected = row.filtered); // if data is filtered, will only select all that are currently showing
      updatedSelectedRows = updatedRowData.filter(row => row.selected);
    }
    else { // clicking select all when some are already selected, unselects all rows
      updatedRowData.forEach(row => row.selected = false);
    }

    const updatedTableSettings = {
      ...tableSettings,
      selectedRows: updatedSelectedRows,
    };

    this.setState({
      rowData: updatedRowData,
      tableSettings: updatedTableSettings,
    });
    this.props.onChange(updatedRowData, updatedTableSettings);
  }

  /**
   * Returns the table columns visible at the current moment.
   * Takes screen size and the hideOn prop into consideration.
   * 
   * @param {Object[]} columns columns to be checked (typically just the columns on props)
   * 
   * @returns {Object[]} the paired down columns that should be currently visible
   */
  getVisibleColumns = (columns) => {
    const { windowWidth } = this.props.size;
    const visibleColumns = [];
    columns.forEach(column => {
      if (windowWidth < 600 && ((column.hideOn && column.hideOn.indexOf(types.PHONE) === -1) || !column.hideOn)) {
        visibleColumns.push(column);
      }
      else if ((windowWidth >= 600 && windowWidth < 1200) && ((column.hideOn && column.hideOn.indexOf(types.TABLET) === -1) || !column.hideOn)) {
        visibleColumns.push(column);
      }
      else if (windowWidth >= 1200) {
        visibleColumns.push(column);
      }
    });

    return visibleColumns;
  }

  componentDidMount() {
    const {
      actions,
      columns,
      emptyMessage,
      idKey,
      selectEnabled,
      title,
    } = this.props;
    const { tableSettings, } = this.state;

    const selectedRows = tableSettings.selectedRows || defaultTableSettings.selectedRows;
    const statusOptions = this.getFormattedStatusOptions();
    const rowData = this.getFormattedRowData(selectedRows, false, statusOptions);

    this.setState({
      actions,
      columns: this.getFormattedColumns(columns),
      emptyMessage,
      idKey,
      isFiltered: false,
      rowData, // data that will be displayed based on sorting and filters
      statusOptions,
      selectEnabled,
      showSearchSuggestions: false,
      title,
    });
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.rows, this.props.rows) // check if rows from props have changed
    // also check if the latest props rows are different than current state of rowData to prevent reloading from internal changes and the onChange being used to push the rows back into the table
    && !isEqual(this.state.rowData, this.props.rows)) {
      const selectedRows = this.props.rows.filter(row => row.selected);
      const rowData = this.getFormattedRowData(selectedRows);
      let pageIndex = this.state.tableSettings.pageIndex;

      // if source data changes, change pagination back to first page
      if (prevProps.rows.length !== this.props.rows.length) {
        pageIndex = 0;
      }

      this.setState({
        rowData,
        tableSettings: { ...this.state.tableSettings, selectedRows, pageIndex, }
      });
    }
    if (!isEqual(prevProps.columns, this.props.columns)) { // watches for any changes in columns, usually going to be with statusOptions or dropdownDisabled
      const formattedColumns = this.getFormattedColumns(this.props.columns);
      const statusOptions = this.getFormattedStatusOptions();
      this.setState({ columns: formattedColumns, statusOptions });
    }
    if (prevProps.selectEnabled !== this.props.selectEnabled) {
      this.setState({ selectEnabled: this.props.selectEnabled });
    }
    if (prevProps.emptyMessage !== this.props.emptyMessage) { // update empty message, if changed
      this.setState({ emptyMessage: this.props.emptyMessage });
    }
  }

  render() {
    const { children, style, loading } = this.props;

    const childProps = {
      loading,
      tableData: this.state,
      tableActions: {
        // TableHeader actions
        selectAllRowsHandle: this.selectAllRowsHandle, // also used in TableToolbar for bulkActions or bulkStatusChange
        // helper actions
        actionsByTypeGet: (actionType) => this.props.actions.filter(action => action.type === actionType),
        getFormattedRowData: this.getFormattedRowData,
        getVisibleColumns: this.getVisibleColumns,
        onChange: this.props.onChange,
        updateTableState: (updatedStateValues) => {
          this.setState(updatedStateValues, () => this.props.onChange(this.state.rowData, this.state.tableSettings));
        },
      },
    };
    const clonedChildren = React.Children.toArray(children).map(child => React.cloneElement(child, childProps));

    return (
      <div className='SmartTable_container' style={{ ...style }}>
        {clonedChildren}
      </div>
    );
  }

}
SmartTable.defaultProps = {
  loading: false,
  
  actions: [],
  emptyMessage: 'No data to display.',
  initialPageIndex: 0,
  onChange: () => null,
  selectEnabled: false,
  statusOptions: [],
  tableSettings: defaultTableSettings,
  title: '',
};

export default sizify(SmartTable);