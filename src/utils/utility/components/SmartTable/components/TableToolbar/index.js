/*
*
* TableToolbar
*
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, debounce, isEmpty, isEqual } from 'lodash';

import {
  Button,
  Checkbox,
  Chip,
  ListItemText,
  MenuItem,
  Popover,
  withStyles,
} from '@material-ui/core';

import IconBtnTooltip from '../../../IconBtnTooltip';
import Search from '../../../Search';
import Filter from '../../../Filter';

import { dataFilter, } from '../../helper';


import './styles.css';

const styles = () => ({
  searchMenuItem: {
    paddingTop: '2px',
    paddingBottom: '2px',
  },
});

export class TableToolbar extends Component {

  static propTypes = {
    // props given on TableToolbar
    // Custom component that will go into the left portion of the Tooltip bar. All props and logic will be in parent component
    customToolbarSection: PropTypes.func,
    /** Boolean to show actions that will affect all selected rows */
    bulkActions: PropTypes.arrayOf(
      PropTypes.shape({
        display: PropTypes.string.isRequired,
        icon: PropTypes.string, // if icon provided, use IconBtnTooltip, otherwise a normal button will be used
        onClick: PropTypes.func.isRequired, // Callback that provides the selectedRows, also provides display as a 2nd argument
        disabled: PropTypes.bool,
      })
    ),
    /** Boolean to show status option selection buttons and checkbox to make bulk status changes */
    bulkStatusChange: PropTypes.bool,
    /** Class names injected by the withStyles HOC provided by Material UI */
    classes: PropTypes.object.isRequired,
    // Boolean used to turn off filter menu, default is true.
    canFilter: PropTypes.bool,
    // Boolean used to turn off show columns menu, default is false.
    canHideColumns: PropTypes.bool,
    // Boolean used to turn off search bar, default is true.
    canSearch: PropTypes.bool,
    /** Search input will be open as default for the Table */
    searchOpen: PropTypes.bool,
    /** Search input custom placeholder for the Table */
    searchPlaceholder: PropTypes.string,
    /** Used by Google Analytics to see where search being used */
    onSearchFocus: PropTypes.func,

    // props from TableContainer
    loading: PropTypes.bool.isRequired,
    tableActions: PropTypes.shape({
      getFormattedRowData: PropTypes.func.isRequired,
      selectAllRowsHandle: PropTypes.func.isRequired,
      updateTableState: PropTypes.func.isRequired,
      getVisibleColumns: PropTypes.func.isRequired,
    }),
    tableData: PropTypes.shape({
      bulkActions: PropTypes.array.isRequired,
      bulkStatusChange: PropTypes.bool.isRequired,
      columns: PropTypes.array.isRequired,
      idKey: PropTypes.string.isRequired,
      rowData: PropTypes.array.isRequired,
      selectEnabled: PropTypes.bool.isRequired,
      statusOptions: PropTypes.array,
      title: PropTypes.string,
      tableSettings: PropTypes.shape({
        pageIndex: PropTypes.number.isRequired,
        rowsPerPage: PropTypes.number.isRequired,
        searchTerm: PropTypes.string.isRequired,
        selectedRows: PropTypes.array.isRequired,
        selectedFilters: PropTypes.object.isRequired,
      }).isRequired,
    }),
  };

  state = {
    searchTerm: '',
    showSearchSuggestions: false,
    selectedSearchMenuIndex: -1,
    selectedFilters: {},
    viewColumnsAnchor: null,
  }

  searchBarCompose = () => {
    const { tableActions, tableData: { columns, rowData }, classes, searchOpen, searchPlaceholder } = this.props;
    const { searchTerm, showSearchSuggestions, selectedSearchMenuIndex } = this.state;

    return (
      <div
        key='tableSearchAction'
        className='TableToolbar_search'
      >
        <Search
          disabled={rowData.length === 0}
          direction='right'
          onChange={searchTerm => this.setState({ searchTerm }, debounce(this.onSearchFilter, 300))}
          onSearchFocus={this.props.onSearchFocus}
          value={searchTerm}
          open={searchOpen}
          placeholder={searchPlaceholder}
        />
        <div
          className={`TableToolbar_searchMenu${showSearchSuggestions ? ' show' : ''}`}
          id='TableToolbar_searchMenu'
        >
          {tableActions.getVisibleColumns(columns).map((column, index) => (
            <MenuItem
              selected={selectedSearchMenuIndex === index}
              key={column.key}
              classes={{ root: classes.searchMenuItem }}
              onClick={() => this.onSearchSuggestionClick(index)}
            >
              {`Find "${searchTerm}" in ${column.title}`}
            </MenuItem>
          ))}
        </div>
        <div
          className={`TableToolbar_searchOverlay${showSearchSuggestions ? 'Show' : 'Hide'}`}
          onClick={this.searchMenuHide}
        />
      </div>
    );
  }

  viewColumnsCompose = () => {
    const { columns, rowData } = this.props.tableData;
    const { viewColumnsAnchor } = this.state;
    const oneShownColumn = columns.filter(column => column.show).length === 1;

    return (
      <div>
        <IconBtnTooltip
          buttonProps={{ color: 'primary', style: { marginRight: '5px' }, disabled: rowData.length === 0 }}
          onClick={event => this.setState({ viewColumnsAnchor: event.currentTarget })}
          icon='view_column'
          title='View Columns'
        />
        <Popover
          open={Boolean(viewColumnsAnchor)}
          anchorEl={viewColumnsAnchor}
          onClose={() => this.setState({ viewColumnsAnchor: null })}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{ style: { padding: '10px' } }}
        >
          <div className='TableToolbar_showColumnsTitle'>SHOW COLUMNS</div>
          {columns.map((column, index) => (
            <MenuItem
              disabled={oneShownColumn && column.show}
              key={column.key} 
              onClick={() => this.handleShowColumnClick(index)}
              style={{ padding: '0 10px' }}
              value={column.title}
            >
              <Checkbox checked={column.show} />
              <ListItemText primary={column.title} />
            </MenuItem>
          ))}
        </Popover>
      </div>
    );
  }

  handleShowColumnClick = columnIndex => {
    const columns = cloneDeep(this.props.tableData.columns);

    columns[columnIndex].show = !columns[columnIndex].show;
    this.props.tableActions.updateTableState({ columns });
  }

  clearSelectedFilters = (selectedFilters) => {
    const { tableActions, tableData: { columns, idKey, rowData, tableSettings } } = this.props;
    const { searchTerm } = this.state;

    const filteredRowData = dataFilter(rowData, tableActions.getVisibleColumns(columns), idKey, searchTerm);

    this.setState({ selectedFilters });
    this.props.tableActions.updateTableState({ rowData: filteredRowData, tableSettings: { ...tableSettings, selectedFilters } });
  }

  dataFilter = (selectedFilters) => {
    const { tableActions, tableData: { columns, idKey, rowData, tableSettings, } } = this.props;
    const { searchTerm } = this.state;
    const { pageIndex, rowsPerPage } = tableSettings;

    const filteredRowData = dataFilter(rowData, tableActions.getVisibleColumns(columns), idKey, searchTerm);
    
    // filters rows based on selected filters now
    filteredRowData.forEach(row => {
      if (row.filtered) {
        // If anything in row becomes a filter status of false, the entire row should be filtered out of displayed data (filter: false)
        const isFiltered = !Object.entries(selectedFilters).some(([key, filters]) => !filters.includes(row[key]) && filters.length > 0);
        row.filtered = isFiltered;
      }
    });

    const filteredRowsLength = filteredRowData.filter(row => row.filtered).length;
    const isPageIndexToHigh = Math.floor((filteredRowsLength - 1) / rowsPerPage) <= pageIndex;

    const updatedTableSettings = {
      ...tableSettings,
      pageIndex: isPageIndexToHigh ? 0 : pageIndex,
      searchTerm,
      selectedFilters,
    };
    const updatedState = {
      rowData: filteredRowData,
      tableSettings: updatedTableSettings,
    };

    this.props.tableActions.updateTableState(updatedState);
  }

  onRemoveFilter = (filterKey, filterLabel) => {
    const selectedFilters = cloneDeep(this.state.selectedFilters);
    
    // remove filter from selectedFilters
    selectedFilters[filterKey] = selectedFilters[filterKey].filter(selectedFilter => selectedFilter !== filterLabel);

    this.dataFilter(selectedFilters); // updates rowData based on new selectedFilters
    this.setState({ selectedFilters, });
  }

  // sets rowData items' filter boolean based on being selected or not
  onFilterSelection = (selectedFilters) => {
    this.dataFilter(selectedFilters); // updates rowData based on new selectedFilters
    this.setState({ selectedFilters, });
  }

  /**
   * Handler for when a search term is entered into the table's search component
   * Filters data, and resets pagination and sorting
   */
  onSearchFilter = () => {
    const { 
      canFilter,
      tableActions: { getFormattedRowData, getVisibleColumns, },
      tableData: { columns, idKey, rowData, tableSettings, },
    } = this.props;
    const { searchTerm, selectedFilters } = this.state;
    const { pageIndex, rowsPerPage, selectedRows } = tableSettings;
    const visibleColumns = getVisibleColumns(columns);

    if (searchTerm.length > 0 && !searchTerm.includes(':')) {
      this.searchMenuShow();
    }
    else {
      this.searchMenuHide();
    }
    
    const filteredRowData = searchTerm
      ? dataFilter(rowData, visibleColumns, idKey, searchTerm)
      : getFormattedRowData(selectedRows, true);

    // after search results are filtered, apply filters with selected filters too, if enabled
    canFilter && filteredRowData.forEach(row => {
      visibleColumns.forEach(column => {
        if (row.filtered) {
          row.filtered = selectedFilters[column.key].includes(row[column.key]) || selectedFilters[column.key].length === 0;
        }
      });
    });

    const filteredRowsLength = filteredRowData.filter(row => row.filtered).length;
    const isPageIndexToHigh = Math.floor((filteredRowsLength - 1) / rowsPerPage) <= pageIndex;

    const updatedTableSettings = {
      ...tableSettings,
      pageIndex: isPageIndexToHigh ? 0 : pageIndex,
      searchTerm,
      selectedFilters,
      // clear out any sorting while searching
      sortColumn: '',
      sortDirection: null,
    };

    const updatedState = {
      rowData: filteredRowData,
      tableSettings: updatedTableSettings,
    };
    
    this.props.tableActions.updateTableState(updatedState);
  };

  /**
   * Adds "show" class to the Table searchMenu in the DOM
   */
  searchMenuShow = () => {
    this.setState({ showSearchSuggestions: true, });
  };

  /**
   * Removes "show" class from the Table searchMenu in the DOM
   */
  searchMenuHide = () => {
    this.setState({
      showSearchSuggestions: false,
      selectedSearchMenuIndex: -1,
    });
  };

  onSearchSuggestionClick = (index) => {
    const column = this.props.tableActions.getVisibleColumns(this.props.tableData.columns)[index];
    const searchTerm = `${column.title}: ${this.state.searchTerm}`;

    this.setState({ searchTerm }, this.onSearchFilter);
  };

  bulkStatusChangeCompose = () => {
    const { loading, tableData: { rowData, statusOptions, tableSettings: { selectedRows, } } } = this.props;

    return (
      <div className='TableToolbar_bulkOptions'>
        <div className='bulkStatusCheckbox'>
          <Checkbox
            checked={rowData.length > 0 && rowData.length === selectedRows.length}
            onChange={(e, checked) => this.props.tableActions.selectAllRowsHandle(checked)}
            indeterminate={selectedRows.length > 0 && selectedRows.length < rowData.length}
            disabled={loading}
          />
        </div>
        {statusOptions.map(({ display, value, onClick, disabled, }) => {
          return (
            <Button
              key={value}
              color='primary'
              onClick={onClick ? () => onClick(rowData, value) : () => this.bulkStatusChange(value)}
              disabled={selectedRows.length === 0 || loading || disabled}
            >
              {display || value}
            </Button>
          );
        })}

      </div>
    );
  }

  bulkStatusChange = (statusOption) => {
    const updatedRowData = cloneDeep(this.props.tableData.rowData);

    updatedRowData.forEach(row => {
      if (row.selected) {
        row.statusOption = statusOption;
      }
    });

    this.props.tableActions.updateTableState({ rowData: updatedRowData });
  }

  bulkActionsCompose = () => {
    const { loading, tableData: { rowData, bulkActions, tableSettings: { selectedRows, } } } = this.props;

    return (
      <div className='TableToolbar_bulkOptions'>
        <div className='bulkStatusCheckbox'>
          <Checkbox
            checked={rowData.length > 0 && rowData.length === selectedRows.length}
            onChange={(e, checked) => this.props.tableActions.selectAllRowsHandle(checked)}
            indeterminate={selectedRows.length > 0 && selectedRows.length < rowData.length}
            disabled={loading}
          />
        </div>
        {bulkActions.map(({ display, onClick, disabled, icon, }) => {
          const selectedRows = rowData.filter(row => row.selected);
          return (
            icon ? // use icon, if provided
              <IconBtnTooltip
                key={display}
                buttonProps={{ disabled: selectedRows.length === 0 || loading || disabled }}
                onClick={() => onClick(selectedRows, display)}
                icon={icon}
                title={display}
              />
              :
              <Button
                key={display}
                color='primary'
                onClick={() => onClick(selectedRows, display)}
                disabled={selectedRows.length === 0 || loading || disabled}
              >
                {display}
              </Button>
          );
        })}

      </div>
    );
  }

  keyPressHandle = e => {
    const { tableActions } = this.props;
    const { showSearchSuggestions, selectedSearchMenuIndex, } = this.state;
    const visibleColumns = tableActions.getVisibleColumns(this.props.tableData.columns);

    if (e.keyCode === 27) { // ESC Key
      this.searchMenuHide();
    }
    if (showSearchSuggestions) {
      switch (e.keyCode) {
        case 9: { // Tab key
          this.searchMenuHide();
          break;
        }
        case 13: { // Enter Key
          if (selectedSearchMenuIndex > -1) {
            this.onSearchSuggestionClick(selectedSearchMenuIndex);
          }
          else {
            this.searchMenuHide();
          }
          break;
        }
        case 40: { // Arrow Down Key
          if (selectedSearchMenuIndex < visibleColumns.length - 1) {
            this.setState({
              selectedSearchMenuIndex: selectedSearchMenuIndex + 1,
            });
          }
          break;
        }
        case 38: { // Arrow Up Key
          if (selectedSearchMenuIndex > -1) {
            this.setState({
              selectedSearchMenuIndex: selectedSearchMenuIndex - 1,
            });
          }
          break;
        }
        default: break;
      }
    }
  };

  componentDidMount() {
    const { bulkActions, bulkStatusChange, tableActions: { updateTableState }, tableData: { tableSettings: { searchTerm, selectedFilters } } } = this.props;
    (bulkActions || bulkStatusChange) && updateTableState({ bulkActions, bulkStatusChange });

    // if initial searchTerm or selectedFilters is provided, set it and run onSearchFilter
    (searchTerm || !isEmpty(selectedFilters)) && 
    this.setState({ searchTerm, selectedFilters, }, () => {
      this.onSearchFilter();
      this.searchMenuHide();
    });

    document.addEventListener('keyup', this.keyPressHandle);
  }

  componentDidUpdate(prevProps) {
    const { selectedFilters } = this.props.tableData.tableSettings;
    if (!isEmpty(selectedFilters) && !isEqual(prevProps.tableData.tableSettings.selectedFilters, selectedFilters)) {
      this.setState({ selectedFilters });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.keyPressHandle);
  }
  
  render() {
    const {
      tableData: { bulkActions, bulkStatusChange, columns, rowData, selectEnabled, statusOptions, title },
      canFilter, canHideColumns, canSearch, customToolbarSection,
    } = this.props;
    const { selectedFilters } = this.state;
    let leftToolbarSection = null;
    if (customToolbarSection) leftToolbarSection = customToolbarSection();
    else if (bulkStatusChange && selectEnabled && statusOptions.length > 0) leftToolbarSection = this.bulkStatusChangeCompose();
    else if (selectEnabled && bulkActions.length > 0) leftToolbarSection = this.bulkActionsCompose();

    return (
      <div>
        <div className='TableToolbar_container'>
          <div className='TableToolbar_leftActions'>
            {leftToolbarSection}
          </div>
          {title && <div className='TableToolbar_title'>{title}</div>}
          <div className='TableToolbar_rightActions'>
            {canSearch && this.searchBarCompose()}
            {canFilter &&
            <Filter
              columns={columns}
              data={rowData}
              disabled={rowData.length === 0}
              onFilterChange={this.onFilterSelection}
              onFilterReset={this.clearSelectedFilters}
              selectedFilters={selectedFilters}
            />}
            {canHideColumns && this.viewColumnsCompose()}
          </div>
        </div>

        {canFilter &&
        <div className='TableToolbar_filterChips'>
          {Object.entries(selectedFilters).map(([key, filterList]) => (
            filterList.map(filterLabel => (
              <Chip
                color='primary'
                key={filterLabel}
                label={filterLabel}
                onDelete={() => this.onRemoveFilter(key, filterLabel)}
                style={{ margin: '0 5px 5px 0' }}
              />
            ))
          )
          )}
        </div>}
      </div>
    );
  }

}

TableToolbar.defaultProps = {
  bulkActions: [],
  bulkStatusChange: false,
  canHideColumns: false,
  canFilter: false,
  canSearch: true,
  loading: true,
};

export default withStyles(styles)(TableToolbar);