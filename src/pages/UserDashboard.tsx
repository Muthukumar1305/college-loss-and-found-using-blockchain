"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Clock, Package } from 'lucide-react';

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-emerald-950">Welcome back, Student</h1>
          <p className="text-emerald-700">Manage your lost item reports and track claims.</p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="border-emerald-100 bg-emerald-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700">Pending Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900">0</div>
            </CardContent>
          </Card>
          <Card className="border-emerald-100 bg-emerald-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700">Items Recovered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900">0</div>
            </CardContent>
          </Card>
          <Card className="border-emerald-100 bg-emerald-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700">Found Items Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900">0</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 max-w-2xl mx-auto gap-8">
          <Card className="border-emerald-100 h-full">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-emerald-950 text-center">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild variant="outline" className="w-full justify-center border-emerald-200 text-emerald-700 hover:bg-emerald-50 py-6 text-lg">
                <Link to="/found-items"><Search className="h-5 w-5 mr-2" /> Browse Found Items</Link>
              </Button>
              <div className="pt-6 border-t border-emerald-50 text-center mt-6">
                <h4 className="text-sm font-semibold text-emerald-900 mb-2">Campus Security Contact</h4>
                <p className="text-sm text-emerald-700">Main Office: (555) 123-4567</p>
                <p className="text-sm text-emerald-700">Email: security@campus.edu</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;