/*
*
* LegalFooter
*
*/
import React from 'react';
import PropTypes from 'prop-types';
import { getTranslations } from '../../helpers/translations';
import IconBtnTooltip from '../IconBtnTooltip';
import {
  Paper,
  Collapse,
} from '@material-ui/core';

import './LegalFooter.styles.css';

export const legalVersion = 'show-legal-1.0';


class LegalFooter extends React.Component {

  static propTypes = {
    programDescriptionLink: PropTypes.string,
  };

  state = {
    expanded: JSON.parse(localStorage.getItem(legalVersion)) || JSON.parse(localStorage.getItem(legalVersion)) === null,
  };

  showFooterSet() {
    this.setState({
      expanded: !this.state.expanded
    }, () => {
      localStorage.setItem(legalVersion, this.state.expanded);
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.expanded !== nextState.expanded;
  }

  render() {
    return (
      <footer className='LegalFooter_footer hideOnPrint'>
        <Paper>
          <div className='LegalFooter_legalContainer'>
            <div className='LegalFooter_headerContainer'>
              <h1 className='LegalFooter_header'>{getTranslations('legalfooter_head')}</h1>
              <IconBtnTooltip
                buttonProps={{ 'aria-expanded': this.state.expanded }}
                onClick={() => this.showFooterSet()}
                icon={this.state.expanded ? 'expand_less' : 'expand_more'}
                iconProps={{ className: 'LegalFooter_arrowIcon' }}
              />
            </div>
            <Collapse in={this.state.expanded} style={this.state.expanded ? { display: 'block' } : { visibility: 'hidden' }} tabIndex={this.state.expanded ? 0 : -1}> {/* eslint-disable-line */}
              <div className='LegalFooter_legalBody'>
                <p>
                  {getTranslations('legalfooter_p1a_text')} <a href={this.props.programDescriptionLink || getTranslations('legalfooter_program_desc_nav')} target='_blank' rel='noopener noreferrer' className='LegalFooter_link'>{getTranslations('legalfooter_p1b_text')}</a>{getTranslations('legalfooter_p1c_text')}&nbsp;
                  <a href={`mailto:${getTranslations('legalfooter_email_nav')}`} className='LegalFooter_link'>{getTranslations('legalfooter_email_nav')}</a>.
                </p>
                <p>
                  <strong>{getTranslations('legalfooter_p2_head')}</strong>{getTranslations('legalfooter_p2_text')}
                </p>
                <p>
                  {getTranslations('legalfooter_p3_text')}
                </p>
                <p>
                  <strong>{getTranslations('legalfooter_p4_head')}</strong>{getTranslations('legalfooter_p4_text')}
                </p>
                <p>
                  <strong>{getTranslations('legalfooter_p5_head')}</strong>{getTranslations('legalfooter_p5_text')}
                </p>
                <p>
                  <strong>{getTranslations('legalfooter_p6_head')}</strong>{getTranslations('legalfooter_p6_text')}
                </p>
                <p>
                  <strong>{getTranslations('legalfooter_p7_head')}</strong>{getTranslations('legalfooter_p7_text')}
                </p>
                <p>
                  <strong>{getTranslations('legalfooter_p8_head')}</strong>{getTranslations('legalfooter_p8_text')}
                </p>
                <p>
                  <strong>{getTranslations('legalfooter_p9_head')}</strong>{getTranslations('legalfooter_p9_text')}
                </p>
                <p>
                  {getTranslations('legalfooter_p10_text')}
                </p>
                <br />
              </div>
            </Collapse>
          </div>
        </Paper>
      </footer>
    );
  }
}

export default LegalFooter;
