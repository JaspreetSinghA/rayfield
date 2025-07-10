import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link, useLocation } from "wouter";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";

export const UploadSubmission = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    setLocation("/review");
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
              <Upload className="mr-3 text-blue-600" size={32} />
              Upload Submission
            </h1>
            <p className="[font-family:'Montserrat',Helvetica] font-normal text-gray-600">
              Upload documents and files for processing
            </p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="[font-family:'Montserrat',Helvetica] font-medium">
                      Submission Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter submission title"
                      className="[font-family:'Montserrat',Helvetica] font-normal"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="[font-family:'Montserrat',Helvetica] font-medium">
                      Category
                    </Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="report">Report</SelectItem>
                        <SelectItem value="analysis">Analysis</SelectItem>
                        <SelectItem value="documentation">Documentation</SelectItem>
                        <SelectItem value="data">Data Files</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="[font-family:'Montserrat',Helvetica] font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your submission..."
                    className="[font-family:'Montserrat',Helvetica] font-normal min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl">
                  File Upload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="[font-family:'Montserrat',Helvetica] font-medium text-lg text-gray-900 mb-2">
                    Drag and drop files here
                  </p>
                  <p className="[font-family:'Montserrat',Helvetica] font-normal text-sm text-gray-600 mb-4">
                    or click to select files
                  </p>
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="fileUpload"
                  />
                  <Label htmlFor="fileUpload">
                    <Button
                      variant="outline"
                      className="[font-family:'Montserrat',Helvetica] font-medium"
                      asChild
                    >
                      <span>Choose Files</span>
                    </Button>
                  </Label>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h3 className="[font-family:'Montserrat',Helvetica] font-medium text-lg text-gray-900">
                      Uploaded Files
                    </h3>
                    {uploadedFiles.map((file, index) => (
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
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="[font-family:'Montserrat',Helvetica] font-medium text-red-600 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <div className="flex space-x-4">
                <Link href="/text-input">
                  <Button
                    variant="outline"
                    className="[font-family:'Montserrat',Helvetica] font-medium"
                  >
                    Switch to Text Input
                  </Button>
                </Link>
              </div>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  className="[font-family:'Montserrat',Helvetica] font-medium"
                >
                  Save as Draft
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-black hover:bg-black/80 [font-family:'Montserrat',Helvetica] font-medium"
                >
                  Continue to Review
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};