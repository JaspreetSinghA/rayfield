import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Download, FileText, Calendar, Filter, RefreshCw } from "lucide-react";
import { apiClient } from "@/lib/api";

interface ReportFile {
  name: string;
  type: string;
  size: number;
  modified: string;
  download_url: string;
}

export const ExportReports = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState("system");
  const [reports, setReports] = useState<ReportFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.request<ReportFile[]>("/api/reports/list");
      setReports(res);
    } catch (err: any) {
      setError("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  // Group reports by type
  const grouped = {
    system: reports.filter(r => r.type === "tables" && r.name.includes("system")),
    analytics: reports.filter(r => r.type === "tables" && r.name.includes("analytics")),
    compliance: reports.filter(r => r.type === "tables" && r.name.includes("compliance")),
    tables: reports.filter(r => r.type === "tables"),
    logs: reports.filter(r => r.type === "logs"),
    plots: reports.filter(r => r.type === "plots"),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ready": return "bg-green-100 text-green-800";
      case "Processing": return "bg-yellow-100 text-yellow-800";
      case "Failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderReportTable = (reports: ReportFile[]) => (
    <div className="space-y-4">
      {reports.map((report) => (
        <div
          key={report.type + report.name}
          className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <FileText className="text-blue-600" size={20} />
              <h3 className="[font-family:'Montserrat',Helvetica] font-medium text-lg text-gray-900">
                {report.name}
              </h3>
              <Badge className="bg-green-100 text-green-800">
                {report.type}
              </Badge>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span className="[font-family:'Montserrat',Helvetica] font-normal">
                Size: {(report.size / 1024 / 1024).toFixed(2)} MB
              </span>
              <span className="[font-family:'Montserrat',Helvetica] font-normal">
                Modified: {new Date(report.modified).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="[font-family:'Montserrat',Helvetica] font-medium text-green-600 hover:bg-green-50"
              asChild
            >
              <a href={`${apiClient.baseURL}${report.download_url}`} target="_blank" rel="noopener noreferrer">
                <Download size={16} className="mr-2" />
                Download
              </a>
            </Button>
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
          {loading ? (
            <div className="text-center py-8">Loading reports...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : (
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
                    {renderReportTable(grouped.tables)}
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
                    {renderReportTable(grouped.logs)}
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
                    {renderReportTable(grouped.plots)}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
};