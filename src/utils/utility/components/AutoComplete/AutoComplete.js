/*
*
* AutoComplete
*
*/
import React from 'react';
import PropTypes from 'prop-types';
import Fuse from 'fuse.js';
import deburr from 'lodash/deburr'; // Diacritic marks and supplementary letters are converted to nearest ASCII character sequence

import Downshift from 'downshift';
import {
  TextField,
  Paper,
  MenuItem,
} from '@material-ui/core';

const getFuzzySuggestions = (searchValue, items, keyName, fuseThreshold) => {
  const normalizedSearchValue = deburr(searchValue.trim()).toLowerCase();
  const fuseOptions = {
    shouldSort: true,
    threshold: fuseThreshold,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [keyName]
  };
  const fuse = new Fuse(items, fuseOptions);
  const results = fuse.search(normalizedSearchValue);
  const foundItems = results.map(result => result.item);
  return foundItems;
};

export function AutoComplete({
  onSelect,
  options,
  DownshiftProps,
  TextFieldProps,
  MenuItemProps,
  showAllOnEmptyInput = true, // show all items alphabeticaly if no search input
  numOfDropdownItems = 10, // number of items showing in dropdown menu, 0 value shows all
  fuseThreshold = 0.6 // A threshold of 0.0 requires a perfect match (of both letters and location), a threshold of 1.0 would match anything.
}) {
  return (
    <Downshift
      onSelect={onSelect}
      itemToString={item => item ? item.display : ''}
      {...DownshiftProps}
    >
      {({
        inputValue,
        isOpen,
        getInputProps,
        getItemProps,
        getMenuProps,
        highlightedIndex,
        closeMenu,
        openMenu,
      }) => {
        const fuzzySuggestions = showAllOnEmptyInput && !inputValue ? options.sort((optA, optB) => {
          let comparison = 0;
          if (optA.key > optB.key) {
            comparison = 1;
          }
          else if (optA.key < optB.key) {
            comparison = -1;
          }
          return comparison;
        }) : getFuzzySuggestions(inputValue, options, 'display', fuseThreshold);
        return (
          <div>
            <TextField
              fullWidth
              inputProps={{
                onFocus: () => openMenu(),
                onBlur: () => closeMenu(),
              }}
              {...TextFieldProps}
              {...getInputProps()}
            />
            <div style={{ position: 'relative' }} {...getMenuProps()}>
              {isOpen && (
                <Paper
                  elevation={2}
                  style={{
                    position: 'absolute',
                    zIndex: 1,
                    left: 0,
                    right: 0,
                  }}
                >
                  {fuzzySuggestions
                    .slice(0, numOfDropdownItems ? numOfDropdownItems : fuzzySuggestions.length)
                    .map((item, index) => (
                      <MenuItem
                        key={item.value}
                        {...MenuItemProps}
                        {...item.props}
                        {...getItemProps({
                          index,
                          item,
                          selected: highlightedIndex === index
                        })}
                      >
                        {item.display}
                      </MenuItem>
                    ))}
                </Paper>
              )}
            </div>
          </div>
        );
      }}
    </Downshift>
  );
}

AutoComplete.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    display: PropTypes.string.isRequired,
    props: PropTypes.object,
  })).isRequired,
  onSelect: PropTypes.func.isRequired,
  DownshiftProps: PropTypes.object,
  TextFieldProps: PropTypes.object,
  MenuItemProps: PropTypes.object,
  showAllOnEmptyInput: PropTypes.bool,
  numOfDropdownItems: PropTypes.number,
  fuseThreshold: PropTypes.number
};

export default AutoComplete;
