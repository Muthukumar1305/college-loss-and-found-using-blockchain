"use client";

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Loader2 } from 'lucide-react';
import { authService } from '@/services/api';
import { showError, showSuccess } from '@/utils/toast';

const UserLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.login(formData);
      showSuccess("Logged in successfully!");
      navigate('/dashboard');
    } catch (error: any) {
      showError(error.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-emerald-100 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-600 p-2 rounded-xl">
              <Search className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-emerald-950">User Login</CardTitle>
          <CardDescription className="text-emerald-700">
            Enter your campus credentials to access the portal
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-emerald-900">Campus Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="student@campus.edu" 
                className="border-emerald-200 focus-visible:ring-emerald-500" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-emerald-900">Password</Label>
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
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Sign In
            </Button>
            <div className="text-center text-sm space-y-2">
              <p className="text-emerald-700">Don't have an account? <Link to="/register" className="text-emerald-600 font-bold hover:underline">Register here</Link></p>
              <Link to="/" className="text-emerald-600 hover:underline block">Back to Home</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default UserLogin;