import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f0fdfa] relative overflow-hidden">
      {/* Decorative background shape */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-indigo-100 rounded-full opacity-40 blur-3xl z-0" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-blue-100 rounded-full opacity-30 blur-2xl z-0" />

      {/* Header */}
      <header className="relative z-10 w-full px-8 py-6 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="flex items-center">
          <img
            className="w-10 h-10 mr-3"
            alt="Logo"
            src="/figmaAssets/image-4.svg"
          />
          <span className="font-extrabold text-2xl text-slate-800 tracking-tight">
            Rayfield Systems
          </span>
        </div>
        <Link href="/signin">
          <Button className="font-semibold px-6 py-2 text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg">
            Login
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pt-16 pb-8">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight drop-shadow-sm">
          Empowering <span className="text-indigo-600">Data-Driven</span> Decisions
        </h1>
        <p className="text-lg md:text-2xl text-slate-700 max-w-2xl mx-auto mb-10">
          Upload, analyze, and monitor your energy and emissions data with ease. Rayfield Systems provides automated anomaly detection, reporting, and insights for your projects.
        </p>
        <Link href="/signin">
          <Button className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg rounded-xl">
            Get Started
          </Button>
        </Link>
      </main>

      {/* Features Section */}
      <section className="relative z-10 w-full max-w-6xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="bg-white/90 rounded-2xl shadow-lg p-10 flex flex-col items-center border border-slate-100 hover:shadow-2xl transition-all">
          <span className="text-indigo-600 text-5xl mb-4">📊</span>
          <h2 className="font-bold text-xl mb-2">Automated Analysis</h2>
          <p className="text-slate-600">Upload your CSV data and let our system automatically clean, analyze, and detect anomalies for you.</p>
        </div>
        <div className="bg-white/90 rounded-2xl shadow-lg p-10 flex flex-col items-center border border-slate-100 hover:shadow-2xl transition-all">
          <span className="text-blue-600 text-5xl mb-4">📈</span>
          <h2 className="font-bold text-xl mb-2">Insightful Reports</h2>
          <p className="text-slate-600">Export detailed system, analytics, and compliance reports for your records and presentations.</p>
        </div>
        <div className="bg-white/90 rounded-2xl shadow-lg p-10 flex flex-col items-center border border-slate-100 hover:shadow-2xl transition-all">
          <span className="text-amber-500 text-5xl mb-4">⚡</span>
          <h2 className="font-bold text-xl mb-2">Easy to Use</h2>
          <p className="text-slate-600">Simple, intuitive interface designed for students and educators. No technical expertise required.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full py-8 text-center text-slate-500 text-sm bg-white/80 border-t border-slate-200/50 mt-auto">
        &copy; {new Date().getFullYear()} Rayfield Systems. For demo purposes only.
      </footer>
    </div>
  );
} 