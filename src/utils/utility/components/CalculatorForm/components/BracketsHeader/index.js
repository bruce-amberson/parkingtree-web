import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat';

import '../../Calculator.styles.css';

export class BracketsHeader extends Component {
  static propTypes = {
    stickyHeaderTopOffset: PropTypes.number.isRequired,
    bracketNames: PropTypes.arrayOf(PropTypes.string).isRequired,
    onBracketCopyHandler: PropTypes.func.isRequired,
    isViewing: PropTypes.bool.isRequired,
  };

  render() {
    const { bracketNames, onBracketCopyHandler, isViewing, stickyHeaderTopOffset } = this.props;

    return bracketNames.map((bracketName, bracketIndex) => {
      const key = `bracket_header_${bracketIndex}`;
      const copyBracketLabel = isViewing ? (
        <th
          className='brackets'
          valign='bottom'
          key={key}
          style={{ top: `${stickyHeaderTopOffset}px` }}
        >
          <div className='hideOnPrint'>&nbsp;</div>
          <div>{bracketName}</div>
        </th>
      ) : (
        <th
          className={'onclick brackets'}
          onClick={() => onBracketCopyHandler(bracketIndex)}
          valign='bottom'
          key={key}
          style={{ top: `${stickyHeaderTopOffset}px` }}
        >
          <div className='hideOnPrint'><TrendingFlatIcon /></div>
          <div>{bracketName}</div>
        </th>
      );
      const bracketLabel = (
        <th
          valign='bottom'
          className='brackets' key={key}
          style={{ top: `${stickyHeaderTopOffset}px` }}
        >
          <div>{bracketName}</div>
        </th>
      );
      return bracketIndex > 0
        ? copyBracketLabel
        : bracketLabel;
    });
  }
}

export default BracketsHeader;

