/**
*
* StackedBarChart
*
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { VictoryBar, VictoryChart, VictoryStack, VictoryAxis, VictoryTooltip } from 'victory';
import { theme, baseProps } from './victory_theme';

const IEFriendlyVictoryChart = (props) => (
  <div
    style={{
      position: 'relative',
      padding: 0,
      paddingBottom: `${100 * (baseProps.height / baseProps.width)}%`
    }}
  >
    <VictoryChart
      {...props}
      style={{
        // eslint-disable-next-line react/prop-types
        ...props.style,
        parent: {
          position: 'absolute',
          height: '100%',
          width: '100%',
          left: 0,
          top: 0,
          bottom: 0,
          right: 0
        }
      }}
    />
  </div>
);

export class StackedBarChart extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    matrixAllocations: PropTypes.array.isRequired,
    bracketNames: PropTypes.array.isRequired,
    isStatic: PropTypes.bool.isRequired,
    categoriesSubtotals: PropTypes.array.isRequired,
    categoryColors: PropTypes.array.isRequired,
  };

  render() {
    let total = 0;
    let label = '';
    let chartData = [];
    const chartDataCategories = [];
    const chartBars = [];
    const chartTickVals = [];
    const chartFormat = [];
    let tickVal = 1;
    const categoryColors = [];
    let xAxis;
    const { matrixAllocations, categoriesSubtotals, bracketNames, isStatic } = this.props;

    // Generates data set for chart
    matrixAllocations.forEach((category, categoryIndex) => {
      bracketNames.forEach((bracketName, bracketIndex) => {
        total = categoriesSubtotals[categoryIndex][bracketIndex];
        label = `${total}%`;
        chartData.push({
          bracketName,
          label,
          total,
        });
      });
      chartDataCategories.push(chartData);
      chartData = [];
      // TODO: colors from api
      categoryColors.push(this.props.categoryColors[categoryIndex]);
    });
    categoryColors.reverse();

    // Generates tick values for chart
    bracketNames.forEach(bracketName => {
      chartTickVals.push(tickVal);
      chartFormat.push(bracketName);
      tickVal++;
    });

    // Composes chart bars
    chartDataCategories.reverse().forEach((category, index) => {
      chartBars.push(
        <VictoryBar
          labelComponent={
            <VictoryTooltip
              pointerLength={5}
              cornerRadius={2}
              flyoutStyle={{ fill: '#3f3f3f' }}
              style={{ fill: '#fff', fontSize: '16px' }}
            />
          }
          data={category}
          x='bracketName'
          y='total'
          key={index}
        />
      );
    });

    if (isStatic) {
      xAxis = (
        <VictoryAxis
          tickValues={[0, 1, 2]}
          tickFormat={chartFormat}
        />
      );
    }
    else {
      xAxis = (
        <VictoryAxis
          tickValues={chartTickVals}
          tickFormat={chartFormat}
          label='Ages'
        />
      );
    }

    return (
      <IEFriendlyVictoryChart
        theme={theme(categoryColors, this.props.isStatic)}
        domainPadding={12}
      >
        <VictoryAxis
          dependentAxis
          tickValues={[25, 50, 75, 100]}
          tickFormat={(tickVal) => (`${tickVal}%`)}
        />
        {xAxis}
        <VictoryStack>
          {chartBars}
        </VictoryStack>
      </IEFriendlyVictoryChart>
    );
  }
}

export default StackedBarChart;
