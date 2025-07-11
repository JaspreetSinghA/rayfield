import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface ChartData {
  labels: (string | number)[];
  emissions: number[];
  anomaly_indices: number[];
}

interface ChartProps {
  data: ChartData;
  title?: string;
  height?: number;
  onAnomalyClick?: (anomalyIndex: number) => void;
  anomalies?: Array<{
    id: number;
    facility: string;
    year: string | number;
    emission_value: number;
    severity: string;
    "Deviation (%)"?: number;
  }>;
}

export const EnergyChart: React.FC<ChartProps> = ({ 
  data, 
  title = "Energy Emissions Over Time",
  height = 300,
  onAnomalyClick,
  anomalies = []
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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
            {data.emissions.map((emission, index) => {
              const isAnomaly = data.anomaly_indices.includes(index);
              const isHovered = hoveredIndex === index;
              const anomaly = anomalies.find(a => String(a.year) === String(data.labels[index]));
              return (
                <g key={index}>
                  <circle
                    cx={getXPosition(index)}
                    cy={getYPosition(emission)}
                    r={isAnomaly ? (isHovered ? 7 : 5) : (isHovered ? 5 : 3)}
                    fill={isAnomaly ? "#ef4444" : "#3b82f6"}
                    stroke="white"
                    strokeWidth="1"
                    style={{ cursor: isAnomaly && onAnomalyClick ? 'pointer' : 'default', transition: 'r 0.15s' }}
                    onClick={isAnomaly && onAnomalyClick ? () => onAnomalyClick(index) : undefined}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                  {/* Enhanced Tooltip */}
                  {isHovered && (
                    <foreignObject
                      x={getXPosition(index) - 80}
                      y={getYPosition(emission) - 80}
                      width="160"
                      height="60"
                    >
                      <div style={{ pointerEvents: 'none' }} className="bg-white border border-gray-300 rounded shadow-lg px-3 py-2 text-xs text-gray-800">
                        <div className="font-semibold mb-1">
                          {anomaly ? anomaly.facility : `Year ${String(data.labels[index])}`}
                        </div>
                        <div><b>Year:</b> {String(data.labels[index])}</div>
                        <div><b>Emission:</b> {emission.toLocaleString(undefined, { maximumFractionDigits: 2 })} tons</div>
                        {isAnomaly && anomaly && (
                          <>
                            <div><b>Severity:</b> <span className={`font-semibold ${
                              anomaly.severity === 'High' ? 'text-red-600' : 
                              anomaly.severity === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                            }`}>{anomaly.severity}</span></div>
                            {anomaly["Deviation (%)"] && (
                              <div><b>Deviation:</b> {anomaly["Deviation (%)"].toFixed(1)}%</div>
                            )}
                          </>
                        )}
                        {isAnomaly && <div className="text-red-600 font-semibold mt-1">⚠️ Anomaly Detected</div>}
                      </div>
                    </foreignObject>
                  )}
                </g>
              );
            })}

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
                fontWeight="bold"
              >
                {String(data.labels[index])}
              </text>
            ))}

            {/* Y-axis label */}
            <text
              x="-30"
              y={height / 2}
              fontSize="14"
              fill="#6b7280"
              textAnchor="middle"
              transform={`rotate(-90 -30,${height / 2})`}
              fontWeight="bold"
            >
              CO₂ Emissions (metric tons)
            </text>

            {/* X-axis title */}
            <text
              x={400}
              y={height - 2}
              fontSize="14"
              fill="#6b7280"
              textAnchor="middle"
              fontWeight="bold"
            >
              Year
            </text>

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
