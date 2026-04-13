"use client";

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Loader2 } from 'lucide-react';
import { authService } from '@/services/api';
import { showError, showSuccess } from '@/utils/toast';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await authService.login(formData);
      
      if (user.role !== 'admin') {
        showError("Access denied. This portal is for administrators only.");
        authService.logout();
        return;
      }
      
      showSuccess("Authenticated successfully!");
      navigate('/admin/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || "Connection error. Please ensure the server is running.";
      showError(message);
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-emerald-800 bg-white shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-900 p-2 rounded-xl">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-emerald-950">Admin Portal</CardTitle>
          <CardDescription className="text-emerald-700">
            Authorized personnel only
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-emerald-900">Admin Email</Label>
              <Input 
                id="email" 
                type="email"
                placeholder="admin@campus.edu" 
                className="border-emerald-200 focus-visible:ring-emerald-500" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-emerald-900">Security Key</Label>
              <Input 
                id="password" 
                type="password" 
                className="border-emerald-200 focus-visible:ring-emerald-500" 
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required 
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full bg-emerald-900 hover:bg-emerald-950 text-white" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Authenticate
            </Button>
            <div className="text-center text-sm">
              <Link to="/" className="text-emerald-600 hover:underline">Back to Home</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;