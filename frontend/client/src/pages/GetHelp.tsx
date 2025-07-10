import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "How do I upload my data?",
    answer: "Go to the 'Upload Submission' page from the dashboard. You can drag and drop your CSV files or use the file picker."
  },
  {
    question: "Where can I see detected anomalies?",
    answer: "Visit the 'Detected Anomalies' page from the dashboard. You can filter, search, and view details for each anomaly."
  },
  {
    question: "How do I export reports?",
    answer: "Go to the 'Export Reports' page. You can download system, analytics, and compliance reports in various formats."
  },
  {
    question: "What do the anomaly severity levels mean?",
    answer: "High: Deviation ≥ 30%. Medium: 15–30%. Low: < 15%. These indicate how much a data point deviates from the expected value."
  },
  {
    question: "How is my data processed?",
    answer: "Your data is cleaned, analyzed, and run through machine learning models to detect anomalies and generate reports."
  },
  {
    question: "Who can I contact for support?",
    answer: "Use the contact form at the bottom of this page or email support@rayfield.com."
  }
];

export default function GetHelp() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl flex justify-start mb-4">
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
      <Card className="max-w-2xl w-full mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Get Help & FAQ</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-gray-700">
            Welcome to the Rayfield Systems Help Center. Here you'll find answers to common questions, a guide to using the platform, and ways to get further assistance.
          </p>
          <Separator className="my-4" />
          <h2 className="text-xl font-semibold mb-2">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible>
            {faqs.map((faq, idx) => (
              <AccordionItem value={String(idx)} key={idx}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
      <Card className="max-w-2xl w-full mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">How the Program Works</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Upload your emissions or energy data via the Upload Submission page.</li>
            <li>The system automatically cleans, analyzes, and runs anomaly detection on your data.</li>
            <li>Detected anomalies are shown in the Detected Anomalies page, with severity and details.</li>
            <li>Export detailed reports from the Export Reports page for compliance, analytics, or system review.</li>
            <li>All your submissions and results are securely stored and accessible from your dashboard.</li>
          </ul>
        </CardContent>
      </Card>
      <Card className="max-w-2xl w-full mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Navigation & Where to Find Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><b>Dashboard:</b> Quick access to all main features and your recent activity.</li>
            <li><b>Upload Submission:</b> Upload new data files for analysis.</li>
            <li><b>Detected Anomalies:</b> Review, filter, and investigate flagged data points.</li>
            <li><b>Export Reports:</b> Download system, analytics, and compliance reports.</li>
            <li><b>Profile:</b> Manage your account and settings.</li>
            <li><b>Get Help:</b> (this page) Find FAQs, guides, and support options.</li>
          </ul>
        </CardContent>
      </Card>
      <Card className="max-w-2xl w-full mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Contact & Support</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2 text-gray-700">If you need further assistance, please contact us:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Email: <a href="mailto:support@rayfield.com" className="text-blue-600 underline">support@rayfield.com</a></li>
            <li>Or use the <Link href="/profile">Profile</Link> page to update your contact info and request help.</li>
          </ul>
          <p className="text-gray-500 text-sm">We aim to respond to all queries within 1 business day.</p>
        </CardContent>
      </Card>
    </div>
  );
} 