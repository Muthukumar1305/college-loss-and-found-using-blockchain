"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-emerald-50 py-16 px-4 sm:px-6 lg:px-8 border-b border-emerald-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-600 rounded-2xl mb-6 shadow-lg shadow-emerald-200">
            <Search className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-emerald-950 tracking-tight mb-4">
            Campus Lost & Found
          </h1>
          <p className="text-lg text-emerald-800 max-w-2xl mx-auto mb-10">
            A centralized platform for students and staff to report lost items and reclaim found belongings within the campus community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8">
              <Link to="/login">User Portal</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-full px-8">
              <Link to="/admin/login">Admin Access</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
              <PlusCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-emerald-900 mb-3">Report Lost Items</h3>
            <p className="text-emerald-700 mb-6">Lost something? File a report with details and photos to help us identify it when it's found.</p>
            <Link to="/login" className="text-emerald-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
              <Search className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-emerald-900 mb-3">Browse Found Items</h3>
            <p className="text-emerald-700 mb-6">Check our database of items turned in by fellow students and campus security.</p>
            <Link to="/login" className="text-emerald-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
              View Items <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-emerald-900 mb-3">Secure Claims</h3>
            <p className="text-emerald-700 mb-6">Our verification process ensures that items are returned safely to their rightful owners.</p>
            <Link to="/admin/login" className="text-emerald-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
              Admin Portal <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-emerald-900 text-emerald-100 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="mb-4">© 2024 Campus Lost & Found System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;