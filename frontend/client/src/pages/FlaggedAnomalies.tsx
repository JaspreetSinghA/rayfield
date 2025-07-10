import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { AlertTriangle, Eye, X } from "lucide-react";

export const FlaggedAnomalies = (): JSX.Element => {
  const anomalies = [
    {
      id: 1,
      title: "Unusual Traffic Pattern",
      severity: "High",
      timestamp: "2025-01-08 21:15:32",
      description: "Detected abnormal network traffic from IP 192.168.1.45",
      status: "Active"
    },
    {
      id: 2,
      title: "System Resource Spike",
      severity: "Medium",
      timestamp: "2025-01-08 20:42:18",
      description: "CPU usage exceeded 95% for extended period",
      status: "Under Review"
    },
    {
      id: 3,
      title: "Authentication Failure",
      severity: "High",
      timestamp: "2025-01-08 19:28:47",
      description: "Multiple failed login attempts from unknown location",
      status: "Resolved"
    },
    {
      id: 4,
      title: "Database Query Anomaly",
      severity: "Low",
      timestamp: "2025-01-08 18:15:22",
      description: "Slow query detected affecting response times",
      status: "Active"
    }
  ];

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
              <AlertTriangle className="mr-3 text-yellow-600" size={32} />
              Flagged Anomalies
            </h1>
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
                    <p className="[font-family:'Montserrat',Helvetica] font-medium text-2xl text-gray-900">2</p>
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
                    <p className="[font-family:'Montserrat',Helvetica] font-medium text-2xl text-gray-900">1</p>
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
                    <p className="[font-family:'Montserrat',Helvetica] font-medium text-2xl text-gray-900">1</p>
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
                    <p className="[font-family:'Montserrat',Helvetica] font-medium text-2xl text-gray-900">4</p>
                    <p className="[font-family:'Montserrat',Helvetica] font-normal text-sm text-gray-600">Total Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Anomalies List */}
          <Card>
            <CardHeader>
              <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl">
                Recent Anomalies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {anomalies.map((anomaly) => (
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
                      <Button
                        variant="outline"
                        size="sm"
                        className="[font-family:'Montserrat',Helvetica] font-medium text-red-600 hover:bg-red-50"
                      >
                        <X size={16} className="mr-2" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};