import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { SignIn } from "@/pages/SignIn";
import { SignUp } from "@/pages/SignUp";
import { Dashboard } from "@/pages/Dashboard";
import { Profile } from "@/pages/Profile";
import { FlaggedAnomalies } from "@/pages/FlaggedAnomalies";
import { ExportReports } from "@/pages/ExportReports";
import { UploadSubmission } from "@/pages/UploadSubmission";
import { TextInput } from "@/pages/TextInput";
import { Review } from "@/pages/Review";
import { Submission } from "@/pages/Submission";

function Router() {
  return (
    <Switch>
      {/* Authentication pages */}
      <Route path="/" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      
      {/* Dashboard and app pages */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/profile" component={Profile} />
      
      {/* Feature pages */}
      <Route path="/flagged-anomalies" component={FlaggedAnomalies} />
      <Route path="/export-reports" component={ExportReports} />
      
      {/* Submission workflow pages */}
      <Route path="/upload-submission" component={UploadSubmission} />
      <Route path="/text-input" component={TextInput} />
      <Route path="/review" component={Review} />
      <Route path="/submission" component={Submission} />
      
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
