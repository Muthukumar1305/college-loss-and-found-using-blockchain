"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { PlusCircle, ClipboardList, CheckCircle2, AlertCircle, Users, Smartphone } from 'lucide-react';
import { itemService } from '@/services/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
const AdminDashboard = () => {
  const [items, setItems] = useState<any[]>([]);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await itemService.getFoundItems();
        setItems(data);
        setItemCount(data.length);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-emerald-50/30">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-emerald-950">Admin Dashboard</h1>
            <p className="text-emerald-700">System overview and management portal.</p>
          </div>
          <Button asChild className="bg-emerald-900 hover:bg-emerald-950 text-white">
            <Link to="/admin/add-found"><PlusCircle className="h-4 w-4 mr-2" /> Add Found Item</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-emerald-200 bg-white">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-emerald-700">Total Lost Reports</CardTitle>
              <AlertCircle className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900">0</div>
            </CardContent>
          </Card>
          <Card className="border-emerald-200 bg-white">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-emerald-700">Total Found Items</CardTitle>
              <ClipboardList className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900">{itemCount}</div>
            </CardContent>
          </Card>
          <Card className="border-emerald-200 bg-white">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-emerald-700">Pending Claims</CardTitle>
              <Users className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900">0</div>
            </CardContent>
          </Card>
          <Card className="border-emerald-200 bg-white">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-emerald-700">Resolved Cases</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900">0</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-emerald-950">Recent Found Items</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-emerald-50">
                {items.length === 0 ? (
                  <div className="p-4 text-center text-emerald-600 italic">No items found</div>
                ) : (
                  items.slice(0, 5).map((item) => (
                    <div key={item._id} className="p-4 flex items-center justify-between hover:bg-emerald-50/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="bg-emerald-100 p-2 rounded-lg">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-5 h-5 rounded" />
                          ) : (
                            <Smartphone className="h-5 w-5 text-emerald-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-emerald-900">{item.name}</p>
                          <p className="text-xs text-emerald-600">{item.location} • {new Date(item.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-emerald-600 hover:bg-emerald-100 hover:text-emerald-800 transition-colors">View Details</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md border-emerald-200">
                          <DialogHeader>
                            <DialogTitle className="text-emerald-950 text-xl">{item.name}</DialogTitle>
                            <DialogDescription className="text-emerald-600 font-medium">
                              Found at {item.location} • {new Date(item.date).toLocaleDateString()}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4 space-y-4">
                            <div>
                              <h4 className="text-sm font-semibold text-emerald-900 border-b border-emerald-100 pb-1 mb-2">Description</h4>
                              <p className="text-sm text-emerald-800 leading-relaxed whitespace-pre-wrap">{item.description}</p>
                            </div>
                            {item.verificationQuestions && item.verificationQuestions.length > 0 && (
                              <div className="mt-4">
                                <h4 className="text-sm font-semibold text-emerald-900 border-b border-emerald-100 pb-1 mb-2">Security Questions</h4>
                                <div className="space-y-3">
                                  {item.verificationQuestions.map((q: any, i: number) => (
                                    <div key={i} className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 text-sm">
                                      <p className="font-semibold text-emerald-950 mb-1"><span className="text-emerald-600 mr-2">Q:</span>{q.question}</p>
                                      <p className="text-emerald-800"><span className="text-emerald-600 font-semibold mr-2">A:</span>{q.answer}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-emerald-950">Recent Claims</CardTitle>
            </CardHeader>
            <CardContent className="py-12 text-center">
              <p className="text-emerald-600 italic">No recent claims to display.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;