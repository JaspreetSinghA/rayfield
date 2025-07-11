import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { apiClient } from "@/lib/api";
import { AlertTriangle, FileText, Upload, History, User, HelpCircle } from "lucide-react";

export const Dashboard = (): JSX.Element => {
  const isAuthenticated = Boolean(localStorage.getItem("is_authenticated"));
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="w-full px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                className="w-8 h-8 mr-3"
                alt="Logo"
                src="/figmaAssets/image-4.svg"
              />
              <span className="font-semibold text-slate-800 text-xl">
                Rayfield Systems
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  className="font-medium border-slate-300 hover:bg-slate-50 transition-colors"
                  onClick={async () => {
                    await apiClient.auth.logout();
                    localStorage.removeItem("is_authenticated");
                    setLocation("/signin");
                  }}
                >
                  Sign Out
                </Button>
              ) : (
                <Link href="/signin">
                  <Button variant="outline" className="font-medium border-slate-300 hover:bg-slate-50 transition-colors">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-12 w-full max-w-7xl mx-auto">
        <div>
          <div className="mb-12">
            <h1 className="font-bold text-4xl text-slate-800 mb-3">
              Welcome to Dashboard
            </h1>
            <p className="text-slate-600 text-lg">
              Manage your account and access system features
            </p>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card 
              className="group relative overflow-hidden bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-xl cursor-pointer"
              onClick={() => setLocation("/flagged-anomalies")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <CardHeader className="relative pb-4 border-b border-slate-200/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <CardTitle className="font-semibold text-xl text-slate-800">
                    Flagged Anomalies
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative flex flex-col justify-between h-full p-6">
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Monitor and manage system anomalies that require immediate attention and review
                </p>
                <Button className="w-full h-12 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg">
                  View Anomalies
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="group relative overflow-hidden bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-xl cursor-pointer"
              onClick={() => setLocation("/export-reports")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <CardHeader className="relative pb-4 border-b border-slate-200/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="font-semibold text-xl text-slate-800">
                    Export Reports
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative flex flex-col justify-between h-full p-6">
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Generate and download comprehensive system, analytics, and compliance reports
                </p>
                <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg">
                  Export Reports
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="group relative overflow-hidden bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-xl cursor-pointer"
              onClick={() => setLocation("/upload-submission")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <CardHeader className="relative pb-4 border-b border-slate-200/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Upload className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="font-semibold text-xl text-slate-800">
                    Upload Submission
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative flex flex-col justify-between h-full p-6">
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Upload documents and files for comprehensive processing and analysis
                </p>
                <Button className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg">
                  Upload Files
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="group relative overflow-hidden bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-xl cursor-pointer"
              onClick={() => setLocation("/upload-history")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <CardHeader className="relative pb-4 border-b border-slate-200/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <History className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="font-semibold text-xl text-slate-800">
                    Upload Histories
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative flex flex-col justify-between h-full p-6">
                <p className="text-slate-600 mb-6 leading-relaxed">
                  View and manage all your previous uploads, analysis results, and submission history
                </p>
                <Button className="w-full h-12 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg">
                  View History
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="group relative overflow-hidden bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-xl cursor-pointer"
              onClick={() => setLocation("/profile")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <CardHeader className="relative pb-4 border-b border-slate-200/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <User className="w-6 h-6 text-slate-600" />
                  </div>
                  <CardTitle className="font-semibold text-xl text-slate-800">
                    Profile Settings
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative flex flex-col justify-between h-full p-6">
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Manage your personal information and account preferences securely
                </p>
                <Button className="w-full h-12 bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg">
                  View Profile
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="group relative overflow-hidden bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-xl cursor-pointer"
              onClick={() => setLocation("/get-help")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-yellow-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <CardHeader className="relative pb-4 border-b border-slate-200/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <HelpCircle className="w-6 h-6 text-amber-600" />
                  </div>
                  <CardTitle className="font-semibold text-xl text-slate-800">
                    Help & Support
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative flex flex-col justify-between h-full p-6">
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Get help, documentation, and contact our dedicated support team
                </p>
                <Button className="w-full h-12 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg">
                  Get Help
                </Button>
              </CardContent>
            </Card>


          </div>
        </div>
      </main>
    </div>
  );
};