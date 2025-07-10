import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { apiClient } from "@/lib/api";

interface Submission {
  id: number;
  title: string;
  category: string;
  description: string;
  created_at: string;
  file_path: string;
}

type SortKey = "created_at" | "title" | "category";
type SortOrder = "asc" | "desc";

export default function UploadHistory() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.request<Submission[]>("/api/submissions/history");
      setSubmissions(res);
    } catch (err) {
      setError("Failed to fetch upload history");
    } finally {
      setLoading(false);
    }
  };

  const sorted = [...submissions].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "created_at") {
      cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
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
            Upload History
          </h1>
          <p className="[font-family:'Montserrat',Helvetica] font-normal text-gray-600">
            View and manage your previous uploads. Click a row to view results.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl">Uploads</CardTitle>
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
                      <th className="cursor-pointer" onClick={() => handleSort("created_at")}>Date {sortKey === "created_at" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                      <th className="cursor-pointer" onClick={() => handleSort("title")}>Title {sortKey === "title" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                      <th className="cursor-pointer" onClick={() => handleSort("category")}>Category {sortKey === "category" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                      <th>Description</th>
                      <th>File</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-100 transition cursor-pointer">
                        <td>{new Date(s.created_at).toLocaleString()}</td>
                        <td>{s.title}</td>
                        <td>{s.category}</td>
                        <td>{s.description}</td>
                        <td>{s.file_path ? s.file_path.split('/').pop() : "-"}</td>
                        <td>
                          <Link href={`/review?submission_id=${s.id}`}>
                            <Button size="sm" variant="outline">View Results</Button>
                          </Link>
                        </td>
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