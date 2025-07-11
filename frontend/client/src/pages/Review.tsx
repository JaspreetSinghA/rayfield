import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation } from "wouter";
import { Eye, Edit, Send, ArrowLeft, FileText, Upload, Calendar, User, AlertTriangle, BarChart3, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { apiClient } from "@/lib/api";
import { EnergyChart } from "@/components/ui/chart";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

interface AnomalyData {
  id: number;
  facility: string;
  year: string;
  emission_value: number;
  severity: string;
  timestamp: string;
  explanation?: string;
}

interface ChartData {
  labels: (string | number)[];
  emissions: number[];
  anomaly_indices: number[];
}

interface ProcessingResults {
  submission_id: string;
  anomalies_found: number;
  total_records: number;
  processing_time: number;
  anomalies_data: AnomalyData[];
  summary: string;
  chart_data: ChartData;
}

interface Anomaly {
  facility: string;
  year: number | string;
  emission_value: number;
  severity: string;
  [key: string]: any;
}

// Add new types for thresholds and feedback
interface Thresholds {
  anomaly: string | number;
  flagged: string | number;
}

interface AnomalyFeedback {
  status: string; // e.g., 'false_positive', 'resolved', etc.
  notes?: string;
}

// Extend AnomalyData to include explanation
interface AnomalyData {
  id: number;
  facility: string;
  year: string;
  emission_value: number;
  severity: string;
  timestamp: string;
  explanation?: string;
}

export const Review = (): JSX.Element => {
  const [location, setLocation] = useLocation();
  const [results, setResults] = useState<ProcessingResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [hoveredAnomaly, setHoveredAnomaly] = useState<Anomaly | null>(null);
  const [thresholds, setThresholds] = useState<Thresholds>({ anomaly: "auto", flagged: 15 });
  const [metrics, setMetrics] = useState<{ r2?: number; rmse?: number }>({});
  const [anomalyWarning, setAnomalyWarning] = useState<string>("");
  const [feedbacks, setFeedbacks] = useState<Record<number, AnomalyFeedback>>({});

  // Extract submission_id from URL query params
  console.log('Current location:', location);
  console.log('Window location search:', window.location.search);
  const urlParams = new URLSearchParams(window.location.search);
  const submissionId = urlParams.get('submission_id');
  console.log('Extracted submission ID:', submissionId);

  useEffect(() => {
    console.log('useEffect triggered with submissionId:', submissionId);
    if (submissionId) {
      fetchResults();
    } else {
      setLoading(false);
      setError("No submission ID provided");
    }
  }, [submissionId]);

  // Fetch thresholds for this submission
  useEffect(() => {
    if (submissionId) {
      apiClient.request(`/api/thresholds/${submissionId}`)
        .then((res) => setThresholds(res as Thresholds))
        .catch(() => {});
    }
  }, [submissionId]);

  // Fetch results and metrics
  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await apiClient.request(`/api/submissions/${submissionId}/results`) as ProcessingResults & { metrics?: { r2: number, rmse: number }, anomaly_warning?: string };
      setResults(response);
      setChartData(response.chart_data);
      setAnomalies(response.anomalies_data);
      if (response.metrics) setMetrics(response.metrics);
      if (response.anomaly_warning) setAnomalyWarning(response.anomaly_warning);
    } catch (err) {
      console.error('Failed to fetch results:', err);
      
      // Fallback to mock data if API fails
      const mockResults: ProcessingResults = {
        submission_id: submissionId || "123",
        anomalies_found: 1,
        total_records: 10,
        processing_time: 0.05,
        anomalies_data: [
          {
            id: 6,
            facility: "Coal Plant Eta",
            year: "2024",
            emission_value: 4500.3,
            severity: "High",
            timestamp: "2025-01-08T21:30:00Z"
          }
        ],
        summary: "Analysis completed for 10 records. Found 1 anomalies (10.0% of data). High severity anomalies detected at Coal Plant Eta.",
        chart_data: {
          labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          emissions: [1500.5, 1200.3, 3200.7, 800.2, 600.1, 2800.9, 4500.3, 1800.6, 900.4, 700.8],
          anomaly_indices: [6]
        }
      };
      
      setResults(mockResults);
      setChartData(mockResults.chart_data);
      setAnomalies(mockResults.anomalies_data);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleExportAlerts = async () => {
    if (!results) return;
    
    try {
      // Create CSV content
      const csvContent = [
        "Facility,Year,Emission Value,Severity,Timestamp",
        ...results.anomalies_data.map(anomaly => 
          `${anomaly.facility},${anomaly.year},${anomaly.emission_value},${anomaly.severity},${anomaly.timestamp}`
        )
      ].join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `energy_anomalies_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  // Handler for anomaly point click
  const handleAnomalyClick = (anomalyIndex: number) => {
    // Find the anomaly by index in chartData
    if (!chartData) return;
    const year = chartData.labels[anomalyIndex];
    const anomaly = anomalies.find(a => a.year === year);
    if (anomaly) {
      setLocation(`/flagged-anomalies?anomaly_id=${anomaly.id}`);
    }
  };

  // Handle threshold changes
  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setThresholds(prev => ({ ...prev, [name]: value }));
  };
  const saveThresholds = async () => {
    await apiClient.request(`/api/thresholds/${submissionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(thresholds)
    });
    fetchResults(); // re-fetch with new thresholds
  };

  // Handle feedback
  const submitFeedback = async (anomalyId: number, status: string, notes?: string) => {
    await apiClient.request(`/api/anomaly-feedback/${submissionId}/${anomalyId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes })
    });
    setFeedbacks(prev => ({ ...prev, [anomalyId]: { status, notes } }));
  };

  // Fetch feedbacks for all anomalies
  useEffect(() => {
    if (results?.anomalies_data) {
      results.anomalies_data.forEach((anomaly: AnomalyData) => {
        apiClient.request(`/api/anomaly-feedback/${submissionId}/${anomaly.id}`)
          .then((fb) => setFeedbacks(prev => ({ ...prev, [anomaly.id]: fb as AnomalyFeedback })))
          .catch(() => {});
      });
    }
  }, [results?.anomalies_data, submissionId]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="[font-family:'Montserrat',Helvetica] font-medium text-gray-900">
            Loading analysis results...
          </p>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 text-red-600" size={48} />
          <p className="[font-family:'Montserrat',Helvetica] font-medium text-gray-900 mb-2">
            Error Loading Results
          </p>
          <p className="[font-family:'Montserrat',Helvetica] font-normal text-gray-600">
            {error || (results === null ? "Unable to load analysis results" : "")}
          </p>
          <Link href="/dashboard">
            <Button className="mt-4">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="w-full px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                className="w-8 h-8 mr-3"
                alt="Logo"
                src="/figmaAssets/image-4.svg"
              />
              <span className="[font-family:'Montserrat',Helvetica] font-medium text-black text-xl">
                Rayfield Systems
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" className="[font-family:'Montserrat',Helvetica] font-medium">
                  Back to Dashboard
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="[font-family:'Montserrat',Helvetica] font-medium">
                  Sign Out
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8 w-full">
        {/* Threshold configuration UI */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Threshold Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div>
                <label className="block font-medium mb-1">Anomaly Threshold (contamination):</label>
                <input
                  type="text"
                  name="anomaly"
                  value={thresholds.anomaly}
                  onChange={handleThresholdChange}
                  className="border rounded px-2 py-1 w-32"
                  placeholder="auto"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Flagged Threshold (% deviation):</label>
                <input
                  type="text"
                  name="flagged"
                  value={thresholds.flagged}
                  onChange={handleThresholdChange}
                  className="border rounded px-2 py-1 w-32"
                  placeholder="15"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={saveThresholds} className="ml-2">Save</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Show backend warning if present */}
        {anomalyWarning && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-400 text-red-800 rounded">
            <b>Warning:</b> {anomalyWarning}
          </div>
        )}

        {/* Regression metrics */}
        {metrics.r2 !== undefined && metrics.rmse !== undefined && (
          <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded">
            <b>Regression Model Metrics:</b> R² = {metrics.r2.toFixed(3)}, RMSE = {metrics.rmse.toFixed(2)}
          </div>
        )}

        <div>
          <div className="mb-8">
            <h1 className="[font-family:'Montserrat',Helvetica] font-medium text-3xl text-gray-900 mb-2 flex items-center">
              <BarChart3 className="mr-3 text-blue-600" size={32} />
              Energy Data Analysis Results
            </h1>
            <p className="[font-family:'Montserrat',Helvetica] font-normal text-gray-600">
              Review the analysis results and detected anomalies
            </p>
          </div>

          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <BarChart3 className="text-blue-600" size={20} />
                    </div>
                    <div className="ml-4">
                      <p className="[font-family:'Montserrat',Helvetica] font-medium text-2xl text-gray-900">
                        {results.total_records.toLocaleString()}
                      </p>
                      <p className="[font-family:'Montserrat',Helvetica] font-normal text-sm text-gray-600">
                        Total Records
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-full">
                      <AlertTriangle className="text-red-600" size={20} />
                    </div>
                    <div className="ml-4">
                      <p className="[font-family:'Montserrat',Helvetica] font-medium text-2xl text-gray-900">
                        {results.anomalies_found}
                      </p>
                      <p className="[font-family:'Montserrat',Helvetica] font-normal text-sm text-gray-600">
                        Anomalies Found
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-full">
                      <CheckCircle className="text-green-600" size={20} />
                    </div>
                    <div className="ml-4">
                      <p className="[font-family:'Montserrat',Helvetica] font-medium text-2xl text-gray-900">
                        {((results.total_records - results.anomalies_found) / results.total_records * 100).toFixed(1)}%
                      </p>
                      <p className="[font-family:'Montserrat',Helvetica] font-normal text-sm text-gray-600">
                        Normal Data
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Clock className="text-purple-600" size={20} />
                    </div>
                    <div className="ml-4">
                      <p className="[font-family:'Montserrat',Helvetica] font-medium text-2xl text-gray-900">
                        {results.processing_time.toFixed(2)}s
                      </p>
                      <p className="[font-family:'Montserrat',Helvetica] font-normal text-sm text-gray-600">
                        Processing Time
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analysis Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl">
                  Analysis Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="[font-family:'Montserrat',Helvetica] font-normal text-gray-900">
                  {results.summary}
                </p>
              </CardContent>
            </Card>

            {/* Energy Emissions Chart */}
            <Card>
              <CardContent>
                {chartData && (
                  <EnergyChart
                    data={chartData}
                    onAnomalyClick={handleAnomalyClick}
                    title="Energy Emissions Over Time"
                    height={400}
                    anomalies={results.anomalies_data}
                  />
                )}
              </CardContent>
            </Card>

            {/* Detected Anomalies */}
            <Card>
              <CardHeader>
                <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl">
                  Detected Anomalies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.anomalies_data.map((anomaly) => (
                    <div
                      key={anomaly.id}
                      className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="[font-family:'Montserrat',Helvetica] font-medium text-lg text-gray-900">
                            {anomaly.facility}
                          </h3>
                          <Badge className={getSeverityColor(anomaly.severity)}>
                            {anomaly.severity}
                          </Badge>
                        </div>
                        <p className="[font-family:'Montserrat',Helvetica] font-normal text-sm text-gray-600 mb-1">
                          Emission Value: {anomaly.emission_value.toFixed(2)} units
                        </p>
                        <p className="[font-family:'Montserrat',Helvetica] font-normal text-xs text-gray-500">
                          Year: {anomaly.year} • Detected: {new Date(anomaly.timestamp).toLocaleString()}
                        </p>
                        {/* Anomaly explanation */}
                        {anomaly.explanation && (
                          <div className="mt-1 text-sm text-blue-700"><b>Explanation:</b> {anomaly.explanation}</div>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        {/* Feedback UI */}
                        <select
                          value={feedbacks[anomaly.id]?.status || ''}
                          onChange={e => submitFeedback(anomaly.id, e.target.value)}
                          className="border rounded px-2 py-1 mb-1"
                        >
                          <option value="">Mark as...</option>
                          <option value="false_positive">False Positive</option>
                          <option value="resolved">Resolved</option>
                        </select>
                        {/* Optionally, add a notes field for feedback */}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Modal for anomaly details */}
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                  <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto mx-auto">
                    <DialogHeader>
                      <DialogTitle> Anomaly Details </DialogTitle>
                    </DialogHeader>
                    {selectedAnomaly && (
                      <div className="space-y-2">
                        <div><b>Facility:</b> {selectedAnomaly.facility}</div>
                        <div><b>Year:</b> {selectedAnomaly.year}</div>
                        <div><b>Actual Emissions:</b> {selectedAnomaly.emission_value}</div>
                        <div><b>Severity:</b> {selectedAnomaly.severity}</div>
                        <div><b>Timestamp:</b> {new Date(selectedAnomaly.timestamp).toLocaleString()}</div>
                        {Object.entries(selectedAnomaly).map(([k, v]) => (
                          ["id", "facility", "year", "emission_value", "severity", "timestamp"].includes(k) ? null : (
                            <div key={k}><b>{k.replace(/_/g, ' ')}:</b> {String(v)}</div>
                          )
                        ))}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <div className="flex space-x-4">
                <Link href="/upload-submission">
                  <Button
                    variant="outline"
                    className="[font-family:'Montserrat',Helvetica] font-medium"
                  >
                    <ArrowLeft className="mr-2" size={16} />
                    Upload New Data
                  </Button>
                </Link>
              </div>
              <div className="flex space-x-4">
                <Button
                  onClick={handleExportAlerts}
                  variant="outline"
                  className="[font-family:'Montserrat',Helvetica] font-medium"
                >
                  <FileText className="mr-2" size={16} />
                  Export Alerts
                </Button>
                <Link href="/flagged-anomalies">
                  <Button className="bg-black hover:bg-black/80 [font-family:'Montserrat',Helvetica] font-medium">
                    <AlertTriangle className="mr-2" size={16} />
                    View All Anomalies
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};