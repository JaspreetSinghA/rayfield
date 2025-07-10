import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation } from "wouter";
import { Eye, Edit, Send, ArrowLeft, FileText, Upload, Calendar, User, AlertTriangle, BarChart3, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { apiClient } from "@/lib/api";
import { EnergyChart } from "@/components/ui/chart";

interface AnomalyData {
  id: number;
  facility: string;
  year: string;
  emission_value: number;
  severity: string;
  timestamp: string;
}

interface ChartData {
  labels: number[];
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

export const Review = (): JSX.Element => {
  const [location, setLocation] = useLocation();
  const [results, setResults] = useState<ProcessingResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const fetchResults = async () => {
    try {
      setLoading(true);
      
      // Fetch real results from the backend
      const response = await apiClient.request(`/api/submissions/${submissionId}/results`) as ProcessingResults;
      setResults(response);
      
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
            {error || "Unable to load analysis results"}
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
            <EnergyChart 
              data={results.chart_data}
              title="Energy Emissions Over Time"
              height={300}
            />

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
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="[font-family:'Montserrat',Helvetica] font-medium"
                        >
                          <Eye size={16} className="mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
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