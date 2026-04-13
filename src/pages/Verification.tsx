"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, ArrowLeft, Link as LinkIcon } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import Navbar from '@/components/Navbar';

const Verification = () => {
  const [searchParams] = useSearchParams();
  const claimId = searchParams.get('claimId') || '';
  const navigate = useNavigate();
  
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    const generateQr = async () => {
      if (!claimId) {
        showError("Invalid claim reference.");
        navigate('/found-items');
        return;
      }
      try {
        const url = await QRCode.toDataURL(claimId);
        setQrDataUrl(url);
        // Toast shows smoothly without blocking rendering.
      } catch (err) {
        showError("Failed to generate QR code.");
      }
    };
    generateQr();
  }, [claimId, navigate]);

  return (
    <div className="min-h-screen bg-emerald-50/30">
      <Navbar />
      <main className="max-w-md mx-auto px-4 py-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/found-items')} 
          className="mb-6 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Items
        </Button>

        <Card className="border-emerald-200 shadow-xl bg-white">
          <CardHeader className="text-center border-b border-emerald-50 pb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg shadow-emerald-100">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-emerald-950">Claim Verification</CardTitle>
            <CardDescription className="text-emerald-700">
              Your claim answers were correct. A QR code has been generated for admin approval.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-8 flex flex-col items-center justify-center">
            <div className="p-4 bg-white border-2 border-emerald-100 rounded-3xl shadow-inner mb-4">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="Verification QR Code" className="w-48 h-48" />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
                </div>
              )}
            </div>
            <p className="text-sm text-emerald-700 font-semibold mb-2">QR code generated successfully.</p>
            <p className="text-xs text-emerald-500 text-center px-4">
              Show this QR code to the admin so they can verify and complete the claim exchange.
            </p>
          </CardContent>

          <CardFooter className="bg-emerald-50/50 rounded-b-xl py-4 flex flex-col items-center gap-2">
            <div className="flex items-center gap-1 text-[10px] text-emerald-500 uppercase tracking-wider font-bold">
              <LinkIcon className="h-3 w-3" /> Secured by Ethereum
            </div>
            <p className="text-xs text-emerald-600 text-center px-6">
              This verification ensures the item is returned to its rightful owner.
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default Verification;