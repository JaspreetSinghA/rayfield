import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import SignIn from "@/pages/SignIn";
import { SignUp } from "@/pages/SignUp";
import { Dashboard } from "@/pages/Dashboard";
import { Profile } from "@/pages/Profile";
import { FlaggedAnomalies } from "@/pages/FlaggedAnomalies";
import { ExportReports } from "@/pages/ExportReports";
import { UploadSubmission } from "@/pages/UploadSubmission";
import { TextInput } from "@/pages/TextInput";
import { Review } from "@/pages/Review";
import { Submission } from "@/pages/Submission";
import GetHelp from "@/pages/GetHelp";
import UploadHistory from "@/pages/UploadHistory";
import UploadLog from "@/pages/UploadLog";

function RequireAuth({ children }: { children: JSX.Element }) {
  if (!localStorage.getItem("is_authenticated")) {
    window.location.href = "/signin";
    return null;
  }
  return children;
}

function Router() {
  return (
    <Switch>
      {/* Authentication pages */}
      <Route path="/" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/signin" component={SignIn} />
      
      {/* Dashboard and app pages */}
      <Route path="/dashboard" component={() => <RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/profile" component={() => <RequireAuth><Profile /></RequireAuth>} />
      
      {/* Feature pages */}
      <Route path="/flagged-anomalies" component={() => <RequireAuth><FlaggedAnomalies /></RequireAuth>} />
      <Route path="/export-reports" component={() => <RequireAuth><ExportReports /></RequireAuth>} />
      <Route path="/upload-history" component={() => <RequireAuth><UploadHistory /></RequireAuth>} />
      <Route path="/upload-log" component={() => <RequireAuth><UploadLog /></RequireAuth>} />
      
      {/* Submission workflow pages */}
      <Route path="/upload-submission" component={() => <RequireAuth><UploadSubmission /></RequireAuth>} />
      <Route path="/text-input" component={TextInput} />
      <Route path="/review" component={() => <RequireAuth><Review /></RequireAuth>} />
      <Route path="/submission" component={Submission} />
      {/* Help page */}
      <Route path="/get-help" component={() => <RequireAuth><GetHelp /></RequireAuth>} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
