import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { AlertTriangle, Eye, X, RefreshCw, Download, Filter } from "lucide-react";
import { apiClient } from "@/lib/api";

interface Anomaly {
  id: number;
  title: string;
  severity: string;
  timestamp: string;
  description: string;
  status: string;
}

export const FlaggedAnomalies = (): JSX.Element => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchAnomalies();
  }, []);

  const fetchAnomalies = async () => {
    try {
      setLoading(true);
      const response = await apiClient.anomalies.getAll() as Anomaly[];
      setAnomalies(response);
    } catch (err) {
      console.error('Failed to fetch anomalies:', err);
      // Fallback to mock data if API fails
      setAnomalies([
        {
          id: 1,
          title: "Energy Anomaly - Power Plant Alpha",
          severity: "High",
          timestamp: "2025-01-08 21:15:32",
          description: "Anomalous emission value: 2450.67 at Power Plant Alpha in 2024",
          status: "Active"
        },
        {
          id: 2,
          title: "Energy Anomaly - Energy Station Beta",
          severity: "Medium",
          timestamp: "2025-01-08 20:42:18",
          description: "Anomalous emission value: 1890.23 at Energy Station Beta in 2024",
          status: "Under Review"
        },
        {
          id: 3,
          title: "Energy Anomaly - Industrial Complex Gamma",
          severity: "High",
          timestamp: "2025-01-08 19:28:47",
          description: "Anomalous emission value: 3200.45 at Industrial Complex Gamma in 2024",
          status: "Active"
        },
        {
          id: 4,
          title: "Unusual Traffic Pattern",
          severity: "Low",
          timestamp: "2025-01-08 18:15:22",
          description: "Detected abnormal network traffic from IP 192.168.1.45",
          status: "Active"
        }
      ]);
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

  const filteredAnomalies = anomalies.filter(anomaly => {
    if (filter === "all") return true;
    if (filter === "high") return anomaly.severity === "High";
    if (filter === "active") return anomaly.status === "Active";
    return true;
  });

  const highPriorityCount = anomalies.filter(a => a.severity === "High").length;
  const mediumPriorityCount = anomalies.filter(a => a.severity === "Medium").length;
  const lowPriorityCount = anomalies.filter(a => a.severity === "Low").length;
  const activeCount = anomalies.filter(a => a.status === "Active").length;

  const exportAnomalies = () => {
    const csvContent = [
      "ID,Title,Severity,Status,Description,Timestamp",
      ...filteredAnomalies.map(anomaly => 
        `${anomaly.id},"${anomaly.title}",${anomaly.severity},${anomaly.status},"${anomaly.description}",${anomaly.timestamp}`
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
        <div>
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="[font-family:'Montserrat',Helvetica] font-medium text-3xl text-gray-900 flex items-center">
                <AlertTriangle className="mr-3 text-yellow-600" size={32} />
                Flagged Anomalies
              </h1>
              <div className="flex space-x-2">
                <Button
                  onClick={fetchAnomalies}
                  variant="outline"
                  className="[font-family:'Montserrat',Helvetica] font-medium"
                >
                  <RefreshCw className="mr-2" size={16} />
                  Refresh
                </Button>
                <Button
                  onClick={exportAnomalies}
                  variant="outline"
                  className="[font-family:'Montserrat',Helvetica] font-medium"
                >
                  <Download className="mr-2" size={16} />
                  Export
                </Button>
              </div>
            </div>
            <p className="[font-family:'Montserrat',Helvetica] font-normal text-gray-600">
              Monitor and manage system anomalies that require attention
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-full">
                    <AlertTriangle className="text-red-600" size={20} />
                  </div>
                  <div className="ml-4">
                    <p className="[font-family:'Montserrat',Helvetica] font-medium text-2xl text-gray-900">{highPriorityCount}</p>
                    <p className="[font-family:'Montserrat',Helvetica] font-normal text-sm text-gray-600">High Priority</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <AlertTriangle className="text-yellow-600" size={20} />
                  </div>
                  <div className="ml-4">
                    <p className="[font-family:'Montserrat',Helvetica] font-medium text-2xl text-gray-900">{mediumPriorityCount}</p>
                    <p className="[font-family:'Montserrat',Helvetica] font-normal text-sm text-gray-600">Medium Priority</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-full">
                    <AlertTriangle className="text-green-600" size={20} />
                  </div>
                  <div className="ml-4">
                    <p className="[font-family:'Montserrat',Helvetica] font-medium text-2xl text-gray-900">{lowPriorityCount}</p>
                    <p className="[font-family:'Montserrat',Helvetica] font-normal text-sm text-gray-600">Low Priority</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Eye className="text-blue-600" size={20} />
                  </div>
                  <div className="ml-4">
                    <p className="[font-family:'Montserrat',Helvetica] font-medium text-2xl text-gray-900">{activeCount}</p>
                    <p className="[font-family:'Montserrat',Helvetica] font-normal text-sm text-gray-600">Total Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Controls */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Filter className="text-gray-600" size={20} />
                <span className="[font-family:'Montserrat',Helvetica] font-medium text-gray-900">Filter:</span>
                <div className="flex space-x-2">
                  <Button
                    variant={filter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("all")}
                    className="[font-family:'Montserrat',Helvetica] font-medium"
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === "high" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("high")}
                    className="[font-family:'Montserrat',Helvetica] font-medium"
                  >
                    High Priority
                  </Button>
                  <Button
                    variant={filter === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("active")}
                    className="[font-family:'Montserrat',Helvetica] font-medium"
                  >
                    Active Only
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Anomalies List */}
          <Card>
            <CardHeader>
              <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl">
                Recent Anomalies ({filteredAnomalies.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredAnomalies.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="[font-family:'Montserrat',Helvetica] font-medium text-gray-900 mb-2">
                    No anomalies found
                  </p>
                  <p className="[font-family:'Montserrat',Helvetica] font-normal text-gray-600">
                    {filter === "all" ? "No anomalies have been detected yet." : `No anomalies match the current filter.`}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAnomalies.map((anomaly) => (
                    <div
                      key={anomaly.id}
                      className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="[font-family:'Montserrat',Helvetica] font-medium text-lg text-gray-900">
                            {anomaly.title}
                          </h3>
                          <Badge className={getSeverityColor(anomaly.severity)}>
                            {anomaly.severity}
                          </Badge>
                          <Badge className={getStatusColor(anomaly.status)}>
                            {anomaly.status}
                          </Badge>
                        </div>
                        <p className="[font-family:'Montserrat',Helvetica] font-normal text-sm text-gray-600 mb-1">
                          {anomaly.description}
                        </p>
                        <p className="[font-family:'Montserrat',Helvetica] font-normal text-xs text-gray-500">
                          {anomaly.timestamp}
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
                        {anomaly.status === "Active" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateAnomalyStatus(anomaly.id, "Under Review")}
                            className="[font-family:'Montserrat',Helvetica] font-medium text-yellow-600 hover:bg-yellow-50"
                          >
                            <X size={16} className="mr-2" />
                            Mark Review
                          </Button>
                        )}
                        {anomaly.status === "Under Review" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateAnomalyStatus(anomaly.id, "Resolved")}
                            className="[font-family:'Montserrat',Helvetica] font-medium text-green-600 hover:bg-green-50"
                          >
                            <X size={16} className="mr-2" />
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};