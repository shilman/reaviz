import React, { PureComponent } from 'react';
import { formatValue } from '../../../common/utils/formatting';
import { PosedArcLabelGroup } from './PosedArcLabelGroup';

export interface PieArcLabelProps {
  data: any;
  innerArc: any;
  show: boolean;
  outerArc: any;
  format?: (v) => any;
  fontFill: string;
  fontSize: number;
  fontFamily: string;
  lineStroke: string;
  padding: string;
  position: [number, number];
}

const getTextAnchor = ({ startAngle, endAngle }) =>
  ((startAngle + (endAngle - startAngle) / 2) < Math.PI ? 'start' : 'end');

export class PieArcLabel extends PureComponent<PieArcLabelProps> {
  static defaultProps: Partial<PieArcLabelProps> = {
    show: false,
    format: undefined,
    lineStroke: 'rgba(127,127,127,0.5)',
    fontFill: '#8F979F',
    fontSize: 11,
    fontFamily: 'sans-serif',
    padding: '.35em'
  };

  render() {
    const {
      innerArc,
      data,
      lineStroke,
      padding,
      fontSize,
      fontFill,
      format,
      fontFamily,
      position
    } = this.props;

    const text = format ? format(data.data) : formatValue(data.data.key);
    const textAnchor = getTextAnchor(data);
    const [posX, posY] = position;

    const innerLinePos = innerArc.centroid(data);
    let scale = posY / innerLinePos[1];
    if (posY === 0 || innerLinePos[1] === 0) {
      scale = 1;
    }

    const outerPos = [
      scale * innerLinePos[0],
      scale * innerLinePos[1]
    ];

    return (
      <PosedArcLabelGroup>
        <title>{text}</title>
        <text
          dy={padding}
          fill={fontFill}
          fontSize={fontSize}
          fontFamily={fontFamily}
          textAnchor={textAnchor}
          style={{
            shapeRendering: 'crispEdges',
            transform: `translate3d(${posX}px,${posY}px, 0)`
          }}
        >
          {text}
        </text>
        <polyline
          fill="none"
          stroke={lineStroke}
          points={`${innerLinePos},${outerPos},${posX} ${posY}`}
        />
      </PosedArcLabelGroup>
    );
  }
}