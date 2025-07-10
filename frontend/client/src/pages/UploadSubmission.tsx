import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link, useLocation, useRoute } from "wouter";
import { Upload, FileText, AlertCircle, CheckCircle, Loader2, BarChart3 } from "lucide-react";
import { apiClient } from "@/lib/api";

export const UploadSubmission = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/review");
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const [processingResults, setProcessingResults] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: ""
  });
  const [anomalyThreshold, setAnomalyThreshold] = useState<number | 'auto'>(0.05);
  const [thresholdError, setThresholdError] = useState<string>("");
  const [formError, setFormError] = useState<string>("");

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
      // Filter for CSV files only
      const csvFiles = files.filter(file => file.type === "text/csv" || file.name.endsWith('.csv'));
      setUploadedFiles(prev => [...prev, ...csvFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      // Filter for CSV files only
      const csvFiles = files.filter(file => file.type === "text/csv" || file.name.endsWith('.csv'));
      setUploadedFiles(prev => [...prev, ...csvFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const processEnergyData = async () => {
    if (uploadedFiles.length === 0) {
      alert("Please upload at least one CSV file");
      return;
    }
    if (!formData.title.trim() || !formData.category.trim() || !formData.description.trim()) {
      setFormError("Please provide an analysis title, select a data field, and enter a description before uploading.");
      return;
    }
    if (thresholdError) {
      alert(thresholdError);
      return;
    }
    setFormError("");

    setIsProcessing(true);
    setProcessingStep("Uploading files...");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title || 'Energy Data Analysis');
      formDataToSend.append('category', formData.category || 'energy-analysis');
      formDataToSend.append('description', formData.description || 'Energy data processing and anomaly detection');
      formDataToSend.append('anomaly_threshold', anomalyThreshold === 'auto' ? 'auto' : anomalyThreshold.toString());

      uploadedFiles.forEach((file, index) => {
        formDataToSend.append('files', file);
      });

      // Save the first uploaded CSV file name to localStorage
      const firstCsv = uploadedFiles.find(f => f.name.endsWith('.csv'));
      if (firstCsv) {
        localStorage.setItem('last_uploaded_csv', firstCsv.name);
      }

      setProcessingStep("Processing data...");
      const uploadResponse = await apiClient.upload.submitFiles(formDataToSend) as { submission_id: string, files: any[] };

      setProcessingStep("Fetching results...");
      // Fetch results using the new endpoint
      const results = await apiClient.request(`/api/submissions/${uploadResponse.submission_id}/results`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      setProcessingResults(results);
      setProcessingStep("Complete!");
      
      console.log('Upload response:', uploadResponse);
      console.log('About to navigate to:', `/review?submission_id=${uploadResponse.submission_id}`);
      
      // Navigate to review page with results
      setTimeout(() => {
        console.log('Navigating to:', `/review?submission_id=${uploadResponse.submission_id}`);
        window.location.href = `/review?submission_id=${uploadResponse.submission_id}`;
      }, 2000);

    } catch (error) {
      console.error('Processing failed:', error);
      alert('Processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
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
              <Upload className="mr-3 text-blue-600" size={32} />
              Energy Data Upload & Analysis
            </h1>
            <p className="[font-family:'Montserrat',Helvetica] font-normal text-gray-600">
              Upload energy CSV files for automated processing and anomaly detection
            </p>
          </div>

          <div className="space-y-6">
            {/* Submission Details */}
            <Card>
              <CardHeader>
                <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl">
                  Analysis Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formError && (
                  <div className="mb-2 text-red-600 text-sm font-medium">{formError}</div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="[font-family:'Montserrat',Helvetica] font-medium">
                      Analysis Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter analysis title"
                      className="[font-family:'Montserrat',Helvetica] font-normal"
                      value={formData.title}
                      onChange={(e) => handleFormChange('title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="[font-family:'Montserrat',Helvetica] font-medium">
                      Data Type
                        <span className="ml-1 text-xs text-gray-500" title="Select the type of data you are uploading. This helps categorize your analysis and may affect how results are displayed.">(?)</span>
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => handleFormChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select data type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emissions">CO2 Emissions</SelectItem>
                        <SelectItem value="energy-consumption">Energy Consumption</SelectItem>
                        <SelectItem value="fuel-usage">Fuel Usage</SelectItem>
                        <SelectItem value="power-generation">Power Generation</SelectItem>
                        <SelectItem value="other">Other Energy Data</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="text-xs text-gray-500">This field categorizes your upload and may affect how your data is analyzed and displayed in reports.</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="[font-family:'Montserrat',Helvetica] font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your energy data and analysis requirements..."
                    className="[font-family:'Montserrat',Helvetica] font-normal min-h-[100px]"
                    value={formData.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="anomaly-threshold" className="[font-family:'Montserrat',Helvetica] font-medium">
                    Anomaly Detection Threshold (%)
                  </Label>
                  <Input
                    id="anomaly-threshold"
                    type="number"
                    min="0.01"
                    max="99.99"
                    step="0.01"
                    value={anomalyThreshold === 'auto' ? '' : (anomalyThreshold * 100)}
                    placeholder="e.g. 5 for 5% (or leave blank for auto)"
                    onChange={e => {
                      const val = e.target.value;
                      if (val === '' || isNaN(Number(val))) {
                        setAnomalyThreshold('auto');
                        setThresholdError("");
                      } else {
                        const num = Number(val);
                        if (num <= 0 || num >= 100) {
                          setThresholdError("Please enter a value between 0 and 100 (exclusive)");
                          setAnomalyThreshold('auto');
                        } else {
                          setThresholdError("");
                          setAnomalyThreshold(num / 100);
                        }
                      }
                    }}
                  />
                  {thresholdError && <div className="text-xs text-red-500">{thresholdError}</div>}
                  <div className="text-xs text-gray-500">Set the expected proportion of anomalies (e.g. 5 for 5%). Leave blank for automatic detection.</div>
                </div>
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl flex items-center">
                  <BarChart3 className="mr-2" size={20} />
                  Energy Data Files (CSV Only)
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
                    Drag and drop CSV files here
                  </p>
                  <p className="[font-family:'Montserrat',Helvetica] font-normal text-sm text-gray-600 mb-4">
                    Only CSV files containing energy data are accepted
                  </p>
                  <Input
                    type="file"
                    multiple
                    accept=".csv"
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
                      <span>Choose CSV Files</span>
                    </Button>
                  </Label>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h3 className="[font-family:'Montserrat',Helvetica] font-medium text-lg text-gray-900">
                      Uploaded Energy Data Files
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

            {/* Processing Status */}
            {isProcessing && (
              <Card>
                <CardHeader>
                  <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl flex items-center">
                    <Loader2 className="mr-2 animate-spin" size={20} />
                    Processing Energy Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Loader2 className="animate-spin text-blue-600" size={20} />
                      <span className="[font-family:'Montserrat',Helvetica] font-medium text-gray-900">
                        {processingStep}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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
                  disabled={isProcessing}
                >
                  Save as Draft
                </Button>
                <Button
                  onClick={processEnergyData}
                  disabled={isProcessing || uploadedFiles.length === 0}
                  className="bg-black hover:bg-black/80 [font-family:'Montserrat',Helvetica] font-medium"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={16} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="mr-2" size={16} />
                      Process & Analyze
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};