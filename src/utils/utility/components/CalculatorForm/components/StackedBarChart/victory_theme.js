import { assign } from 'lodash';

export let baseProps = {};

export function theme(colors) {
  const charcoal = 'rgba(0, 0, 0, 0.87)';
  
  // Typography
  const sansSerif = 'MyriadPro-Regular, "Myriad Pro Regular", MyriadPro, "Myriad Pro", "PT Sans", Arial, sans-serif';
  const letterSpacing = 'normal';
  const fontSize = 14;
  
  // Layout
  baseProps = {
    width: 500,
    height: 250,
    padding: 50,
    colorScale: colors
  };
  
 
  // Labels
  const baseLabelStyles = {
    fontFamily: sansSerif,
    fontSize,
    letterSpacing,
    padding: 8,
    fill: charcoal,
    stroke: 'transparent',
    textAlign: 'center',
  };
  
  const centeredLabelStyles = assign({ textAnchor: 'middle' }, baseLabelStyles);
  
  // Strokes
  const strokeLinecap = 'square';
  const strokeLinejoin = 'square';

  return ({
    area: assign({
      style: {
        data: {
          fill: charcoal,
        },
        labels: centeredLabelStyles
      }
    }, baseProps),
    axis: assign({
      style: {
        axis: {
          fill: 'transparent',
          stroke: charcoal,
          strokeWidth: 1,
          strokeLinecap,
          strokeLinejoin
        },
        axisLabel: assign({}, centeredLabelStyles, {
          padding: 25
        }),
        grid: {
          fill: 'transparent',
          stroke: 'transparent'
        },
        ticks: {
          fill: 'transparent',
          size: 1,
          stroke: 'transparent'
        },
        tickLabels: baseLabelStyles
      }
    }, baseProps),
    bar: assign({
      style: {
        data: {
          fill: charcoal,
          padding: 1,
          stroke: 'transparent',
          strokeWidth: 0,
          width: 20
        },
        labels: baseLabelStyles
      }
    }, baseProps),
    candlestick: assign({
      style: {
        data: {
          stroke: charcoal,
          strokeWidth: 1
        },
        labels: centeredLabelStyles
      },
      candleColors: {
        positive: '#ffffff',
        negative: charcoal
      }
    }, baseProps),
    chart: baseProps,
    errorbar: assign({
      style: {
        data: {
          fill: 'transparent',
          stroke: charcoal,
          strokeWidth: 2
        },
        labels: centeredLabelStyles
      }
    }, baseProps),
    group: assign({
      colorScale: colors
    }, baseProps),
    line: assign({
      style: {
        data: {
          fill: 'transparent',
          stroke: charcoal,
          strokeWidth: 2
        },
        labels: assign({}, baseLabelStyles, {
          textAnchor: 'start'
        })
      }
    }, baseProps),
    pie: {
      style: {
        data: {
          padding: 10,
          stroke: 'transparent',
          strokeWidth: 1
        },
        labels: assign({}, baseLabelStyles, {
          padding: 20
        })
      },
      colorScale: colors,
      width: 200,
      height: 200,
      padding: 50
    },
    scatter: assign({
      style: {
        data: {
          fill: charcoal,
          stroke: 'transparent',
          strokeWidth: 0
        },
        labels: centeredLabelStyles
      }
    }, baseProps),
    stack: assign({
      colorScale: colors
    }, baseProps),
    tooltip: assign({
      style: {
        data: {
          fill: 'transparent',
          stroke: 'transparent',
          strokeWidth: 0
        },
        labels: centeredLabelStyles,
        flyout: {
          stroke: '#fff',
          strokeWidth: 1,
          fill: '#ff0000'
        }
      },
      flyoutProps: {
        cornerRadius: 10,
        pointerLength: 0
      }
    }, baseProps),
    voronoi: assign({
      style: {
        data: {
          fill: 'transparent',
          stroke: 'transparent',
          strokeWidth: 0
        },
        labels: centeredLabelStyles
      }
    }, baseProps)
  });
}

