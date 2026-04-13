"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, HelpCircle, ArrowLeft, ShieldAlert } from 'lucide-react';
import { claimService, itemService } from '@/services/api';
import { showError, showSuccess } from '@/utils/toast';
import Navbar from '@/components/Navbar';

const ClaimVerification = () => {
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get('itemId');
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<{id: string, question: string}[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!itemId) {
        navigate('/found-items');
        return;
      }
      
      setIsLoading(true);
      try {
        const questionsData = await itemService.getVerificationQuestions(itemId);
        setQuestions(questionsData);
      } catch (err) {
        showError("Failed to load verification questions");
        navigate('/found-items');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [itemId, navigate]);

  const handleInputChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemId) return;
    
    setIsSubmitting(true);
    try {
      const response = await claimService.submitAnswers(itemId, answers);
      showSuccess("Answers verified! QR Code generated.");
      navigate(`/verify?claimId=${response._id || response.claimId}`);
    } catch (error: any) {
      showError(error.response?.data?.message || "Verification failed. Please check your answers.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50/30">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6 text-emerald-700 hover:text-emerald-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Items
        </Button>

        <Card className="border-emerald-200 shadow-xl bg-white overflow-hidden">
          <div className="h-2 bg-emerald-600" />
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <HelpCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-emerald-950">Ownership Verification</CardTitle>
            </div>
            <CardDescription className="text-emerald-700">
              To prevent unauthorized claims, please answer the following questions set by the person who found the item.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center py-12">
                <Loader2 className="h-8 w-8 text-emerald-600 animate-spin mb-4" />
                <p className="text-emerald-600 font-medium">Loading security questions...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {questions.map((q, index) => (
                  <div key={q.id} className="space-y-2">
                    <Label htmlFor={q.id} className="text-emerald-900 font-semibold">
                      Question {index + 1}: {q.question}
                    </Label>
                    <Input 
                      id={q.id}
                      placeholder="Your answer..."
                      className="border-emerald-200 focus-visible:ring-emerald-500 h-12"
                      value={answers[q.id] || ''}
                      onChange={(e) => handleInputChange(q.id, e.target.value)}
                      required
                    />
                  </div>
                ))}
                
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
                  <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-800">
                    Note: Answers must match exactly (case-insensitive) what was recorded by the finder.
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-lg font-semibold rounded-xl transition-all"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                  Submit for Verification
                </Button>
              </form>
            )}
          </CardContent>
          
          <CardFooter className="bg-emerald-50/50 py-4 flex justify-center">
            <p className="text-xs text-emerald-600 text-center px-6">
              False claims may lead to account suspension.
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default ClaimVerification;