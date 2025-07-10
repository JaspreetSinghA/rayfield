import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { CheckCircle, Clock, AlertCircle, Home, FileText, RefreshCw } from "lucide-react";

export const Submission = (): JSX.Element => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("processing");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setStage("completed");
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const stages = [
    { id: "received", name: "Received", completed: true },
    { id: "validation", name: "Validation", completed: progress > 30 },
    { id: "processing", name: "Processing", completed: progress > 70 },
    { id: "completed", name: "Completed", completed: progress >= 100 },
  ];

  const submissionData = {
    id: "SUB-2025-001",
    title: "Security Analysis Report",
    submittedAt: "2025-01-08 21:30:00",
    estimatedCompletion: "2025-01-09 09:30:00",
    priority: "High",
    status: stage === "completed" ? "Completed" : "Processing"
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
            {stage === "completed" ? (
              <div className="text-center">
                <CheckCircle className="mx-auto mb-4 text-green-600" size={64} />
                <h1 className="[font-family:'Montserrat',Helvetica] font-medium text-3xl text-gray-900 mb-2">
                  Submission Completed
                </h1>
                <p className="[font-family:'Montserrat',Helvetica] font-normal text-gray-600">
                  Your submission has been processed successfully
                </p>
              </div>
            ) : (
              <div className="text-center">
                <RefreshCw className="mx-auto mb-4 text-blue-600 animate-spin" size={64} />
                <h1 className="[font-family:'Montserrat',Helvetica] font-medium text-3xl text-gray-900 mb-2">
                  Processing Submission
                </h1>
                <p className="[font-family:'Montserrat',Helvetica] font-normal text-gray-600">
                  Your submission is being processed. Please wait...
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Submission Details */}
            <Card>
              <CardHeader>
                <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl">
                  Submission Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <span className="[font-family:'Montserrat',Helvetica] font-medium text-sm text-gray-600">Submission ID:</span>
                      <p className="[font-family:'Montserrat',Helvetica] font-normal text-gray-900 font-mono">
                        {submissionData.id}
                      </p>
                    </div>
                    <div>
                      <span className="[font-family:'Montserrat',Helvetica] font-medium text-sm text-gray-600">Title:</span>
                      <p className="[font-family:'Montserrat',Helvetica] font-normal text-gray-900">
                        {submissionData.title}
                      </p>
                    </div>
                    <div>
                      <span className="[font-family:'Montserrat',Helvetica] font-medium text-sm text-gray-600">Priority:</span>
                      <div className="mt-1">
                        <Badge className="bg-red-100 text-red-800">
                          {submissionData.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="[font-family:'Montserrat',Helvetica] font-medium text-sm text-gray-600">Submitted:</span>
                      <p className="[font-family:'Montserrat',Helvetica] font-normal text-gray-900">
                        {submissionData.submittedAt}
                      </p>
                    </div>
                    <div>
                      <span className="[font-family:'Montserrat',Helvetica] font-medium text-sm text-gray-600">Status:</span>
                      <div className="mt-1">
                        <Badge className={stage === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                          {submissionData.status}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="[font-family:'Montserrat',Helvetica] font-medium text-sm text-gray-600">Est. Completion:</span>
                      <p className="[font-family:'Montserrat',Helvetica] font-normal text-gray-900">
                        {submissionData.estimatedCompletion}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl">
                  Processing Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="[font-family:'Montserrat',Helvetica] font-medium text-sm text-gray-600">
                      Overall Progress
                    </span>
                    <span className="[font-family:'Montserrat',Helvetica] font-medium text-sm text-gray-900">
                      {progress}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Stage Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {stages.map((stageItem) => (
                    <div
                      key={stageItem.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg ${
                        stageItem.completed
                          ? "bg-green-50 border border-green-200"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      {stageItem.completed ? (
                        <CheckCircle className="text-green-600" size={20} />
                      ) : stage === stageItem.id ? (
                        <RefreshCw className="text-blue-600 animate-spin" size={20} />
                      ) : (
                        <Clock className="text-gray-400" size={20} />
                      )}
                      <span className={`[font-family:'Montserrat',Helvetica] font-medium text-sm ${
                        stageItem.completed ? "text-green-800" : "text-gray-600"
                      }`}>
                        {stageItem.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl">
                  {stage === "completed" ? "Next Steps" : "What's Happening"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stage === "completed" ? (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="text-green-600 mt-1" size={20} />
                      <div>
                        <h4 className="[font-family:'Montserrat',Helvetica] font-medium text-gray-900">
                          Processing Complete
                        </h4>
                        <p className="[font-family:'Montserrat',Helvetica] font-normal text-sm text-gray-600">
                          Your submission has been successfully processed and is ready for review.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileText className="text-blue-600 mt-1" size={20} />
                      <div>
                        <h4 className="[font-family:'Montserrat',Helvetica] font-medium text-gray-900">
                          Results Available
                        </h4>
                        <p className="[font-family:'Montserrat',Helvetica] font-normal text-sm text-gray-600">
                          Check your dashboard for processing results and any generated reports.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <RefreshCw className="text-blue-600 mt-1 animate-spin" size={20} />
                      <div>
                        <h4 className="[font-family:'Montserrat',Helvetica] font-medium text-gray-900">
                          Processing Your Submission
                        </h4>
                        <p className="[font-family:'Montserrat',Helvetica] font-normal text-sm text-gray-600">
                          Our system is analyzing your submission and will notify you when complete.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="text-yellow-600 mt-1" size={20} />
                      <div>
                        <h4 className="[font-family:'Montserrat',Helvetica] font-medium text-gray-900">
                          Please Wait
                        </h4>
                        <p className="[font-family:'Montserrat',Helvetica] font-normal text-sm text-gray-600">
                          This page will automatically update as processing progresses.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="[font-family:'Montserrat',Helvetica] font-medium"
                >
                  <Home className="mr-2" size={16} />
                  Return to Dashboard
                </Button>
              </Link>
              {stage === "completed" && (
                <Button
                  className="bg-black hover:bg-black/80 [font-family:'Montserrat',Helvetica] font-medium"
                >
                  <FileText className="mr-2" size={16} />
                  View Results
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};