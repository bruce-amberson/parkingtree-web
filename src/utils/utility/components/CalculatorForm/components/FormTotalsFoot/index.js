/**
*
* FormTotalsFoot
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import './FormTotalsFoot.styles.css';

const toFixed3 = (num) => (Math.round(num * 1000) / 1000).toFixed(3);

export class FormTotalsFoot extends React.Component {

  static propTypes = {
    isInternalView: PropTypes.bool.isRequired,
    isStatic: PropTypes.bool.isRequired,
    bracketNames: PropTypes.array.isRequired,
    bracketTotals: PropTypes.array.isRequired,
    estFundFees: PropTypes.array.isRequired,
    my529AdminAssetFees: PropTypes.array.isRequired,
    estTotalFees: PropTypes.array.isRequired,
    victoryChart: PropTypes.node.isRequired,
  };

  ageBracketsHeaderCompose() {
    return this.props.bracketNames.map((bracketName) => <th key={bracketName} className='TemplateTableTotals_ageBrackets'>{bracketName}</th>);
  }

  my529AdminFeeSum() {
    return this.props.bracketNames.map((bracket, idx) => <td key={`my529AdminFeeRow${bracket}`}> {toFixed3(this.props.my529AdminAssetFees[idx])}% </td>);
  }

  totalAllocationsSum() {
    return this.props.bracketTotals.map((bracketTotal, idx) => <td className={bracketTotal !== 100 ? 'TemplateTableTotals_totalsNot100' : null} key={`totalAllocations${this.props.bracketNames[idx]}`} >{bracketTotal}%</td>);
  }

  estimatedFundFeesSum() {
    return this.props.estFundFees.map((bracketFeeTotal, idx) => <td key={`fundExpenseRatioTotalsRow${idx}`}> {toFixed3(bracketFeeTotal)}%</td>);
  }

  plusRowCompose() {
    return this.props.bracketNames.map(bracket => <td key={`plusRow${bracket}`}>+</td>);
  }

  equalRowCompose() {
    return this.props.bracketNames.map(bracketName => <td key={`equalRow_${bracketName}`}>=</td>);
  }

  estTotalFeesSum() {
    return this.props.estTotalFees.map((estBracketFee, idx) => <td key={`estTotalFees${idx}`}> {toFixed3(estBracketFee)}% </td>);
  }

  renderRows = () => {
    const { isStatic, isInternalView, } = this.props;
    const victoryChartRowSpan = isStatic ? 7 : 8;

    const rows = [];
    rows.push(
      <tr key='victoryChart'>
        <th rowSpan={victoryChartRowSpan} className='hideOnPrint' style={{ paddingRight: '0px' }}>
          {!isInternalView ? this.props.victoryChart : null}
        </th>
      </tr>
    );
    !isStatic && rows.push(
      <tr key='ageBracketsRow' className='hideOnPrint'>
        <th key='agesHeader'>Ages:</th>
        {this.ageBracketsHeaderCompose()}
      </tr>
    );
    rows.push(
      <tr key='totalAllocationsRow'>
        <th className='TemplateTableTotals_textAlignment'>Total Allocation:</th>
        <th className='TemplateTableTotals_showOnPrint'>&nbsp;</th>
        {this.totalAllocationsSum()}
      </tr>
    );

    if (!isInternalView) { // don't include additional rows when in internal view
      rows.push(
        <tr key='fundExpenseRatioTotalsRow'>
          <th className='TemplateTableTotals_textAlignment'>Est. Underlying Fund Expense:</th>
          <th className='TemplateTableTotals_showOnPrint'>&nbsp;</th>
          {this.estimatedFundFeesSum()}
        </tr>
      );
      rows.push(
        <tr key='plusRow'>
          <td className='TemplateTableTotals_showOnPrint' colSpan={2} key={isStatic ? 'plusRow_static_print' : 'plusRow_ageBased_print'} />
          <td className='hideOnPrint' key={isStatic ? 'plusRow_static' : 'plusRow_ageBased'} />
          {this.plusRowCompose()}
        </tr>
      );
      rows.push(
        <tr key='my529AdminFeeRow'>
          <th className='TemplateTableTotals_textAlignment'>my529 Admin Asset Fee:</th>
          <th className='TemplateTableTotals_showOnPrint'>&nbsp;</th>
          {this.my529AdminFeeSum()}
        </tr>
      );
      rows.push(
        <tr key='equalRow'>
          <td className='TemplateTableTotals_showOnPrint' colSpan={2} key={isStatic ? 'equalRow_static_print' : 'equalRow_ageBased_print'} />
          <td className='hideOnPrint' key={isStatic ? 'equalRow_static' : 'equalRow_ageBased'} />
          {this.equalRowCompose()}
        </tr>
      );
      rows.push(
        <tr key='estTotalFeesRow'>
          <th className='TemplateTableTotals_textAlignment'>Est. Total Annual Asset-Based Fee:</th>
          <th className='TemplateTableTotals_showOnPrint'>&nbsp;</th>
          {this.estTotalFeesSum()}
        </tr>
      );
    }
    return rows;
  }

  render() {
    return (
      <tfoot className='TemplateTableTotals_templateTableTotals'>
        {
          Object.keys(this.props.bracketNames).length > 0
            ?
            this.renderRows()
            :
            <tr />
        }
      </tfoot>
    );
  }

}

export default FormTotalsFoot;
