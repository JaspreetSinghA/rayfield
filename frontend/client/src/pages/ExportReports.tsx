import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Download, FileText, Calendar, Filter, RefreshCw } from "lucide-react";

export const ExportReports = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState("system");

  const systemReports = [
    { id: 1, name: "System Performance Report", type: "Performance", date: "2025-01-08", size: "2.4 MB", status: "Ready" },
    { id: 2, name: "Security Audit Report", type: "Security", date: "2025-01-07", size: "1.8 MB", status: "Ready" },
    { id: 3, name: "User Activity Report", type: "Activity", date: "2025-01-06", size: "3.2 MB", status: "Processing" },
  ];

  const analyticsReports = [
    { id: 4, name: "Monthly Analytics Summary", type: "Analytics", date: "2025-01-08", size: "1.6 MB", status: "Ready" },
    { id: 5, name: "Traffic Analysis Report", type: "Traffic", date: "2025-01-07", size: "2.1 MB", status: "Ready" },
    { id: 6, name: "User Behavior Analysis", type: "Behavior", date: "2025-01-06", size: "2.8 MB", status: "Failed" },
  ];

  const complianceReports = [
    { id: 7, name: "GDPR Compliance Report", type: "GDPR", date: "2025-01-08", size: "1.2 MB", status: "Ready" },
    { id: 8, name: "SOX Compliance Report", type: "SOX", date: "2025-01-07", size: "1.9 MB", status: "Ready" },
    { id: 9, name: "ISO 27001 Audit Report", type: "ISO", date: "2025-01-06", size: "2.5 MB", status: "Ready" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ready": return "bg-green-100 text-green-800";
      case "Processing": return "bg-yellow-100 text-yellow-800";
      case "Failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderReportTable = (reports: any[]) => (
    <div className="space-y-4">
      {reports.map((report) => (
        <div
          key={report.id}
          className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <FileText className="text-blue-600" size={20} />
              <h3 className="[font-family:'Montserrat',Helvetica] font-medium text-lg text-gray-900">
                {report.name}
              </h3>
              <Badge className={getStatusColor(report.status)}>
                {report.status}
              </Badge>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span className="[font-family:'Montserrat',Helvetica] font-normal">
                Type: {report.type}
              </span>
              <span className="[font-family:'Montserrat',Helvetica] font-normal">
                Date: {report.date}
              </span>
              <span className="[font-family:'Montserrat',Helvetica] font-normal">
                Size: {report.size}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {report.status === "Ready" && (
              <Button
                variant="outline"
                size="sm"
                className="[font-family:'Montserrat',Helvetica] font-medium text-green-600 hover:bg-green-50"
              >
                <Download size={16} className="mr-2" />
                Download
              </Button>
            )}
            {report.status === "Processing" && (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="[font-family:'Montserrat',Helvetica] font-medium"
              >
                <RefreshCw size={16} className="mr-2 animate-spin" />
                Processing
              </Button>
            )}
            {report.status === "Failed" && (
              <Button
                variant="outline"
                size="sm"
                className="[font-family:'Montserrat',Helvetica] font-medium text-red-600 hover:bg-red-50"
              >
                <RefreshCw size={16} className="mr-2" />
                Retry
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

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
              <FileText className="mr-3 text-blue-600" size={32} />
              Export Reports
            </h1>
            <p className="[font-family:'Montserrat',Helvetica] font-normal text-gray-600">
              Generate and download various system reports
            </p>
          </div>

          {/* Filter Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-lg flex items-center">
                <Filter className="mr-2" size={20} />
                Report Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateRange" className="[font-family:'Montserrat',Helvetica] font-medium">
                    Date Range
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="format" className="[font-family:'Montserrat',Helvetica] font-medium">
                    Format
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customDate" className="[font-family:'Montserrat',Helvetica] font-medium">
                    Custom Date
                  </Label>
                  <Input
                    id="customDate"
                    type="date"
                    className="[font-family:'Montserrat',Helvetica] font-normal"
                  />
                </div>
                <div className="flex items-end">
                  <Button className="w-full bg-black hover:bg-black/80 [font-family:'Montserrat',Helvetica] font-medium">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reports Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="system" className="[font-family:'Montserrat',Helvetica] font-medium">
                System Reports
              </TabsTrigger>
              <TabsTrigger value="analytics" className="[font-family:'Montserrat',Helvetica] font-medium">
                Analytics Reports
              </TabsTrigger>
              <TabsTrigger value="compliance" className="[font-family:'Montserrat',Helvetica] font-medium">
                Compliance Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="system" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl">
                    System Reports
                  </CardTitle>
                  <p className="[font-family:'Montserrat',Helvetica] font-normal text-sm text-gray-600">
                    Performance, security, and user activity reports
                  </p>
                </CardHeader>
                <CardContent>
                  {renderReportTable(systemReports)}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl">
                    Analytics Reports
                  </CardTitle>
                  <p className="[font-family:'Montserrat',Helvetica] font-normal text-sm text-gray-600">
                    Traffic analysis, user behavior, and engagement metrics
                  </p>
                </CardHeader>
                <CardContent>
                  {renderReportTable(analyticsReports)}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl">
                    Compliance Reports
                  </CardTitle>
                  <p className="[font-family:'Montserrat',Helvetica] font-normal text-sm text-gray-600">
                    GDPR, SOX, ISO 27001, and other compliance reports
                  </p>
                </CardHeader>
                <CardContent>
                  {renderReportTable(complianceReports)}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};