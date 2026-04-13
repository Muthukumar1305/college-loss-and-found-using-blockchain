"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, PlusCircle, LayoutDashboard, LogIn, ShieldCheck, Home } from 'lucide-react';
import { cn } from "@/lib/utils";

const Navbar = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const navItems = isAdmin ? [
    { path: '/admin/dashboard', label: 'Admin Dash', icon: LayoutDashboard },
    { path: '/admin/add-found', label: 'Add Found', icon: PlusCircle },
    { path: '/admin/claims', label: 'Claims', icon: Search },
  ] : [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/found-items', label: 'Found Items', icon: Search },
  ];

  return (
    <nav className="bg-white border-b border-emerald-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-emerald-600 p-1.5 rounded-lg">
                <Search className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-emerald-900 hidden sm:block">CampusFound</span>
            </Link>
          </div>

          <div className="flex items-center gap-1 sm:gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden md:block">{item.label}</span>
              </Link>
            ))}
            
            <div className="h-6 w-px bg-emerald-100 mx-2" />
            
            <Link
              to={isAdmin ? "/admin/login" : "/login"}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-emerald-600 hover:bg-emerald-50"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden md:block">Logout</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;