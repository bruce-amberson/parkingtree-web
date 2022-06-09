import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Checkbox } from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import InfoIcon from '../../../InfoIcon';

import '../../Calculator.styles.css';

export class FundRow extends Component {
  static propTypes = {
    fundKey: PropTypes.string.isRequired,
    categoryIndex: PropTypes.number.isRequired,
    fund: PropTypes.object.isRequired,
    fundIndex: PropTypes.number.isRequired,
    fundValues: PropTypes.arrayOf(PropTypes.number).isRequired,
    getBracketError: PropTypes.func.isRequired,
    onBracketValueChangeHandler: PropTypes.func.isRequired,
    onBracketBlurHandler: PropTypes.func.isRequired,
    isViewing: PropTypes.bool.isRequired,
    isInternalView: PropTypes.bool.isRequired,
    onFundSelectionHandler: PropTypes.func.isRequired,
    checked: PropTypes.bool.isRequired,
    fundRowBackgroundColor: PropTypes.string.isRequired,
    categoryColor: PropTypes.string,
    onKeyDown: PropTypes.func.isRequired,
    visibleFundId: PropTypes.number.isRequired,
  };

  hasAnyBracketValue = () => {
    return this.props.fundValues.find(value => value > 0);
  }

  onFundSelectionHandler = (checked) => {
    this.setState({ checked });
    this.props.onFundSelectionHandler(checked, this.props.categoryIndex, this.props.fundIndex);
  }
  fundMessageCompose(fund) {
    return (
      <div className='CategoryTableRow_fundMessage'>
        <div>{`Ticker Symbol: ${fund.Ticker}`}</div>
      </div>
    );
  }

  render() {
    const {
      fundKey, isViewing, categoryIndex, fund, fundIndex,
      fundValues, getBracketError, onKeyDown,
      onBracketValueChangeHandler, onBracketBlurHandler, checked,
      fundRowBackgroundColor, categoryColor, visibleFundId, isInternalView,
    } = this.props;

    return (
      <tr key={`fundRow_${fundKey}`} style={{ backgroundColor: `${fundRowBackgroundColor}` }} className={this.hasAnyBracketValue() ? '' : 'hideOnPrint'}>
        <td key={`fundName_${fundKey}`}>
          <div className='fund_title'>
            <div className='hideOnPrint'>
              <Checkbox
                disabled={isViewing}
                checked={checked}
                onChange={e => this.onFundSelectionHandler(e.target.checked)}
                checkedIcon={<CheckBoxIcon style={{ color: categoryColor }} />}
              />
            </div>
            <div>{fund.FundName}</div>
            {fund.MaximumAllocation < 100 && <div className='CategoryTableRow_notes hideOnPrint'>&#42;</div>}
            {fund.Message && <div className='CategoryTableRow_notes hideOnPrint'>&#8224;</div>}
            {fund.Ticker && !isInternalView && <div className='hideOnPrint'><InfoIcon message={this.fundMessageCompose(fund)} /></div>}
          </div>
        </td>
        {!isInternalView 
          ? <td key={`fundFeeRate_${fundKey}`}>{fund.FeeRate}%</td>
          : <td />}
        {fund.AgeBrackets.map((bracket, bracketIndex) => {
          const bracketHasError = getBracketError(
            categoryIndex,
            fundIndex,
            bracketIndex
          );
          const bracketError = bracketHasError ? 'Error' : '';
          return isViewing ? (
            <td key={`bracket_${fundKey}_${bracketIndex}`}>
              {fundValues[bracketIndex]}%
            </td>
          ) : (
            <td key={`bracket_${fundKey}_${bracketIndex}`}>
              <input
                type='text'
                className={`calculator_bracket_input ${bracketError ? 'bracket_error' : ''}`}
                id={`input_${visibleFundId}_${bracketIndex}`}
                onKeyDown={(e) => onKeyDown(e, visibleFundId, bracketIndex)}
                onChange={(e) =>
                  onBracketValueChangeHandler(
                    e.target.value,
                    categoryIndex,
                    fundIndex,
                    bracketIndex
                  )
                }
                onBlur={() =>
                  onBracketBlurHandler(categoryIndex, fundIndex, bracketIndex)
                }
                value={fundValues[bracketIndex] === 0 ? '' : fundValues[bracketIndex]}
              />
            </td>
          );
        })}
      </tr>
    );
  }
}

export default FundRow;

