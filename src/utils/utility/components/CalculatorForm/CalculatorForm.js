import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import IconBtnTooltip from '../IconBtnTooltip';
import LoadingOverlay from '../LoadingOverlay';

import {
  TextField,
} from '@material-ui/core';

import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@material-ui/icons';

import BracketsHeader from './components/BracketsHeader';
import Category from './components/Category';
import FormTotalsFoot from './components/FormTotalsFoot';
import StackedBarChart from './components/StackedBarChart';

import { populate3DCalculatorSchema } from './helpers';

import './Calculator.styles.css';

const errorMessageBracketTotals = (isStatic) => isStatic ? 'The Total Allocation must equal 100%.' : 'The Total Allocations for each age bracket must equal 100%.';
const errorBracketTotalSumOver100 = 'The column total should not be more than 100%.';
const errorMessageBracketAllocation = (fundName, maxAllocation) => `The percentage for ${fundName} cannot exceed ${maxAllocation}%`;
const errorMessageTemplateName = 'Template name has to be between 1 and 40 characters long.';

export class CalculatorForm extends Component {
  static propTypes = {
    /****************** REQUIRED ******************/
    stickyHeaderTopOffset: PropTypes.number.isRequired, // this is offset from top in pixels for sticky headers
    schema: PropTypes.object.isRequired, // it can be static, age-based for new, edit, view, or investment path
    isViewing: PropTypes.bool, // this will show only non zero funds with all functionality and buttons except print disabled
    currentDate: PropTypes.oneOfType([ // this is to calculate current year for help info below the calculator
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    /****************** OPTIONAL ******************/
    loading: PropTypes.bool, // you can pass to show loading bar
    isTemplateNameEditing: PropTypes.bool, // you can edit template name
    onAllocationChange: PropTypes.func, // on each cell input this will return all allocations as 3D matrix and all errors
    onTemplateNameChange: PropTypes.func, // on each template name input this will return template name and all errors
    onSave: PropTypes.func, // you can pass what happens on click save button
    hideTemplateName: PropTypes.bool, // if for some reason the template name needs to be hidden (for example investment path)
    hidePrintBtn: PropTypes.bool, // hides print button
    isInternalView: PropTypes.bool, // hides footer with graph and totals, text below footer, and all category headers and subheaders
  };

  static defaultProps = {
    loading: false,
    isViewing: false,
    isTemplateNameEditing: false,
    hideTemplateName: false,
    hidePrintBtn: false,
    isInternalView: false,
  };

  /********** INITIALIZATION **********/
  initializeCategoriesToShow = (categories) => categories.map(() => true);

  initializeMatrixAllocations = (categories) => {
    return categories.map((category) => category.Funds.map((fund) =>
      fund.AgeBrackets.map((bracket) => bracket.Percentage)
    ));
  }

  initializeMatrixMaxAllocations = (categories) => {
    return categories.map((category) => category.Funds.map((fund) =>
      fund.AgeBrackets.map(() => fund.MaximumAllocation)
    ));
  }

  initializeCalculator = (schema) => {
    const { isViewing, stickyHeaderTopOffset, isTemplateNameEditing } = this.props;

    const isStatic = schema.TemplateType === 'S';
    const bracketNames = schema.FundCategories[0].Funds[0].AgeBrackets.map((bracket) => bracket.BracketName);
    const matrixAllocations = this.initializeMatrixAllocations(schema.FundCategories);
    // initialize colors
    const categoryColors = schema.FundCategories.map(category => category.FundCategoryColor);
    // in case of editing all values need to be recalculated
    const categoriesSubtotals = matrixAllocations.map((funds) => bracketNames.map((bracketName, bracketIndex) => this.getCategorySubtotalPerBracket(bracketIndex, funds)));
    const bracketTotals = bracketNames.map((bracketName, bracketIndex) => this.getBracketTotal(bracketIndex, matrixAllocations, categoriesSubtotals));
    const fundExpenseRatios = schema.FundCategories.map((category) => category.Funds.map((fund) => fund.FeeRate));
    const estFundFees = this.estFundFeesCalculate(matrixAllocations, fundExpenseRatios, bracketNames);
    const my529AdminAssetFees = bracketNames.map(() => schema.AssetFeeRate * 100);
    const estTotalFees = this.estTotalFeesCalculate(estFundFees, my529AdminAssetFees, bracketNames);
    const hasFundsValues = matrixAllocations.map((funds) => funds.map((brackets) => Boolean(brackets.find((bracketValue) => bracketValue > 0))));
    const selectedFunds = matrixAllocations.map((funds, categoryIndex) => funds.map((brackets, fundIndex) => hasFundsValues[categoryIndex][fundIndex]));
    const categoriesToShow = this.initializeCategoriesToShow(schema.FundCategories);
    // initialize error messages
    const errorMessages = {
      hasAllocationAmountError: '', // assuming there are no bracket errors to start with
      hasAnyBracketTotalNot100Error: this.getBracketsTotalsError(bracketTotals), // but calculating the total amounts errors in case of editing
      templateNameNot1To40CharsError: isTemplateNameEditing ? errorMessageTemplateName : '', // template value is empty to start with if template name is editing
      hasBracketTotalSumOver100Error: '', // starting with empty values or the correct ones from api
    };
    // agreement year for foot notes
    const currentDate = moment(this.props.currentDate); // if api date is missing defaults to the browser one
    const currentYear = currentDate.format('YYYY');
    const agreementYear = currentDate.isAfter(`${currentYear}-02-28`, 'day') ? currentDate.add('1', 'year').format('YYYY') : currentYear;
    // calculate sticky headers offsets when age-based, static, or viewing
    const categoryStickyHeaderOffset = stickyHeaderTopOffset + 60;
    const subCategoryStickyHeaderOffset = categoryStickyHeaderOffset + (isViewing ? 27 : 36);

    this.setState({
      categoryColors,
      templateName: '',
      wasSaveClicked: false,
      categoryStickyHeaderOffset,
      subCategoryStickyHeaderOffset,
      agreementYear,
      matrixAllocations,
      matrixMaxAllocations: this.initializeMatrixMaxAllocations(schema.FundCategories),
      bracketTotals,
      fundExpenseRatios,
      categoriesSubtotals,
      estFundFees,
      my529AdminAssetFees,
      estTotalFees,
      categoriesToShow,
      bracketErrorIndices: bracketNames.map(() => -1), // assuming there are no bracket errors to start with
      hasFundsValues,
      selectedFunds,
      bracketNames,
      errorMessages,
      showSelectedFundsOnly: false,
      isStatic,
      isInitializing: false,
      visibleFundIds: this.getVisibleFundIdsForIndexing(false, selectedFunds, categoriesSubtotals, categoriesToShow),
    });
    // send initial values and errors to a parent
    this.props.onAllocationChange && this.props.onAllocationChange(matrixAllocations, errorMessages);
  }

  state = {
    categoryStickyHeaderOffset: 0,
    subCategoryStickyHeaderOffset: 0,
    matrixAllocations: [],
    templateName: '',
    matrixMaxAllocations: [],
    bracketNames: [],
    bracketTotals: [],
    fundExpenseRatios: [],
    estFundFees: [],
    estTotalFees: [],
    my529AdminAssetFees: [],
    categoriesSubtotals: [],
    categoriesToShow: [true],
    bracketErrorIndices: [],
    errorMessages: {
      hasAnyBracketTotalNot100Error: '',
      hasAllocationAmountError: '',
      templateNameNot1To40CharsError: '',
      hasBracketTotalSumOver100Error: ''
    },
    showSelectedFundsOnly: false,
    isStatic: true,
    hasFundsValues: [[false]],
    selectedFunds: [[false]],
    agreementYear: null,
    isInitializing: true,
    categoryColors: [],
    visibleFundIds: [],
    wasSaveClicked: false,
  };

  /********** HELPER METHODS **********/
  cumulativeOffset = (element) => {
    let top = 0;
    do {
      top += element.offsetTop || 0;
      element = element.offsetParent;
    } while (element);
    return top;
  };

  isCategoryShowing = (categoryIndex, categoriesSubtotals) => {
    const categoryHas0Sum = categoriesSubtotals[categoryIndex].reduce((sum, bracketSum) => sum += bracketSum, 0) === 0;
    const showCategory = !(this.props.isViewing && categoryHas0Sum);
    return showCategory;
  }

  getVisibleFundIdsForIndexing = (showSelectedFundsOnly, selectedFunds, categoriesSubtotals, categoriesToShow) => {
    let visibleFundIndex = 0;
    if (this.props.isViewing) {
      // if we are viewing we want to show only funds as if Show Selected Funds only on
      showSelectedFundsOnly = true;
    }
    const visibleFundIds = selectedFunds
      .map((category, categoryIndex) => category
        .map((isFundSelected) => {
          const showCategory = this.isCategoryShowing(categoryIndex, categoriesSubtotals) && categoriesToShow[categoryIndex];
          const showFund = showSelectedFundsOnly ? isFundSelected && showCategory : showCategory;
          if (showFund) {
            return visibleFundIndex++;
          }
          else {
            return -1;
          }
        })
      );

    return visibleFundIds;
  }

  getVisibleFundIdsLength = () => {
    const visibleFundIds = this.state.visibleFundIds;
    let length = 0;
    visibleFundIds.forEach(fundIds => fundIds.forEach(fundId => {
      if (fundId > -1)
        length++;
    }));
    return length;
  }

  wasAnyFundSelected = () =>
    this.state.selectedFunds.find((category) =>
      category.find((wasFundSelected) => wasFundSelected)
    );

  /********** VALIDATION AND ERRORS **********/
  getBracketError = (categoryIndex, fundIndex, bracketIndex) => {
    const { bracketErrorIndices } = this.state;
    return (
      categoryIndex === bracketErrorIndices[0] &&
      fundIndex === bracketErrorIndices[1] &&
      bracketIndex === bracketErrorIndices[2] &&
      !bracketErrorIndices.includes(-1)
    );
  };

  getBracketsTotalsError = (bracketTotals) => {
    // check if any bracket total is less than 100 but more than 0
    const hasAnyBracketTotalNot100Error = bracketTotals.some(bracketTotal => bracketTotal !== 100);
    return hasAnyBracketTotalNot100Error ? errorMessageBracketTotals(this.state.isStatic) : '';
  }

  validateMatrixAndGetErrors = (value, categoryIndex, fundIndex, bracketIndex, bracketTotals) => {
    const { matrixMaxAllocations, errorMessages } = this.state;
    const { schema: { FundCategories } } = this.props;

    const maxAllocation = matrixMaxAllocations[categoryIndex][fundIndex][bracketIndex];
    const fundName = FundCategories[categoryIndex].Funds[fundIndex].FundName;

    // check max allocation amount 
    const hasAllocationAmountError = value < 0 || value > maxAllocation;
    // check if the column sum is not over 100%
    const hasBracketTotalSumOver100Error = bracketTotals[bracketIndex] > 100 ? errorBracketTotalSumOver100 : '';
    const updatedErrorMessages = {
      ...errorMessages, // there might be from the template name validation
      hasAnyBracketTotalNot100Error: this.getBracketsTotalsError(bracketTotals),
      hasAllocationAmountError: hasAllocationAmountError ? errorMessageBracketAllocation(fundName, maxAllocation) : '',
      hasBracketTotalSumOver100Error
    };

    const bracketErrorIndices = hasAllocationAmountError || hasBracketTotalSumOver100Error ? [categoryIndex, fundIndex, bracketIndex] : [-1, -1, -1];
    this.setState({ bracketErrorIndices });
    return updatedErrorMessages;
  }

  /********** SUM CALCULATORS **********/
  getCategorySubtotalPerBracket = (bracketIndex, funds) => {
    return funds.reduce((sum, bracketValues) => {
      const bracketValue = isNaN(bracketValues[bracketIndex])
        ? 0
        : bracketValues[bracketIndex];
      return sum + bracketValue;
    }, 0);
  }

  updateAndGetCategoriesSubtotals = (categoryIndex, bracketIndex, matrixAllocations, categoriesSubtotals) => {
    categoriesSubtotals[categoryIndex][bracketIndex] = this.getCategorySubtotalPerBracket(bracketIndex, matrixAllocations[categoryIndex]);
    return categoriesSubtotals;
  }

  getBracketTotal = (bracketIndex, matrixAllocations, categoriesSubtotals) => {
    return matrixAllocations.reduce(
      (sum, category, categoryIndex) => sum + categoriesSubtotals[categoryIndex][bracketIndex],
      0
    );
  }

  updateAndGetBracketTotals = (bracketIndex, matrixAllocations, categoriesSubtotals) => {
    // reuse subtotal to calculate totals
    const updatedBracketTotals = this.state.bracketTotals;
    updatedBracketTotals[bracketIndex] = this.getBracketTotal(bracketIndex, matrixAllocations, categoriesSubtotals);
    return updatedBracketTotals;
  }

  estTotalFeesCalculate = (estFundFees, my529AdminAssetFees, bracketNames) => bracketNames.map((bracket, idx) => {
    return estFundFees[idx] + my529AdminAssetFees[idx];
  })

  estFundFeesCalculate(matrixAllocations, fundExpenseRatios, bracketNames) {
    const getCalculatedFundFeesTotalPerCategoryAndBracket = (categoryFunds, categoryIndex, bracketIndex) => {
      return categoryFunds.reduce((sum, fundValue, fundIndex) => {
        const fundAllocationForBracket = matrixAllocations[categoryIndex][fundIndex][bracketIndex];
        const fundFeeRate = fundExpenseRatios[categoryIndex][fundIndex];
        sum += (fundAllocationForBracket / 100) * fundFeeRate;
        return sum;
      }, 0);
    };

    const getCalculatedFundFeesTotalPerBracket = (bracketIndex) => {
      return matrixAllocations.reduce((sum, categoryFunds, categoryIndex) => {
        sum += getCalculatedFundFeesTotalPerCategoryAndBracket(categoryFunds, categoryIndex, bracketIndex);
        return sum;
      }, 0);
    };

    return bracketNames.map((bracketName, bracketIndex) => getCalculatedFundFeesTotalPerBracket(bracketIndex));
  }

  /********** HANDLERS **********/
  resetCalculatorHandler = () => {
    const { schema } = this.props;
    const zeroedMatrixAllocations = schema.FundCategories.map((category) => category.Funds.map((fund) =>
      fund.AgeBrackets.map(() => 0)
    ));
    const zeroedSchema = populate3DCalculatorSchema(zeroedMatrixAllocations, schema);
    this.initializeCalculator(zeroedSchema);
  }

  onSelectedFundsToggleHandler = (e, categories) => {
    e && e.stopPropagation();
    const showSelectedFundsOnly = !this.state.showSelectedFundsOnly;
    // let's expend all not user collapsed categories when toggling show selected categories off
    const categoriesToShow = !showSelectedFundsOnly ? this.initializeCategoriesToShow(categories) : this.state.categoriesToShow;
    this.setState({
      showSelectedFundsOnly,
      visibleFundIds: this.getVisibleFundIdsForIndexing(showSelectedFundsOnly, this.state.selectedFunds, this.state.categoriesSubtotals, categoriesToShow) // re-index ids of all input cells
    });
  };

  onCategoryExpendToggleHandler = (categoryIndex) => {
    const updatedCategoriesToShow = this.state.categoriesToShow;
    updatedCategoriesToShow[categoryIndex] = !updatedCategoriesToShow[categoryIndex];
    this.setState({
      categoriesToShow: updatedCategoriesToShow,
      visibleFundIds: this.getVisibleFundIdsForIndexing(this.state.showSelectedFundsOnly, this.state.selectedFunds, this.state.categoriesSubtotals, updatedCategoriesToShow) // re-index ids of all input cells
    });
  };

  onBracketBlurHandler = (categoryIndex, fundIndex, bracketIndex) => {
    const updatedMatrix = this.state.matrixAllocations;
    if (
      this.getBracketError(categoryIndex, fundIndex, bracketIndex) ||
      isNaN(updatedMatrix[categoryIndex][fundIndex][bracketIndex])
    ) {
      // reset bracket value to 0
      this.onBracketValueChangeHandler(0, categoryIndex, fundIndex, bracketIndex);
    }
  };

  onFundSelectionHandler = (checked, categoryIndex, fundIndex) => {
    const {
      selectedFunds, matrixAllocations,
      bracketNames, my529AdminAssetFees
    } = this.state;
    const { schema } = this.props;
    const { showSelectedFundsOnly } = this.state;

    const updatedSelectedFunds = selectedFunds;
    const updatedMatrixAllocations = matrixAllocations;
    updatedSelectedFunds[categoryIndex][fundIndex] = checked;
    // reset fund row to 0s if unselected
    if (!checked) {
      this.state.bracketNames.forEach((bracketName, bracketIndex) => updatedMatrixAllocations[categoryIndex][fundIndex][bracketIndex] = 0);
      // recalculate sums
      const categoriesSubtotals = updatedMatrixAllocations.map((funds) => bracketNames.map((bracketName, bracketIndex) => this.getCategorySubtotalPerBracket(bracketIndex, funds)));
      const bracketTotals = bracketNames.map((bracketName, bracketIndex) => this.getBracketTotal(bracketIndex, updatedMatrixAllocations, categoriesSubtotals));
      const fundExpenseRatios = schema.FundCategories.map((category) => category.Funds.map((fund) => fund.FeeRate));
      const estFundFees = this.estFundFeesCalculate(updatedMatrixAllocations, fundExpenseRatios, bracketNames);
      const estTotalFees = this.estTotalFeesCalculate(estFundFees, my529AdminAssetFees, bracketNames);
      const hasFundsValues = updatedMatrixAllocations.map((funds) => funds.map((brackets) => Boolean(brackets.find((bracketValue) => bracketValue > 0))));
      this.setState({
        matrixAllocations: updatedMatrixAllocations,
        bracketTotals,
        fundExpenseRatios,
        categoriesSubtotals,
        estFundFees,
        estTotalFees,
        hasFundsValues,
        selectedFunds: updatedSelectedFunds,
      }, () => {
        // also check if there are any allocations and if not disable show selected funds button and expand all funds
        !this.wasAnyFundSelected() && showSelectedFundsOnly && this.onSelectedFundsToggleHandler(null, schema.FundCategories);
      });
    }
    else {
      // just update selected funds
      this.setState({ selectedFunds: updatedSelectedFunds });
    }
  }

  onTemplateNameChangeHandler = (e) => {
    const templateName = e.target.value;
    const { onTemplateNameChange } = this.props;
    // check if template name is empty or more than 40 chars
    const updatedErrorMessages = { ...this.state.errorMessages };
    updatedErrorMessages.templateNameNot1To40CharsError = this.props.isTemplateNameEditing && (templateName.length === 0 || templateName.length > 40) ? errorMessageTemplateName : '';

    this.setState({ templateName, errorMessages: updatedErrorMessages });

    // pass to the parent if it wants it
    onTemplateNameChange && onTemplateNameChange(templateName, updatedErrorMessages);
  }

  onBracketValueChangeHandler = (value, categoryIndex, fundIndex, bracketIndex) => {
    const {
      matrixAllocations, hasFundsValues, fundExpenseRatios, bracketNames,
      my529AdminAssetFees, categoriesSubtotals
    } = this.state;
    const { onAllocationChange } = this.props;

    const updatedMatrix = matrixAllocations;
    const updatedSelectedFunds = hasFundsValues;
    value = parseInt(value, 10);
    value = isNaN(value) ? 0 : value;

    updatedMatrix[categoryIndex][fundIndex][bracketIndex] = value;
    const checked = value > 0;
    updatedSelectedFunds[categoryIndex][fundIndex] = checked;
    // also update the checkbox
    checked && this.onFundSelectionHandler(checked, categoryIndex, fundIndex);
    // recalculate expense ratios for each fund
    const updatedEstFundFees = this.estFundFeesCalculate(updatedMatrix, fundExpenseRatios, bracketNames);
    // recalculate est total fees
    const updatedEstTotalFees = this.estTotalFeesCalculate(updatedEstFundFees, my529AdminAssetFees, bracketNames);
    // recalculate subtotals for categories
    const updatedCategoriesSubtotals = this.updateAndGetCategoriesSubtotals(categoryIndex, bracketIndex, updatedMatrix, categoriesSubtotals);
    // recalculate totals for all brackets
    const updatedBracketTotals = this.updateAndGetBracketTotals(bracketIndex, updatedMatrix, updatedCategoriesSubtotals);
    const updatedErrorMessages = this.validateMatrixAndGetErrors(value, categoryIndex, fundIndex, bracketIndex, updatedBracketTotals);

    this.setState({
      matrixAllocations: updatedMatrix,
      hasFundsValues: updatedSelectedFunds,
      estFundFees: updatedEstFundFees,
      estTotalFees: updatedEstTotalFees,
      categoriesSubtotals: updatedCategoriesSubtotals,
      bracketTotals: updatedBracketTotals,
      errorMessages: updatedErrorMessages,
    });

    // pass to the parent if it wants it
    onAllocationChange && onAllocationChange(updatedMatrix, updatedErrorMessages);
  };

  onBracketCopyHandler = (bracketIndex) => {
    const { onAllocationChange } = this.props;
    const {
      matrixAllocations, categoriesSubtotals, fundExpenseRatios,
      bracketNames, my529AdminAssetFees, errorMessages
    } = this.state;
    // copy to the next right column
    const updatedMatrix = matrixAllocations;
    let updatedCategoriesSubtotals = [];
    updatedMatrix.forEach((category, categoryIndex) =>
      category.forEach(
        (fund, fundIndex) => {
          updatedMatrix[categoryIndex][fundIndex][bracketIndex] = matrixAllocations[categoryIndex][fundIndex][bracketIndex - 1];
          // recalculate subtotals for categories
          updatedCategoriesSubtotals = this.updateAndGetCategoriesSubtotals(categoryIndex, bracketIndex, updatedMatrix, categoriesSubtotals);
        }
      )
    );
    // recalculate totals for all brackets
    const updatedBracketTotals = this.updateAndGetBracketTotals(bracketIndex, updatedMatrix, updatedCategoriesSubtotals);
    const hasAnyBracketTotalNot100Error = this.getBracketsTotalsError(updatedBracketTotals);
    // recalculate expense ratios for each fund
    const updatedEstFundFees = this.estFundFeesCalculate(updatedMatrix, fundExpenseRatios, bracketNames);
    // recalculate est total fees
    const updatedEstTotalFees = this.estTotalFeesCalculate(updatedEstFundFees, my529AdminAssetFees, bracketNames);
    const updatedErrorMessages = { ...errorMessages, hasAnyBracketTotalNot100Error };

    this.setState({
      matrixAllocations: updatedMatrix,
      estFundFees: updatedEstFundFees,
      estTotalFees: updatedEstTotalFees,
      categoriesSubtotals: updatedCategoriesSubtotals,
      bracketTotals: updatedBracketTotals,
      errorMessages: updatedErrorMessages,
    });

    // pass to the parent if it wants it
    onAllocationChange && onAllocationChange(updatedMatrix, updatedErrorMessages);
  };

  onKeyDownAllocationInputHandler = (event, visibleFundId, bracketIndex) => {
    if (event.key === 'Enter') {
      const maxBracketLength = this.state.matrixAllocations[0][0].length; // the same for all funds
      const maxVisibleFundIdLength = this.getVisibleFundIdsLength();
      let cellRefById;

      // Navigate up
      if (event.shiftKey) {
        const upVisibleFundId = visibleFundId - 1;
        // Can't navigate up if you're on the first visible row of the table
        if (upVisibleFundId >= 0) {
          cellRefById = document.getElementById(`input_${upVisibleFundId}_${bracketIndex}`);
          // also due to the sticky headers make sure it scrolls by offset to show
          const offset = this.cumulativeOffset(cellRefById) - (this.subCategoryStickyHeaderOffset + cellRefById.offsetHeight);
          window.scrollTo(0, offset);
        }
        else if (bracketIndex > 0) {
          // go to the top one bracket left
          cellRefById = document.getElementById(`input_${maxVisibleFundIdLength - 1}_${bracketIndex - 1}`);
        }
      }
      // Navigate Down
      else {
        const downVisibleFundId = visibleFundId + 1;
        // Can't navigate down if you're on the last visible row of the table
        if (downVisibleFundId < maxVisibleFundIdLength) {
          cellRefById = document.getElementById(`input_${downVisibleFundId}_${bracketIndex}`);
        }
        else if (bracketIndex < maxBracketLength) {
          // go to the top one bracket left
          cellRefById = document.getElementById(`input_${0}_${bracketIndex + 1}`);
        }
      }

      if (cellRefById) {
        cellRefById.focus();
      }
    }
  };

  onSaveHandler = () => {
    this.setState({ wasSaveClicked: true });
    this.props.onSave();
  }

  /********** RENDERERS **********/
  renderShowSelectedFundsButton = (FundCategories, showSelectedFundsOnly) => {
    return this.wasAnyFundSelected()
      ?
      <span onClick={(e) => this.onSelectedFundsToggleHandler(e, FundCategories)} className='calculator_show_selected_funds_enabled'>
        {showSelectedFundsOnly ? 'Show All Funds' : 'Show Selected Funds'}
      </span>
      :
      <span className='calculator_show_selected_funds_disabled'>Show Selected Funds</span>;
  }

  renderSubtotalValues = (matrixAllocations, categoryIndex) => {
    return this.state.bracketNames.map((bracket, bracketIndex) => {
      return (
        <td key={`totals_${bracketIndex}_${categoryIndex}`}>
          {this.state.categoriesSubtotals[categoryIndex][bracketIndex]}%
        </td>
      );
    });
  };

  renderTotalValues = () =>
    this.state.bracketNames.map((bracket, bracketIndex) => (
      <td key={`category_totals_${bracketIndex}`}>
        {this.state.bracketTotals[bracketIndex]}%
      </td>
    ));

  renderCategories = (
    categories,
    matrixAllocations,
    categoriesToShow,
  ) => {
    const { isViewing, isInternalView, } = this.props;
    const {
      showSelectedFundsOnly, hasFundsValues, selectedFunds,
      categoryStickyHeaderOffset, subCategoryStickyHeaderOffset,
      categoryColors, visibleFundIds, categoriesSubtotals
    } = this.state;

    const rows = [];
    categories && categories.forEach((category, categoryIndex) => {
      const categoryKey = `category_${category.FundCategoryId}_${categoryIndex}`;
      const showCategory = this.isCategoryShowing(categoryIndex, categoriesSubtotals);

      if (showCategory) {

        if (!isInternalView) {
          const categoryTitleRowExpandable = (
            <tr
              key={`label_${categoryKey}`}
              onClick={() => this.onCategoryExpendToggleHandler(categoryIndex)}
              className='onclick hideOnPrint'
            >
              <th colSpan='100%' className='category' style={{ top: `${categoryStickyHeaderOffset}px` }}>
                <div className='category_label_container'>
                  <div>{category.FundCategoryName}</div>
                  {!isViewing &&
                    <div>
                      {categoriesToShow[categoryIndex] ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </div>
                  }
                </div>
              </th>
            </tr>
          );

          const categoryTitleRowSimple = (
            <tr
              key={`label_${categoryKey}`}
              className='hideOnPrint'
            >
              <th colSpan='100%' className='category' style={{ top: `${categoryStickyHeaderOffset}px` }}>
                <div className='category_label_container'>
                  <div>{category.FundCategoryName}</div>
                </div>
              </th>
            </tr>
          );
          isViewing ? rows.push(categoryTitleRowSimple) : rows.push(categoryTitleRowExpandable);
        }

        categoriesToShow[categoryIndex] && rows.push(
          <Category
            onKeyDown={this.onKeyDownAllocationInputHandler}
            visibleFundIds={visibleFundIds}
            isViewing={isViewing}
            isInternalView={isInternalView}
            subCategoryStickyHeaderOffset={subCategoryStickyHeaderOffset}
            categoryColor={categoryColors[categoryIndex]}
            categoryKey={categoryKey}
            key={categoryKey}
            funds={category.Funds}
            categoryIndex={categoryIndex}
            showSelectedFundsOnly={showSelectedFundsOnly}
            hasFundsValues={hasFundsValues}
            selectedFunds={selectedFunds}
            matrixAllocations={matrixAllocations}
            getBracketError={this.getBracketError}
            onBracketValueChangeHandler={this.onBracketValueChangeHandler}
            onBracketBlurHandler={this.onBracketBlurHandler}
            onFundSelectionHandler={this.onFundSelectionHandler}
          />);

        !isInternalView &&
        rows.push(
          <tr className='subtotal hideOnPrint' key={`subtotal_${categoryKey}`}>
            <td className='subtotal_label'>Subtotal for {category.FundCategoryName}</td>
            <td>&nbsp;</td>
            {this.renderSubtotalValues(matrixAllocations, categoryIndex)}
          </tr>
        );
      }

    });
    return rows;
  };

  renderFooterMessage() {
    const { agreementYear, isStatic } = this.state;
    return (
      <div className={`calculator_footer_notes hideOnPrint ${isStatic ? 'is_static_margin' : 'is_agebased_margin'}`}>
        <p>* An investment allocation to this fund may not exceed 25 percent in the account. Therefore, the total underlying fund expense will reflect the weighted allocation to the underlying investment.</p>
        <p>&#8224; The total underlying fund expense reflects a fee waiver pursuant to a Fee Waiver Agreement in effect through February 28, {agreementYear}. The total underlying fund expense may increase if the Fee Waiver Agreement is not extended beyond February 28, {agreementYear}.</p>
        <p>Note: All numbers are rounded to the third decimal place.</p>
      </div>
    );
  }

  componentDidMount() {
    const { loading, schema } = this.props;
    if (!loading && schema && Object.keys(schema).length > 0 && schema.FundCategories.length > 0) {
      this.initializeCalculator(schema);
    }
  }

  componentDidUpdate(prevProps) {
    const { loading, schema } = this.props;
    if (
      (prevProps.loading !== loading || prevProps.schema.FundCategories.length !== schema.FundCategories.length)
      && !loading && this.props.schema && Object.keys(schema).length > 0 && schema.FundCategories.length > 0
    ) {
      this.initializeCalculator(schema);
    }
  }

  render() {
    const {
      showSelectedFundsOnly, matrixAllocations, errorMessages,
      categoriesToShow, bracketErrorIndices, bracketNames,
      bracketTotals, estFundFees, my529AdminAssetFees, templateName,
      estTotalFees, categoriesSubtotals, isStatic, isInitializing, wasSaveClicked,
      categoryColors,
    } = this.state;

    const {
      isViewing, stickyHeaderTopOffset, loading, onSave, hideTemplateName, isInternalView,
      schema: { TemplateName, FundCategories }, isTemplateNameEditing, hidePrintBtn
    } = this.props;

    const customizedTemplateName = isStatic ? 'New Customized Static' : 'New Customized Age-Based';
    const templateNameParsed = TemplateName ? TemplateName : customizedTemplateName;

    return (
      <div className='calculator_container'>
        {(isInitializing || loading || FundCategories.length === 0) ?
          <LoadingOverlay show width='50vw' indicatorHeight='10px' />
          :
          <>
            {!hideTemplateName &&
              <h1>
                {isTemplateNameEditing ?
                  <TextField
                    inputProps={{
                      style: { fontSize: 'x-large' },
                    }}
                    onChange={this.onTemplateNameChangeHandler}
                    label='Template Name'
                    value={templateName}
                    error={wasSaveClicked && Boolean(errorMessages.templateNameNot1To40CharsError)}
                    helperText={wasSaveClicked ? errorMessages.templateNameNot1To40CharsError : ''}
                    autoFocus
                  />
                  :
                  <div>{templateNameParsed}</div>
                }
              </h1>
            }
            <div className='table_container'>
              <table>
                <thead>
                  <tr>
                    <th className='brackets' style={{ top: `${stickyHeaderTopOffset}px` }}>
                      <div className='calculator_header_buttons hideOnPrint'>
                        {!isViewing && this.renderShowSelectedFundsButton(FundCategories, showSelectedFundsOnly)}
                        {!isViewing &&
                          <IconBtnTooltip
                            icon='autorenew'
                            onClick={this.resetCalculatorHandler}
                            title='Reset'
                          />
                        }
                        {!isViewing && onSave &&
                          <IconBtnTooltip
                            icon='save'
                            onClick={this.onSaveHandler}
                            title='Save'
                          />
                        }
                        {!hidePrintBtn &&
                        <IconBtnTooltip
                          icon='print'
                          onClick={window.print}
                        />}
                      </div>
                    </th>
                    <th className='brackets brackets_header_label' style={{ top: `${stickyHeaderTopOffset}px` }}>{!isStatic && 'Ages'}</th>
                    <BracketsHeader
                      isViewing={isViewing}
                      stickyHeaderTopOffset={stickyHeaderTopOffset}
                      bracketNames={bracketNames}
                      onBracketCopyHandler={this.onBracketCopyHandler}
                    />
                  </tr>
                  <tr>
                    <th>Fund Name</th>
                    {!isInternalView ? <th>Underlying Fund Expense</th> : <th />}
                    <th colSpan='100%'>Percentage Allocated</th>
                  </tr>
                </thead>

                <tbody>
                  {this.renderCategories(
                    FundCategories,
                    matrixAllocations,
                    categoriesToShow,
                    bracketErrorIndices,
                  )}
                </tbody>

                <FormTotalsFoot
                  isInternalView={isInternalView}
                  isStatic={isStatic}
                  bracketNames={bracketNames}
                  bracketTotals={bracketTotals}
                  estFundFees={estFundFees}
                  my529AdminAssetFees={my529AdminAssetFees}
                  estTotalFees={estTotalFees}
                  victoryChart={
                    <StackedBarChart
                      categoryColors={categoryColors}
                      matrixAllocations={matrixAllocations}
                      bracketNames={bracketNames}
                      categoriesSubtotals={categoriesSubtotals}
                      isStatic={isStatic}
                    />
                  }
                />
              </table>
            </div>
            {!isInternalView && this.renderFooterMessage()}
          </>
        }
      </div>
    );
  }
}

export default CalculatorForm;