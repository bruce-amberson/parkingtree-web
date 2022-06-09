import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, isEqual } from 'lodash';
import * as types from '../SmartTable/constants';

import {
  Button,
  Checkbox,
  FormControl,
  Input,
  InputLabel,
  ListItemText,
  MenuItem,
  Popover,
  Select,
} from '@material-ui/core';

import IconBtnTooltip from '../IconBtnTooltip';

import './styles.css';


export class Filter extends Component {

  static propTypes = {
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        canFilter: PropTypes.bool,
        customFilterList: PropTypes.array,
        key: PropTypes.string.isRequired,
        statusOptions: PropTypes.arrayOf(
          PropTypes.shape({
            value: PropTypes.isRequired,
            display: PropTypes.string,
          })
        ),
        title: PropTypes.string.isRequired,
      })
    ).isRequired,
    data: PropTypes.array.isRequired,
    disabled: PropTypes.bool,
    iconButtonTitle: PropTypes.string,
    onFilterChange: PropTypes.func.isRequired,
    onFilterReset: PropTypes.func.isRequired,
    selectedFilters: PropTypes.object,
  }

  state = {
    filterMenuAnchor: null,
    selectedFilters: {},
    uniqueFilterLists: {},
  }

  getUniqueFilterList = () => {
    const { columns, data } = this.props;
    const uniqueFilterLists = {};

    // sets unique filter list
    data.forEach((row, index) => {
      columns.forEach(column => {
        const canFilter = column.canFilter !== undefined ? column.canFilter : true;

        if (canFilter) { // canFilter can be used to exclude columns for filter lists
          let filterList = uniqueFilterLists[column.key] || [];
          let skipSorting = false;
          
          if (column.statusOptions !== undefined || column.customFilterList !== undefined) {
            const filterOptions = column.customFilterList || column.statusOptions;
            filterList = filterOptions.map(option => option.display || option.value || option);
            skipSorting = true; // no need to sort custom provided filter lists
          }
          else if (!filterList.includes(row[column.key]) && row[column.key]) { // only add in row item, if not already in the unique filter list and value exists
            filterList.push(row[column.key]);
          }
          
          if (index === data.length - 1 && !skipSorting) { // sort filterList on last row, skip custom lists
            filterList = this.dataSorter(column.type, filterList);
          }

          if (filterList.length > 0) uniqueFilterLists[column.key] = filterList; // only add as filter option if list has at least one value
        }
      });
    });

    this.setState({ uniqueFilterLists });
  }

  clearSelectedFilters = () => {
    const { columns, onFilterReset } = this.props;
    const selectedFilters = {};

    // sets beginning selectedFilters as all empty
    columns.forEach(column => selectedFilters[column.key] = []);

    this.setState({ selectedFilters });
    onFilterReset(selectedFilters);
  }

  // sets rowData items' filter status based on being selected or not
  onFilterSelection = (e, key) => {
    const selectedFilters = cloneDeep(this.state.selectedFilters);

    selectedFilters[key] = e.target.value; // set selected filters (array) based on the column title
    
    this.setState({ selectedFilters, });
    this.props.onFilterChange(selectedFilters, key);
  }

  // sort filter list based on data type
  dataSorter = (dataType, array) => {
    array.sort((data1, data2) => {
      const endArray = [null, undefined, ''];
      if (endArray.includes(data1) && endArray.includes(data2)) {
        return (data1 === null && data2 !== null) ? 1 : -1;
      }
      if (endArray.includes(data1)) return 1;
      if (endArray.includes(data2)) return -1;

      switch (dataType) {

        case types.DATE_STRING:
        case types.STRING: {
          data1 = data1.toLowerCase();
          data2 = data2.toLowerCase();
          if (data1 < data2) {
            return -1;
          }
          else if (data1 > data2) {
            return 1;
          }
          return 0;
        }
        case types.DATE_TIME:
          data1 = Date.parse(data1);  
          data2 = Date.parse(data2); 
          if (data2 > data1) {
            return 1;
          }
          else if (data2 < data1) {
            return -1;
          }
          return 0;
        case types.CURRENCY:
        case types.DATE:
        case types.NUMBER: {
          return data2 - data1;
        }

        case types.BOOLEAN: {
          if (data1 && !data2) {
            return 1;
          }
          else if (data2 && !data1) {
            return -1;
          }

          return 0;
        }

        default:
          return 0;
      }
    });

    return array;
  }

  componentDidMount() {
    this.getUniqueFilterList();
    this.clearSelectedFilters();
  }

  componentDidUpdate(prevProps) {
    const dataChanged = prevProps.data.length !== this.props.data.length;
    dataChanged && this.getUniqueFilterList();
    (prevProps.columns.length !== this.props.columns.length || dataChanged) && this.clearSelectedFilters();

    !isEqual(prevProps.selectedFilters, this.props.selectedFilters) && this.setState({ selectedFilters: this.props.selectedFilters }); 
  }

  render() {
    const { columns, disabled, iconButtonTitle } = this.props;
    const { filterMenuAnchor, selectedFilters, uniqueFilterLists } = this.state;

    return (
      <div>
        <IconBtnTooltip
          buttonProps={{ color: 'primary', style: { marginRight: '5px' }, disabled }}
          onClick={(event) => this.setState({ filterMenuAnchor: event.currentTarget })}
          icon='filter_list'
          title={iconButtonTitle}
        />
        <Popover
          open={Boolean(filterMenuAnchor)}
          anchorEl={filterMenuAnchor}
          onClose={() => this.setState({ filterMenuAnchor: null })}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{ style: { width: '800px', padding: '25px' } }}
        >
          <div className='Filter_header'>
            <span>FILTERS</span>
            <Button
              color='primary'
              variant='text'
              onClick={this.clearSelectedFilters}
              size='medium'
              style={{ marginLeft: '15px' }}
            >
              RESET
            </Button>
          </div>
          <div className='Filter_options'>
            {Object.entries(uniqueFilterLists).map(([key, filterList]) => {
              const columnTitle = columns.find(column => column.key === key).title;
              return (
                <FormControl className='Filter_list' key={key}>
                  <InputLabel id='demo-mutiple-checkbox-label'>{columnTitle}</InputLabel>
                  <Select
                    labelId='demo-mutiple-checkbox-label'
                    id='demo-mutiple-checkbox'
                    multiple
                    value={selectedFilters[key] || []}
                    onChange={(e) => this.onFilterSelection(e, key)}
                    input={<Input />}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    {filterList.map((filter) => (
                      <MenuItem key={filter} value={filter}>
                        <Checkbox checked={selectedFilters[key].indexOf(filter) > -1} />
                        <ListItemText primary={filter} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );
            })}
          </div>
        </Popover>
      </div>
    );
  }

}

Filter.defaultProps = {
  disabled: false,
  iconButtonTitle: 'Filter',
  selectedFilters: null,
};

export default Filter; 