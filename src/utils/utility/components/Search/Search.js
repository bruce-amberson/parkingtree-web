/*
*
* Search
*
*/
import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { getTranslations } from '../../helpers/translations';

import {
  Icon,
  IconButton,
  Tooltip,
  withStyles,
} from '@material-ui/core';

import IconBtnTooltip from '../IconBtnTooltip';

import './Search.styles.css';

const styles = () => ({
  clearIcon: {
    color: 'var(--primary)',
    fontSize: '28px',
    transition: 'color 300ms',
  },
  clearIconHide: {
    color: 'var(--primary)',
    opacity: 0,
    transition: 'opacity 500ms',
    visibility: 'hidden',
    fontSize: '28px',
  },
  searchIcon: {
    color: 'var(--primary)',
    fontSize: '28px',
  },
  searchIconHide: {
    color: 'rgb(175, 175, 175)',
    fontSize: '28px',
  },
});

export class Search extends React.Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    direction: PropTypes.oneOf(['right', 'left']),
    onChange: PropTypes.func.isRequired,
    onSearchFocus: PropTypes.func,
    onSearchClick: PropTypes.func,
    value: PropTypes.string.isRequired,
    open: PropTypes.bool,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    direction: 'left',
    value: '',
    open: false,
    placeholder: '',
    onSearchFocus: () => null,
    onSearchClick: () => null,
  };

  state = {
    open: this.props.open,
  };

  uniqueSearchInputId = `Search_input_${uuidv4()}`;

  onSearchTermChange = (value) => {
    this.props.onChange(value);
  }

  toggleInput = () => {
    this.setState({
      open: !this.state.open,
    }, () => {
      if (this.state.open) {
        document.getElementById(this.uniqueSearchInputId).focus();
      }
      else {
        this.onSearchTermChange('');
      }
    });
  }

  componentDidUpdate(prevProps) {
    // opens Search textfield if a value is provided and it is currently closed; this is done in the SmartTable
    (!this.state.open && !prevProps.value && this.props.value) && this.setState({ open: true });
  }

  render() {
    const { classes, direction, value, placeholder, disabled } = this.props;
    const { open } = this.state;

    return (
      <div className='Search_container'>
        <div className={`Search_inputElements ${direction}`}>
          {value.length > 0 ?
            <Tooltip title='Clear' id='Search_clearIcon'>
              <IconButton onClick={(e) => {
                e.stopPropagation();
                this.onSearchTermChange('');
              }}
              >
                <Icon className={classes.clearIcon}>
                  clear
                </Icon>
              </IconButton>
            </Tooltip>
            :
            <Tooltip title='' id='Search_clearIcon'>
              <IconButton disabled>
                <Icon className={classes.clearIconHide}>
                  clear
                </Icon>
              </IconButton>
            </Tooltip>
          }
          <IconBtnTooltip
            id='Search_searchIcon'
            buttonProps={{ color: 'primary', disabled }}
            onClick={(e) => {
              e.stopPropagation();
              this.toggleInput(e);
            }}
            icon='search'
            title='Search'
          />
          <input
            id={this.uniqueSearchInputId}
            className={`Search_input ${open ? 'open' : ''} ${direction}`}
            placeholder={placeholder ? placeholder : getTranslations('search_enter_term_text')}
            value={value}
            onChange={e => {
              e.stopPropagation();
              this.onSearchTermChange(e.target.value);
            }}
            onFocus={(e) => {
              e.stopPropagation();
              this.props.onSearchFocus(e);
            }}
            onClick={(e) => {
              e.stopPropagation();
              this.props.onSearchClick(e);
            }}
          />
        </div>
        <hr id='Search_underline' className={`${open ? 'open' : ''} ${direction}`} />
      </div>
    );
  }
}

export default withStyles(styles)(Search);
