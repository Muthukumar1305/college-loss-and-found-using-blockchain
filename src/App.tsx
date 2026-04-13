import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import UserLogin from "./pages/UserLogin";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import UserDashboard from "./pages/UserDashboard";
import ReportLost from "./pages/ReportLost";
import FoundItems from "./pages/FoundItems";
import AdminDashboard from "./pages/AdminDashboard";
import AddFoundItem from "./pages/AddFoundItem";
import Claims from "./pages/Claims";
import Verification from "./pages/Verification";
import ClaimVerification from "./pages/ClaimVerification";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/report-lost" element={<ReportLost />} />
          <Route path="/found-items" element={<FoundItems />} />
          <Route path="/claim-verify" element={<ClaimVerification />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/add-found" element={<AddFoundItem />} />
          <Route path="/admin/claims" element={<Claims />} />
          <Route path="/verify" element={<Verification />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;