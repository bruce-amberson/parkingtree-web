/* eslint-disable indent */
/*
*
* SearchIcon
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { getTranslations } from '../../helpers/translations';

import { Icon } from '@material-ui/core';

import InfoIcon from '../InfoIcon';

import './SearchIcon.styles.css';


class SearchIcon extends React.Component {

  static propTypes = {
    onSearchSubmit: PropTypes.func.isRequired,
    showSearchTips: PropTypes.bool,
  };

  static defaultProps = {
    showSearchTips: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      term: '',
      open: false,
    };

    this.onSearchTermChange = this.onSearchTermChange.bind(this);
    this.toggleInput = this.toggleInput.bind(this);
  }

  onSearchTermChange(term) {
    this.setState({
      term,
    });

    this.props.onSearchSubmit(term);
  }

  toggleInput() {
    this.setState({
      open: !this.state.open,
    },
    () => {
      if (this.state.open) {
        this.searchInput.focus();
      }
      else {
        this.onSearchTermChange('');
      }
    });
  }

  render() {
    return (
      <div className='SearchIcon_container'>
        <div className={this.state.open ? 'SearchIcon_textBoxContainerOpen' : 'SearchIcon_textBoxContainerClosed'}>
          { this.props.showSearchTips && this.state.open
            ? <div className='SearchIcon_infoIcon'>
                <InfoIcon
                  message={
                    <div>
                    <div className='SearchIcon_searchTipsTitle'>{getTranslations('searchicon_head')}</div>
                      <p>
                        <strong>{getTranslations('searchicon_quotations_head')}&nbsp;</strong>
                        <span>{getTranslations('searchicon_quotations_1_text')}<br /><i>{getTranslations('searchicon_quotations_2_text')}&quot;{getTranslations('searchicon_quotations_3_text')}&quot;</i></span>
                      </p>
                      <p>
                        <strong>{getTranslations('searchicon_filter_head')}&nbsp;</strong>
                        <span>{getTranslations('searchicon_filter_1_text')}<br /><i>{getTranslations('searchicon_filter_2_text')}</i></span>
                      </p>
                    </div>
                  }
                  position='bottom'
                />
              </div>
            : null
          }
          <input
            ref={input => {
              this.searchInput = input;
            }}
            className='SearchIcon_input'
            placeholder={getTranslations('search_enter_term_text')}
            value={this.state.term}
            onChange={e => this.onSearchTermChange(e.target.value)}
          />
          <div
            className={this.state.term.length > 0 ? 'SearchIcon_clearInputIconShow' : 'SearchIcon_clearInputIconHide'}
            onClick={() => this.onSearchTermChange('')}
          >
            <Icon>
              <span className='SearchIcon_clearInputIcon'>clear</span>
            </Icon>
          </div>
        </div>
        <div
          className={this.state.open ? 'SearchIcon_iconContainerOpen' : 'SearchIcon_iconContainerClosed'}
          onClick={this.toggleInput}
        >
          <Icon style={{ fontSize: '28px' }}>
            <span className={this.state.open ? 'SearchIcon_searchIconInverse' : 'SearchIcon_searchIcon'}>
              search
            </span>
          </Icon>
        </div>
      </div>
    );
  }
}

export default SearchIcon;
