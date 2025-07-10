import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { apiClient } from "@/lib/api";

interface UploadLogEntry {
  submission_id: number;
  csv_filename: string;
  anomaly_threshold: string;
  created_at: string;
}

type SortKey = "submission_id" | "csv_filename" | "anomaly_threshold" | "created_at";
type SortOrder = "asc" | "desc";

export default function UploadLog() {
  const [logs, setLogs] = useState<UploadLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.request<UploadLogEntry[]>("/api/upload/logs", { credentials: 'include' });
      setLogs(res);
    } catch (err) {
      setError("Failed to fetch upload logs");
    } finally {
      setLoading(false);
    }
  };

  const sorted = [...logs].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "created_at") {
      cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    } else if (sortKey === "submission_id") {
      cmp = a.submission_id - b.submission_id;
    } else {
      cmp = a[sortKey].localeCompare(b[sortKey]);
    }
    return sortOrder === "asc" ? cmp : -cmp;
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <header className="bg-white shadow-sm border-b">
        <div className="w-full px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img className="w-8 h-8 mr-3" alt="Logo" src="/figmaAssets/image-4.svg" />
              <span className="[font-family:'Montserrat',Helvetica] font-medium text-black text-xl">Rayfield Systems</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" className="[font-family:'Montserrat',Helvetica] font-medium">Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 px-6 py-8 w-full">
        <div className="mb-8">
          <h1 className="[font-family:'Montserrat',Helvetica] font-medium text-3xl text-gray-900 mb-2 flex items-center">
            Upload Log
          </h1>
          <p className="[font-family:'Montserrat',Helvetica] font-normal text-gray-600">
            View a log of all uploaded CSVs, anomaly thresholds, and upload dates.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl">Upload Log</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead>
                    <tr>
                      <th className="cursor-pointer" onClick={() => handleSort("submission_id")}>Submission ID {sortKey === "submission_id" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                      <th className="cursor-pointer" onClick={() => handleSort("csv_filename")}>CSV Filename {sortKey === "csv_filename" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                      <th className="cursor-pointer" onClick={() => handleSort("anomaly_threshold")}>Anomaly Threshold {sortKey === "anomaly_threshold" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                      <th className="cursor-pointer" onClick={() => handleSort("created_at")}>Date {sortKey === "created_at" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((log) => (
                      <tr key={log.submission_id + log.csv_filename + log.created_at} className="hover:bg-gray-100 transition cursor-pointer">
                        <td>{log.submission_id}</td>
                        <td>{log.csv_filename}</td>
                        <td>{log.anomaly_threshold}</td>
                        <td>{new Date(log.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
} 