/*
*
* MultiSelector
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import AutoComplete from '../AutoComplete';
import Chip from '../Chip';

import './MultiSelector.styles.css';


export class MultiSelector extends React.Component {

  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]).isRequired,
      display: PropTypes.string.isRequired,
    })).isRequired,
    selectedOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
    onSelection: PropTypes.func.isRequired,
    hintText: PropTypes.string,
    errorText: PropTypes.string,
    onAdd: PropTypes.func,
    onRemoval: PropTypes.func,
  };

  static defaultProps = {
    onAdd: () => null,
    onRemoval: () => null,
  };

  state = {
    term: '',
  };

  optionsListCompile() {
    const selectedOptionValue = this.props.selectedOptions.map(option => option.value);
    return [
      { value: -1, display: 'All' },
      ...this.props.options.filter(option => selectedOptionValue.indexOf(option.value) === -1),
    ];
  }

  selectionAdd = (selection) => {
    if (selection.value === -1) {
      this.props.options.forEach(option => this.props.onAdd(option));
      this.setState({ term: '' }, () => {
        this.props.onSelection(this.props.options);
      });
    }
    else {
      this.props.onAdd(selection);
      this.setState({ term: '' }, () => {
        this.props.onSelection(this.props.selectedOptions.concat(selection));
      });
    }
  }

  selectionRemove(selection) {
    const updatedSelectedOptions = [...this.props.selectedOptions];
    const selectionIndex = updatedSelectedOptions.findIndex(option => option.value === selection.value);
    if (selectionIndex > -1) {
      updatedSelectedOptions.splice(selectionIndex, 1);
    }

    this.props.onRemoval(selection);
    this.props.onSelection(updatedSelectedOptions);
  }

  render() {
    return (
      <div>
        <AutoComplete
          options={this.optionsListCompile()}
          onSelect={this.selectionAdd}
          TextFieldProps={{
            label: this.props.hintText || 'Select options(s)...',
            error: Boolean(this.props.errorText),
            helperText: this.props.errorText,
          }}
          DownshiftProps={{
            inputValue: this.state.term,
            onInputValueChange: term => this.setState({ term }),
          }}
        />
        <div className='MultiSelector_tags'>
          {this.props.selectedOptions.map(option => (
            <Chip
              key={option.value}
              name={option.display}
              actions={[{
                icon: 'close',
                tooltip: 'Remove',
                action: () => this.selectionRemove(option),
              }]}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default MultiSelector;
