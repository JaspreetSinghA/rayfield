import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link, useLocation } from "wouter";
import { FileText, Upload, Save, Eye } from "lucide-react";

export const TextInput = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContent(text);
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
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
              <FileText className="mr-3 text-blue-600" size={32} />
              Text Input Submission
            </h1>
            <p className="[font-family:'Montserrat',Helvetica] font-normal text-gray-600">
              Enter text content directly for processing
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
                      Title
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
                        <SelectItem value="analysis">Analysis</SelectItem>
                        <SelectItem value="report">Report</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="query">Query</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority" className="[font-family:'Montserrat',Helvetica] font-medium">
                      Priority
                    </Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department" className="[font-family:'Montserrat',Helvetica] font-medium">
                      Department
                    </Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="it">IT</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="compliance">Compliance</SelectItem>
                        <SelectItem value="management">Management</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Text Content */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl">
                    Content
                  </CardTitle>
                  <div className="text-sm text-gray-500">
                    <span className="[font-family:'Montserrat',Helvetica] font-normal">
                      {wordCount} words
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="content" className="[font-family:'Montserrat',Helvetica] font-medium">
                      Main Content
                    </Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={handleContentChange}
                      placeholder="Enter your text content here..."
                      className="[font-family:'Montserrat',Helvetica] font-normal min-h-[300px] resize-none"
                    />
                  </div>
                  
                  {/* Formatting Tools */}
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <span className="[font-family:'Montserrat',Helvetica] font-medium text-sm text-gray-700">
                      Formatting:
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="[font-family:'Montserrat',Helvetica] font-medium"
                    >
                      Bold
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="[font-family:'Montserrat',Helvetica] font-medium"
                    >
                      Italic
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="[font-family:'Montserrat',Helvetica] font-medium"
                    >
                      Underline
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="[font-family:'Montserrat',Helvetica] font-medium"
                    >
                      Clear Format
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Options */}
            <Card>
              <CardHeader>
                <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl">
                  Additional Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tags" className="[font-family:'Montserrat',Helvetica] font-medium">
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    placeholder="Enter tags separated by commas"
                    className="[font-family:'Montserrat',Helvetica] font-normal"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes" className="[font-family:'Montserrat',Helvetica] font-medium">
                    Additional Notes
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional notes or comments..."
                    className="[font-family:'Montserrat',Helvetica] font-normal min-h-[100px]"
                  />
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
                    <Upload className="mr-2" size={16} />
                    Switch to File Upload
                  </Button>
                </Link>
              </div>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  className="[font-family:'Montserrat',Helvetica] font-medium"
                >
                  <Save className="mr-2" size={16} />
                  Save as Draft
                </Button>
                <Button
                  variant="outline"
                  className="[font-family:'Montserrat',Helvetica] font-medium"
                >
                  <Eye className="mr-2" size={16} />
                  Preview
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