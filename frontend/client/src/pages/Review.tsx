import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation } from "wouter";
import { Eye, Edit, Send, ArrowLeft, FileText, Upload, Calendar, User } from "lucide-react";

export const Review = (): JSX.Element => {
  const [, setLocation] = useLocation();

  const handleSubmit = () => {
    setLocation("/submission");
  };

  // Mock data for review
  const submissionData = {
    title: "Security Analysis Report",
    category: "Security",
    priority: "High",
    department: "IT",
    description: "Comprehensive analysis of recent security incidents and recommended mitigation strategies.",
    content: "This report analyzes the security incidents that occurred in the past month...",
    tags: ["security", "analysis", "incidents", "mitigation"],
    files: [
      { name: "security_report.pdf", size: "2.4 MB", type: "PDF" },
      { name: "incident_logs.csv", size: "1.2 MB", type: "CSV" },
    ],
    submittedBy: "John Doe",
    submittedDate: "2025-01-08 21:30:00",
    wordCount: 1247
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      case "Urgent": return "bg-purple-100 text-purple-800";
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
              <Eye className="mr-3 text-blue-600" size={32} />
              Review Submission
            </h1>
            <p className="[font-family:'Montserrat',Helvetica] font-normal text-gray-600">
              Review your submission before final approval
            </p>
          </div>

          <div className="space-y-6">
            {/* Submission Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl">
                  Submission Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <span className="[font-family:'Montserrat',Helvetica] font-medium text-sm text-gray-600">Title:</span>
                      <p className="[font-family:'Montserrat',Helvetica] font-normal text-gray-900">
                        {submissionData.title}
                      </p>
                    </div>
                    <div>
                      <span className="[font-family:'Montserrat',Helvetica] font-medium text-sm text-gray-600">Category:</span>
                      <p className="[font-family:'Montserrat',Helvetica] font-normal text-gray-900">
                        {submissionData.category}
                      </p>
                    </div>
                    <div>
                      <span className="[font-family:'Montserrat',Helvetica] font-medium text-sm text-gray-600">Priority:</span>
                      <div className="mt-1">
                        <Badge className={getPriorityColor(submissionData.priority)}>
                          {submissionData.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="[font-family:'Montserrat',Helvetica] font-medium text-sm text-gray-600">Department:</span>
                      <p className="[font-family:'Montserrat',Helvetica] font-normal text-gray-900">
                        {submissionData.department}
                      </p>
                    </div>
                    <div>
                      <span className="[font-family:'Montserrat',Helvetica] font-medium text-sm text-gray-600">Submitted By:</span>
                      <p className="[font-family:'Montserrat',Helvetica] font-normal text-gray-900 flex items-center">
                        <User className="mr-2" size={16} />
                        {submissionData.submittedBy}
                      </p>
                    </div>
                    <div>
                      <span className="[font-family:'Montserrat',Helvetica] font-medium text-sm text-gray-600">Date:</span>
                      <p className="[font-family:'Montserrat',Helvetica] font-normal text-gray-900 flex items-center">
                        <Calendar className="mr-2" size={16} />
                        {submissionData.submittedDate}
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <span className="[font-family:'Montserrat',Helvetica] font-medium text-sm text-gray-600">Description:</span>
                  <p className="[font-family:'Montserrat',Helvetica] font-normal text-gray-900 mt-1">
                    {submissionData.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Content Preview */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl">
                    Content Preview
                  </CardTitle>
                  <div className="text-sm text-gray-500">
                    <span className="[font-family:'Montserrat',Helvetica] font-normal">
                      {submissionData.wordCount} words
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="[font-family:'Montserrat',Helvetica] font-normal text-gray-900">
                    {submissionData.content}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Files */}
            {submissionData.files.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl">
                    Attached Files
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {submissionData.files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="text-blue-600" size={20} />
                          <div>
                            <p className="[font-family:'Montserrat',Helvetica] font-medium text-sm text-gray-900">
                              {file.name}
                            </p>
                            <p className="[font-family:'Montserrat',Helvetica] font-normal text-xs text-gray-500">
                              {file.type} • {file.size}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="[font-family:'Montserrat',Helvetica] font-medium"
                        >
                          <Eye size={16} className="mr-2" />
                          Preview
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl">
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {submissionData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="[font-family:'Montserrat',Helvetica] font-normal">
                      {tag}
                    </Badge>
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
                    Back to Edit
                  </Button>
                </Link>
              </div>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  className="[font-family:'Montserrat',Helvetica] font-medium"
                >
                  <Edit className="mr-2" size={16} />
                  Edit Submission
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-black hover:bg-black/80 [font-family:'Montserrat',Helvetica] font-medium"
                >
                  <Send className="mr-2" size={16} />
                  Submit for Processing
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};