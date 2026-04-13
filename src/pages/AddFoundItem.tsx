"use client";

import React, { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '@/utils/toast';
import { itemService } from '@/services/api';
import { blockchainService } from '@/services/blockchain';
import { ethers } from 'ethers';
import { Loader2, Database, Plus, Trash2, Image as ImageIcon, ShieldCheck } from 'lucide-react';

const AddFoundItem = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState([{ question: '', answer: '' }]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const addQuestion = () => {
    setQuestions([...questions, { question: '', answer: '' }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, field: 'question' | 'answer', value: string) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const form = e.currentTarget as HTMLFormElement;
      const itemName = (form.elements.namedItem('itemName') as HTMLInputElement).value;
      const location = (form.elements.namedItem('location') as HTMLInputElement).value;
      const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value;
      const date = (form.elements.namedItem('dateFound') as HTMLInputElement).value;

      const formData = new FormData();
      formData.append('name', itemName);
      formData.append('description', description);
      formData.append('location', location);
      formData.append('date', date);
      formData.append('verificationQuestions', JSON.stringify(questions));
      
      if (fileInputRef.current?.files?.[0]) {
        formData.append('image', fileInputRef.current.files[0]);
      }

      // 1. Save to Database
      await itemService.addFoundItem(formData);
      
      // 2. Register on Blockchain
      try {
        const itemFingerprint = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify({
          name: itemName,
          location: location,
          timestamp: Date.now()
        })));
        
        const bcResult = await blockchainService.registerItemOnChain(itemFingerprint);
        showSuccess(`On-chain Record Created! Tx: ${bcResult.transactionHash.substring(0, 10)}...`);
      } catch (bcError) {
        console.error("Blockchain registration failed:", bcError);
        showError("Database saved, but blockchain registration failed. Check MetaMask.");
      }

      showSuccess("Item registered successfully!");
      navigate('/admin/dashboard');
    } catch (error) {
      showError("Failed to register item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50/30">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-emerald-950">Add Found Item</h1>
          <p className="text-emerald-700">Register an item and secure it on the blockchain.</p>
        </div>

        <Card className="border-emerald-200 shadow-sm">
          <CardHeader className="bg-emerald-900 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" /> Blockchain Registration
            </CardTitle>
            <CardDescription className="text-emerald-100">This item will be immutable once registered on the network.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-8 pt-6">
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-emerald-900 border-b border-emerald-100 pb-2">Basic Information</h3>
                
                <div className="space-y-4">
                  <Label className="text-emerald-900">Item Image</Label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-emerald-200 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 transition-colors overflow-hidden min-h-[200px]"
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg object-contain" />
                    ) : (
                      <>
                        <ImageIcon className="h-12 w-12 text-emerald-300 mb-2" />
                        <p className="text-emerald-600 font-medium">Click to upload image</p>
                        <p className="text-xs text-emerald-400">PNG, JPG up to 5MB</p>
                      </>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="item-name" className="text-emerald-900">Item Name *</Label>
                    <Input name="itemName" id="item-name" placeholder="e.g. Silver iPhone 13" className="border-emerald-200" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-emerald-900">Found At *</Label>
                    <Input name="location" id="location" placeholder="e.g. Cafeteria" className="border-emerald-200" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-emerald-900">Description *</Label>
                  <Textarea name="description" id="description" placeholder="Describe the item in detail..." className="border-emerald-200" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="date-found" className="text-emerald-900">Date Found *</Label>
                    <Input name="dateFound" id="date-found" type="date" className="border-emerald-200" required />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                  <h3 className="text-lg font-bold text-emerald-900">Verification Questions</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addQuestion} className="border-emerald-200 text-emerald-700">
                    <Plus className="h-4 w-4 mr-1" /> Add Question
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {questions.map((q, index) => (
                    <div key={index} className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-emerald-800">Question {index + 1}</span>
                        {questions.length > 1 && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeQuestion(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Input 
                          placeholder="Question (e.g. What color is the case?)" 
                          value={q.question}
                          onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                          className="border-emerald-200 bg-white"
                          required
                        />
                        <Input 
                          placeholder="Correct Answer" 
                          value={q.answer}
                          onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                          className="border-emerald-200 bg-white"
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <div className="p-6 border-t border-emerald-100 flex justify-end gap-4">
              <Button type="button" variant="ghost" onClick={() => navigate('/admin/dashboard')} className="text-emerald-700">
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-900 hover:bg-emerald-950 text-white px-8" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Register Item
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default AddFoundItem;