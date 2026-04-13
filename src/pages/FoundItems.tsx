"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, PackageSearch, Loader2, MapPin, Calendar, Smartphone, ShieldCheck } from 'lucide-react';
import { itemService } from '@/services/api';
import { Link } from 'react-router-dom';

const FoundItems = () => {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const data = await itemService.getFoundItems();
        setItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter(item => 
    (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-emerald-950">Found Items</h1>
            <p className="text-emerald-700">Browse items that have been turned in to campus security.</p>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
              <Input 
                placeholder="Search items..." 
                className="pl-10 border-emerald-200" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border-emerald-200 text-emerald-700">
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-12 w-12 text-emerald-600 animate-spin" />
          </div>
        ) : filteredItems.length === 0 ? (
          <Card className="border-emerald-100">
            <CardContent className="flex flex-col items-center justify-center py-24 text-center">
              <div className="bg-emerald-50 p-6 rounded-full mb-6">
                <PackageSearch className="h-12 w-12 text-emerald-300" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-900">No items found</h3>
              <p className="text-emerald-600 max-w-md mx-auto mt-3">
                There are currently no items in the found database.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item._id} className="border-emerald-100 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-emerald-50 flex items-center justify-center border-b border-emerald-50">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <Smartphone className="h-16 w-16 text-emerald-200" />
                  )}
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold text-emerald-950">{item.name}</CardTitle>
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">
                      Found
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pb-4">
                  <div className="flex items-center text-sm text-emerald-700">
                    <MapPin className="h-4 w-4 mr-2 text-emerald-400" />
                    {item.location}
                  </div>
                  <div className="flex items-center text-sm text-emerald-700">
                    <Calendar className="h-4 w-4 mr-2 text-emerald-400" />
                    Found on {new Date(item.date).toLocaleDateString()}
                  </div>
                  <p className="text-sm text-emerald-600 line-clamp-2 mt-2">
                    {item.description}
                  </p>
                </CardContent>
                <CardFooter className="bg-emerald-50/50 border-t border-emerald-50 p-4">
                  <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Link to={`/claim-verify?itemId=${item._id}`}>
                      <ShieldCheck className="h-4 w-4 mr-2" /> Claim Ownership
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FoundItems;