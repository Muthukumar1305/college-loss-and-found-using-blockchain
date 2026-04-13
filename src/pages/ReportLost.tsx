"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '@/utils/toast';
import { itemService } from '@/services/api';
import { Loader2 } from 'lucide-react';

const ReportLost = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    dateLost: '',
    location: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await itemService.reportLost(formData);
      showSuccess("Lost item report submitted successfully!");
      navigate('/dashboard');
    } catch (error: any) {
      showError(error.response?.data?.message || "Failed to submit report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-emerald-950">Report Lost Item</h1>
          <p className="text-emerald-700">Provide as much detail as possible to help us find your item.</p>
        </div>

        <Card className="border-emerald-100">
          <CardHeader>
            <CardTitle className="text-emerald-900">Item Details</CardTitle>
            <CardDescription>All fields marked with * are required.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="item-name" className="text-emerald-900">Item Name *</Label>
                  <Input 
                    id="item-name" 
                    placeholder="e.g. Blue Backpack" 
                    className="border-emerald-200" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-emerald-900">Category *</Label>
                  <Select onValueChange={(val) => setFormData({ ...formData, category: val })} required>
                    <SelectTrigger className="border-emerald-200">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="books">Books/Stationery</SelectItem>
                      <SelectItem value="keys">Keys</SelectItem>
                      <SelectItem value="wallets">Wallets/IDs</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date-lost" className="text-emerald-900">Date Lost *</Label>
                  <Input 
                    id="date-lost" 
                    type="date" 
                    className="border-emerald-200" 
                    value={formData.dateLost}
                    onChange={(e) => setFormData({ ...formData, dateLost: e.target.value })}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-emerald-900">Last Seen Location *</Label>
                  <Input 
                    id="location" 
                    placeholder="e.g. Library 2nd Floor" 
                    className="border-emerald-200" 
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-emerald-900">Detailed Description *</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe color, brand, unique markings, contents, etc." 
                  className="border-emerald-200 min-h-[120px]" 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo" className="text-emerald-900">Upload Photo (Optional)</Label>
                <Input id="photo" type="file" className="border-emerald-200 cursor-pointer" />
                <p className="text-xs text-emerald-600">A photo helps significantly in identifying your item.</p>
              </div>
            </CardContent>
            <div className="p-6 border-t border-emerald-50 flex justify-end gap-4">
              <Button type="button" variant="ghost" onClick={() => navigate('/dashboard')} className="text-emerald-700">
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Submit Report
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default ReportLost;