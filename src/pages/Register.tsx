"use client";

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Loader2 } from 'lucide-react';
import { authService } from '@/services/api';
import { showError, showSuccess } from '@/utils/toast';

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    confirmPassword: ''
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      showError("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    try {
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      showSuccess("Account created successfully!");
      navigate('/dashboard');
    } catch (error: any) {
      showError(error.response?.data?.message || "Registration failed. Please try again.");
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
              <UserPlus className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-emerald-950">Create Account</CardTitle>
          <CardDescription className="text-emerald-700">
            Join the campus lost and found community
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-emerald-900">Full Name</Label>
              <Input 
                id="name" 
                placeholder="John Doe" 
                className="border-emerald-200 focus-visible:ring-emerald-500" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required 
              />
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-emerald-900">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                className="border-emerald-200 focus-visible:ring-emerald-500" 
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required 
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Register
            </Button>
            <div className="text-center text-sm">
              <p className="text-emerald-700">Already have an account? <Link to="/login" className="text-emerald-600 font-bold hover:underline">Login here</Link></p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;