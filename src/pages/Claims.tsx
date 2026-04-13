"use client";

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, CheckCircle2, XCircle, QrCode, Camera } from 'lucide-react';
import { claimService } from '@/services/api';
import { showSuccess, showError } from '@/utils/toast';
import QrScanner from 'qr-scanner';

interface Claim {
  _id: string;
  userId: { name: string; email: string };
  itemId: { name: string; location: string };
  status: string;
  qrCode?: string;
  verified: boolean;
  createdAt: string;
}

const Claims = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [scanningClaimId, setScanningClaimId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    fetchClaims();
  }, []);

  useEffect(() => {
    const filtered = claims.filter(claim =>
      claim.itemId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.userId.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClaims(filtered);
  }, [claims, searchTerm]);

  const fetchClaims = async () => {
    try {
      const data = await claimService.getClaims();
      setClaims(data);
    } catch (error) {
      showError('Failed to fetch claims');
    }
  };

  const startScanning = async (claimId?: string) => {
    setScanningClaimId(claimId || 'global');
    setIsScanning(true);

    try {
      if (videoRef.current) {
        scannerRef.current = new QrScanner(
          videoRef.current,
          (result) => handleScanResult(result, claimId),
          {
            onDecodeError: (err) => console.log('QR scan error:', err),
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        );
        await scannerRef.current.start();
      }
    } catch (error) {
      showError('Failed to start camera');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    setIsScanning(false);
    setScanningClaimId(null);
  };

  const handleScanResult = async (result: QrScanner.ScanResult, claimId?: string) => {
    stopScanning();
    const scannedData = result.data;
    const targetClaimId = claimId ? claimId : scannedData;

    try {
      // Verify QR code matches the claim
      const response = await claimService.verifyQR(targetClaimId, scannedData);
      if (response.success) {
        showSuccess('Claim approved successfully!');
        fetchClaims(); // Refresh claims list
      } else {
        showError('QR code does not match this claim');
      }
    } catch (error) {
      showError('Failed to verify QR code');
    }
  };

  const approveClaim = async (claimId: string) => {
    try {
      await claimService.approveClaim(claimId);
      showSuccess('Claim approved successfully!');
      fetchClaims();
    } catch (error) {
      showError('Failed to approve claim');
    }
  };

  const rejectClaim = async (claimId: string) => {
    try {
      await claimService.rejectClaim(claimId);
      showSuccess('Claim rejected');
      fetchClaims();
    } catch (error) {
      showError('Failed to reject claim');
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50/30">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-emerald-950">Claim Management</h1>
            <p className="text-emerald-700">Review and verify ownership claims for found items.</p>
          </div>
          <div className="relative w-full md:w-auto flex flex-col md:flex-row items-center gap-3">
             <Button onClick={() => startScanning()} className="bg-emerald-600 hover:bg-emerald-700 w-full md:w-auto">
               <QrCode className="h-4 w-4 mr-2" /> Global QR Scan
             </Button>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
              <Input
                placeholder="Search claims..."
                className="pl-10 border-emerald-200 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isScanning && (
          <Card className="border-emerald-200 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Scanning QR Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <video
                  ref={videoRef}
                  className="w-full max-w-md border border-emerald-200 rounded-lg"
                  playsInline
                  muted
                />
                <Button onClick={stopScanning} variant="outline">
                  Cancel Scanning
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {filteredClaims.length === 0 ? (
          <Card className="border-emerald-200">
            <CardContent className="flex flex-col items-center justify-center py-24 text-center">
              <div className="bg-emerald-100 p-6 rounded-full mb-6">
                <Users className="h-12 w-12 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-900">No pending claims</h3>
              <p className="text-emerald-600 max-w-md mx-auto mt-3">
                There are currently no ownership claims awaiting review. All cases are up to date.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredClaims.map((claim) => (
              <Card key={claim._id} className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{claim.itemId.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                      claim.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      claim.qrCode ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {claim.status === 'pending' && claim.qrCode ? 'Ready for QR Scan' : claim.status}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-emerald-600">Claimant</p>
                      <p className="font-medium">{claim.userId.name}</p>
                      <p className="text-sm text-emerald-500">{claim.userId.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-emerald-600">Item Location</p>
                      <p className="font-medium">{claim.itemId.location}</p>
                      <p className="text-sm text-emerald-500">
                        Claimed on {new Date(claim.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {claim.status === 'pending' && claim.qrCode && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => startScanning(claim._id)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <QrCode className="h-4 w-4 mr-2" />
                        Scan QR Code
                      </Button>
                      <Button
                        onClick={() => approveClaim(claim._id)}
                        variant="outline"
                        className="border-green-500 text-green-600 hover:bg-green-50"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => rejectClaim(claim._id)}
                        variant="outline"
                        className="border-red-500 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                  {claim.status === 'pending' && !claim.qrCode && (
                    <p className="text-sm text-amber-600 italic">
                      Waiting for claimant to verify OTP and generate QR code
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-emerald-100 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Approved Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900">
                {claims.filter(c => c.status === 'approved' && new Date(c.createdAt).toDateString() === new Date().toDateString()).length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-emerald-100 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700 flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-400" /> Pending Claims
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900">
                {claims.filter(c => c.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-emerald-100 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700 flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-400" /> Rejected Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900">
                {claims.filter(c => c.status === 'rejected' && new Date(c.createdAt).toDateString() === new Date().toDateString()).length}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Claims;