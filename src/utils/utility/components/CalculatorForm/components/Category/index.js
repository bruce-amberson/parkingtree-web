import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FundRow from '../FundRow';

import '../../Calculator.styles.css';

export class Category extends Component {
  static propTypes = {
    subCategoryStickyHeaderOffset: PropTypes.number.isRequired,
    categoryKey: PropTypes.string.isRequired,
    funds: PropTypes.array.isRequired,
    categoryIndex: PropTypes.number.isRequired,
    showSelectedFundsOnly: PropTypes.bool.isRequired,
    matrixAllocations: PropTypes.array.isRequired,
    getBracketError: PropTypes.func.isRequired,
    onBracketValueChangeHandler: PropTypes.func.isRequired,
    onBracketBlurHandler: PropTypes.func.isRequired,
    onFundSelectionHandler: PropTypes.func.isRequired,
    selectedFunds: PropTypes.array.isRequired,
    categoryColor: PropTypes.string,
    isViewing: PropTypes.bool.isRequired,
    isInternalView: PropTypes.bool.isRequired, // hides the subcategory header in this component
    visibleFundIds: PropTypes.array.isRequired,
    onKeyDown: PropTypes.func.isRequired,
  };

  render() {
    const {
      categoryKey, funds, categoryIndex, visibleFundIds,
      showSelectedFundsOnly, matrixAllocations,
      getBracketError, onBracketValueChangeHandler, onBracketBlurHandler,
      onFundSelectionHandler, selectedFunds, categoryColor,
      subCategoryStickyHeaderOffset, isViewing, onKeyDown, isInternalView,
    } = this.props;

    // add transparency to rows
    const categoryColorTransp = `${categoryColor}20`;

    let previousFundSubCategoryId = 0;
    return matrixAllocations.length > 0 && funds.map((fund, fundIndex) => {
      const rows = [];
      const fundKey = `${categoryKey}_${fund.FundId}_${fundIndex}`;
      const isNewSubCategoryId = fund.FundSubCategoryId !== previousFundSubCategoryId;
      if (isNewSubCategoryId)
        previousFundSubCategoryId = fund.FundSubCategoryId;

      if (isNewSubCategoryId && !showSelectedFundsOnly && !isViewing && !isInternalView) {
        rows.push(
          <tr key={`subasset_${fundKey}`}>
            <th colSpan='100%' className='subcategory hideOnPrint' style={{ top: `${subCategoryStickyHeaderOffset}px` }}>
              {fund.FundSubCategoryName}
            </th>
          </tr>
        );
      }

      const visibleFundId = visibleFundIds[categoryIndex][fundIndex];
      if (visibleFundId > -1) {
        rows.push(
          <FundRow
            isViewing={isViewing}
            isInternalView={isInternalView}
            visibleFundId={visibleFundId}
            fundIndex={fundIndex}
            categoryColor={categoryColor}
            fundRowBackgroundColor={categoryColorTransp}
            fundKey={fundKey}
            key={fundKey}
            categoryIndex={categoryIndex}
            fund={fund}
            fundValues={matrixAllocations[categoryIndex][fundIndex]}
            getBracketError={getBracketError}
            onBracketValueChangeHandler={onBracketValueChangeHandler}
            onBracketBlurHandler={onBracketBlurHandler}
            onFundSelectionHandler={onFundSelectionHandler}
            checked={selectedFunds[categoryIndex][fundIndex]}
            onKeyDown={onKeyDown}
          />
        );
      }

      return rows;
    });
  }
}

export default Category;