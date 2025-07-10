import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

export const Dashboard = (): JSX.Element => {
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
            <h1 className="[font-family:'Montserrat',Helvetica] font-medium text-3xl text-gray-900 mb-2">
              Welcome to Dashboard
            </h1>
            <p className="[font-family:'Montserrat',Helvetica] font-normal text-gray-600">
              Manage your account and access system features
            </p>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            <Card className="border-2 border-gray-300 shadow-md hover:shadow-lg transition-shadow aspect-square bg-white">
              <CardHeader className="pb-4 border-b border-gray-200">
                <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl">
                  Flagged Anomalies
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-between h-full p-6">
                <p className="[font-family:'Montserrat',Helvetica] font-normal text-base text-gray-600 mb-6">
                  Monitor and manage system anomalies that require immediate attention and review
                </p>
                <Link href="/flagged-anomalies">
                  <Button className="w-full h-12 bg-black hover:bg-black/80 [font-family:'Montserrat',Helvetica] font-medium text-base border-2 border-black">
                    View Anomalies
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-300 shadow-md hover:shadow-lg transition-shadow aspect-square bg-white">
              <CardHeader className="pb-4 border-b border-gray-200">
                <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl">
                  Export Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-between h-full p-6">
                <p className="[font-family:'Montserrat',Helvetica] font-normal text-base text-gray-600 mb-6">
                  Generate and download comprehensive system, analytics, and compliance reports
                </p>
                <Link href="/export-reports">
                  <Button className="w-full h-12 bg-black hover:bg-black/80 [font-family:'Montserrat',Helvetica] font-medium text-base border-2 border-black">
                    Export Reports
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-300 shadow-md hover:shadow-lg transition-shadow aspect-square bg-white">
              <CardHeader className="pb-4 border-b border-gray-200">
                <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl">
                  Upload Submission
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-between h-full p-6">
                <p className="[font-family:'Montserrat',Helvetica] font-normal text-base text-gray-600 mb-6">
                  Upload documents and files for comprehensive processing and analysis
                </p>
                <Link href="/upload-submission">
                  <Button className="w-full h-12 bg-black hover:bg-black/80 [font-family:'Montserrat',Helvetica] font-medium text-base border-2 border-black">
                    Upload Files
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-300 shadow-md hover:shadow-lg transition-shadow aspect-square bg-white">
              <CardHeader className="pb-4 border-b border-gray-200">
                <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl">
                  Text Input
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-between h-full p-6">
                <p className="[font-family:'Montserrat',Helvetica] font-normal text-base text-gray-600 mb-6">
                  Enter text content directly for immediate processing and evaluation
                </p>
                <Link href="/text-input">
                  <Button className="w-full h-12 bg-black hover:bg-black/80 [font-family:'Montserrat',Helvetica] font-medium text-base border-2 border-black">
                    Input Text
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-300 shadow-md hover:shadow-lg transition-shadow aspect-square bg-white">
              <CardHeader className="pb-4 border-b border-gray-200">
                <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl">
                  Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-between h-full p-6">
                <p className="[font-family:'Montserrat',Helvetica] font-normal text-base text-gray-600 mb-6">
                  Manage your personal information and account preferences securely
                </p>
                <Link href="/profile">
                  <Button className="w-full h-12 bg-black hover:bg-black/80 [font-family:'Montserrat',Helvetica] font-medium text-base border-2 border-black">
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-300 shadow-md hover:shadow-lg transition-shadow aspect-square bg-white">
              <CardHeader className="pb-4 border-b border-gray-200">
                <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl">
                  Help & Support
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-between h-full p-6">
                <p className="[font-family:'Montserrat',Helvetica] font-normal text-base text-gray-600 mb-6">
                  Get help, documentation, and contact our dedicated support team
                </p>
                <Button className="w-full h-12 bg-black hover:bg-black/80 [font-family:'Montserrat',Helvetica] font-medium text-base border-2 border-black">
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