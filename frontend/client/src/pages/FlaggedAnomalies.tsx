import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { AlertTriangle, Eye, X, RefreshCw, Download, Filter } from "lucide-react";
import { apiClient } from "@/lib/api";
import { Input } from "@/components/ui/input";

// Add new interface for real anomaly data
interface RealAnomaly {
  id: number;
  facility: string;
  year: number | string;
  emission_value: number;
  severity: string;
  timestamp: string;
  [key: string]: any; // Allow dynamic fields for extra CSV columns
}

export const FlaggedAnomalies = (): JSX.Element => {
  const [anomalies, setAnomalies] = useState<RealAnomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnomaly, setSelectedAnomaly] = useState<RealAnomaly | null>(null);
  // Add back filter state and UI
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [currentCsv, setCurrentCsv] = useState<string | null>(null);
  const anomalyRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Compute counts for summary cards
  const highCount = anomalies.filter(a => a.severity === "High").length;
  const mediumCount = anomalies.filter(a => a.severity === "Medium").length;
  const lowCount = anomalies.filter(a => a.severity === "Low").length;

  useEffect(() => {
    fetchAnomalies();
    // Try to get the last uploaded CSV name from localStorage or API if available
    const lastCsv = localStorage.getItem("last_uploaded_csv");
    if (lastCsv) setCurrentCsv(lastCsv);
  }, []);

  useEffect(() => {
    // Scroll to anomaly if anomaly_id is in URL
    const params = new URLSearchParams(window.location.search);
    const anomalyId = params.get("anomaly_id");
    if (anomalyId && anomalyRefs.current[anomalyId]) {
      anomalyRefs.current[anomalyId]?.scrollIntoView({ behavior: "smooth", block: "center" });
      anomalyRefs.current[anomalyId]?.classList.add("ring-4", "ring-blue-400");
      setTimeout(() => {
        anomalyRefs.current[anomalyId]?.classList.remove("ring-4", "ring-blue-400");
      }, 3000);
    }
  }, [anomalies]);

  // Fetch from improved backend endpoint
  const fetchAnomalies = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use a default submission_id for now (could be dynamic)
      const res = await apiClient.request<any>(
        '/api/submissions/1/results' // TODO: Replace 1 with actual submission_id if needed
      );
      setAnomalies(res.anomalies_data || []);
    } catch (err) {
      setError('Failed to fetch anomalies');
    } finally {
      setLoading(false);
    }
  };

  const updateAnomalyStatus = async (anomalyId: number, newStatus: string) => {
    try {
      await apiClient.anomalies.updateStatus(anomalyId.toString(), newStatus);
      // Update local state
      setAnomalies(prev => prev.map(anomaly => 
        anomaly.id === anomalyId ? { ...anomaly, status: newStatus } : anomaly
      ));
    } catch (err) {
      console.error('Failed to update anomaly status:', err);
      alert('Failed to update status. Please try again.');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-red-100 text-red-800";
      case "Under Review": return "bg-yellow-100 text-yellow-800";
      case "Resolved": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Filtering logic for severity, search, and date
  const filteredAnomalies = anomalies.filter(anomaly => {
    if (filter !== "all" && anomaly.severity !== filter.charAt(0).toUpperCase() + filter.slice(1)) return false;
    if (search && !anomaly.facility?.toLowerCase().includes(search.toLowerCase())) return false;
    if (date && String(anomaly.year) !== date) return false;
    return true;
  });

  const exportAnomalies = () => {
    const csvContent = [
      "ID,Facility,Year,Emission Value,Severity,Detected",
      ...anomalies.map(anomaly => 
        `${anomaly.id},"${anomaly.facility}",${anomaly.year},${anomaly.emission_value},${anomaly.severity},${anomaly.timestamp}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anomalies_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="[font-family:'Montserrat',Helvetica] font-medium text-gray-900">
            Loading anomalies...
          </p>
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
        {currentCsv && (
          <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded">
            <b>Note:</b> You are viewing anomalies for the most recently uploaded file: <span className="font-mono">{currentCsv}</span>. Previous sessions are not shown here.
          </div>
        )}
        <div>
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="p-2 bg-red-100 rounded-full mb-2">
                    <AlertTriangle className="text-red-600" size={20} />
                  </div>
                  <p className="[font-family:'Montserrat',Helvetica] font-medium text-2xl text-gray-900">{highCount}</p>
                  <p className="[font-family:'Montserrat',Helvetica] font-normal text-sm text-gray-600">High</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="p-2 bg-yellow-100 rounded-full mb-2">
                    <AlertTriangle className="text-yellow-600" size={20} />
                  </div>
                  <p className="[font-family:'Montserrat',Helvetica] font-medium text-2xl text-gray-900">{mediumCount}</p>
                  <p className="[font-family:'Montserrat',Helvetica] font-normal text-sm text-gray-600">Medium</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="p-2 bg-green-100 rounded-full mb-2">
                    <AlertTriangle className="text-green-600" size={20} />
                  </div>
                  <p className="[font-family:'Montserrat',Helvetica] font-medium text-2xl text-gray-900">{lowCount}</p>
                  <p className="[font-family:'Montserrat',Helvetica] font-normal text-sm text-gray-600">Low</p>
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6 space-y-2 md:space-y-0">
              <Input
                placeholder="Search by facility name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full md:w-64"
              />
              <Input
                placeholder="Filter by year..."
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full md:w-40"
                type="number"
                min="1900"
                max="2100"
              />
            </div>
            <div className="flex items-center space-x-4 mb-6">
              <span className="[font-family:'Montserrat',Helvetica] font-medium text-gray-900">Filter by Severity:</span>
              <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>All</Button>
              <Button variant={filter === "high" ? "default" : "outline"} size="sm" onClick={() => setFilter("high")}>High</Button>
              <Button variant={filter === "medium" ? "default" : "outline"} size="sm" onClick={() => setFilter("medium")}>Medium</Button>
              <Button variant={filter === "low" ? "default" : "outline"} size="sm" onClick={() => setFilter("low")}>Low</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAnomalies.map((anomaly) => (
                <Card
                  key={anomaly.id}
                  ref={el => { anomalyRefs.current[anomaly.id] = el; }}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-lg">
                        {anomaly.facility}
                      </CardTitle>
                      <Badge className={
                        anomaly.severity === "High" ? "bg-red-100 text-red-800" :
                        anomaly.severity === "Medium" ? "bg-yellow-100 text-yellow-800" :
                        anomaly.severity === "Low" ? "bg-green-100 text-green-800" :
                        "bg-gray-100 text-gray-800"
                      }>{anomaly.severity}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2 text-gray-700">
                      <span className="font-semibold">Emission Value:</span> {anomaly.emission_value?.toFixed(2) ?? "N/A"} units
                    </div>
                    <div className="mb-2 text-gray-700">
                      <span className="font-semibold">Year:</span> {anomaly.year ?? "N/A"}
                    </div>
                    <div className="mb-2 text-gray-700">
                      <span className="font-semibold">Detected:</span> {anomaly.timestamp ? new Date(anomaly.timestamp).toLocaleString() : "N/A"}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => setSelectedAnomaly(anomaly)}
                    >
                      <Eye className="mr-2" size={16} />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        {/* Details Modal/Section */}
        {selectedAnomaly && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={() => setSelectedAnomaly(null)}
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold mb-4">Anomaly Details</h2>
              <div className="mb-2"><b>Facility:</b> {selectedAnomaly.facility ?? "N/A"}</div>
              <div className="mb-2"><b>Year:</b> {selectedAnomaly.year ?? "N/A"}</div>
              <div className="mb-2"><b>Actual Emission Value:</b> {selectedAnomaly.emission_value?.toFixed(2) ?? "N/A"} units</div>
              <div className="mb-2"><b>Predicted CO2:</b> {selectedAnomaly["Predicted CO2"]?.toFixed(2) ?? "N/A"}</div>
              <div className="mb-2"><b>Deviation (%):</b> {selectedAnomaly["Deviation (%)"]?.toFixed(2) ?? "N/A"}</div>
              <div className="mb-2"><b>7-day Rolling Avg:</b> {selectedAnomaly.rolling_7d?.toFixed(2) ?? "N/A"}</div>
              <div className="mb-2"><b>Percent Change:</b> {selectedAnomaly.pct_change?.toFixed(2) ?? "N/A"}</div>
              <div className="mb-2"><b>Flagged by ±15% Rule:</b> {selectedAnomaly.Flagged ?? "N/A"}</div>
              <div className="mb-2"><b>Severity:</b> {selectedAnomaly.severity ?? "N/A"}</div>
              <div className="mb-2"><b>Detected:</b> {selectedAnomaly.timestamp ? new Date(selectedAnomaly.timestamp).toLocaleString() : "N/A"}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};