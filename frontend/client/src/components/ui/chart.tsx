import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface ChartData {
  labels: number[];
  emissions: number[];
  anomaly_indices: number[];
}

interface ChartProps {
  data: ChartData;
  title?: string;
  height?: number;
}

export const EnergyChart: React.FC<ChartProps> = ({ 
  data, 
  title = "Energy Emissions Over Time",
  height = 300 
}) => {
  if (!data || !data.emissions || !Array.isArray(data.emissions) || data.emissions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-500 text-center py-8">No emissions data available for this submission.</div>
        </CardContent>
      </Card>
    );
  }
  const maxEmission = Math.max(...data.emissions);
  const minEmission = Math.min(...data.emissions);
  const range = maxEmission - minEmission;

  const getYPosition = (value: number) => {
    return ((value - minEmission) / range) * (height - 60) + 30;
  };

  const getXPosition = (index: number) => {
    return (index / (data.labels.length - 1)) * (800 - 60) + 30;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative" style={{ height: `${height}px`, width: '100%', overflow: 'hidden' }}>
          <svg width="100%" height={height} className="border border-gray-200 rounded-lg">
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <g key={i}>
                <line
                  x1="30"
                  y1={30 + ratio * (height - 60)}
                  x2="770"
                  y2={30 + ratio * (height - 60)}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x="10"
                  y={30 + ratio * (height - 60) + 4}
                  fontSize="12"
                  fill="#6b7280"
                  textAnchor="end"
                >
                  {Math.round(minEmission + (1 - ratio) * range)}
                </text>
              </g>
            ))}

            {/* Data line */}
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              points={data.emissions.map((emission, index) => 
                `${getXPosition(index)},${getYPosition(emission)}`
              ).join(' ')}
            />

            {/* Data points */}
            {data.emissions.map((emission, index) => (
              <circle
                key={index}
                cx={getXPosition(index)}
                cy={getYPosition(emission)}
                r="3"
                fill={data.anomaly_indices.includes(index) ? "#ef4444" : "#3b82f6"}
                stroke="white"
                strokeWidth="1"
              />
            ))}

            {/* Anomaly indicators */}
            {data.anomaly_indices.map((index) => (
              <circle
                key={`anomaly-${index}`}
                cx={getXPosition(index)}
                cy={getYPosition(data.emissions[index])}
                r="6"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            ))}

            {/* X-axis labels */}
            {[0, Math.floor(data.labels.length / 4), Math.floor(data.labels.length / 2), Math.floor(3 * data.labels.length / 4), data.labels.length - 1].map((index) => (
              <text
                key={index}
                x={getXPosition(index)}
                y={height - 10}
                fontSize="12"
                fill="#6b7280"
                textAnchor="middle"
              >
                {data.labels[index]}
              </text>
            ))}

            {/* Legend */}
            <g transform={`translate(30, ${height - 50})`}>
              <line x1="0" y1="0" x2="20" y2="0" stroke="#3b82f6" strokeWidth="2" />
              <text x="30" y="4" fontSize="12" fill="#6b7280">Normal Data</text>
              <circle cx="120" cy="0" r="3" fill="#ef4444" />
              <text x="130" y="4" fontSize="12" fill="#6b7280">Anomalies</text>
            </g>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};
