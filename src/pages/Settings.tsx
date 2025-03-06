
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Toaster } from "@/components/ui/sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSettings } from '@/context/SettingsContext';
import { toast } from 'sonner';
import { X, Plus, Loader2 } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

const Settings = () => {
  const { publicationFrequency, setPublicationFrequency, writingStyle, setWritingStyle, subjectMatters, setSubjectMatters, isLoading } = useSettings();
  const [frequency, setFrequency] = useState(publicationFrequency);
  const [styleInput, setStyleInput] = useState(writingStyle);
  const [subjects, setSubjects] = useState<string[]>(subjectMatters);
  const [newSubject, setNewSubject] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Update local state when settings are loaded from context
  useEffect(() => {
    if (!isLoading) {
      setFrequency(publicationFrequency);
      setStyleInput(writingStyle);
      setSubjects(subjectMatters);
    }
  }, [isLoading, publicationFrequency, writingStyle, subjectMatters]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      setPublicationFrequency(frequency);
      setWritingStyle(styleInput);
      setSubjectMatters(subjects);
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      setSubjects([...subjects, newSubject.trim()]);
      setNewSubject('');
    }
  };

  const handleRemoveSubject = (subject: string) => {
    setSubjects(subjects.filter(s => s !== subject));
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto p-6">
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Settings</h1>
              </div>
              
              {isLoading ? (
                // Loading skeletons
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2 mt-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2 mt-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2 mt-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                        <div className="flex flex-wrap gap-2">
                          <Skeleton className="h-8 w-24 rounded-full" />
                          <Skeleton className="h-8 w-32 rounded-full" />
                          <Skeleton className="h-8 w-28 rounded-full" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                // Actual settings content
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Publication Settings</CardTitle>
                      <CardDescription>
                        Configure how often content should be scheduled for publication
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="frequency">Publication Frequency (days between posts)</Label>
                        <div className="flex gap-2">
                          <Input 
                            id="frequency" 
                            type="number" 
                            min="1" 
                            max="90" 
                            value={frequency} 
                            onChange={(e) => setFrequency(parseInt(e.target.value || "7", 10))}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Content Style</CardTitle>
                      <CardDescription>
                        Define the writing style for your content
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="writingStyle">Writing Style</Label>
                        <Input 
                          id="writingStyle" 
                          value={styleInput} 
                          onChange={(e) => setStyleInput(e.target.value)}
                          placeholder="Enter your preferred writing style"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Subject Matters</CardTitle>
                      <CardDescription>
                        Define the topics and subject areas for your content
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="subjectMatters">Add Subject Matters</Label>
                        <div className="flex gap-2">
                          <Input 
                            id="subjectMatters" 
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                            placeholder="Enter a subject matter"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddSubject();
                              }
                            }}
                          />
                          <Button onClick={handleAddSubject}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {subjects.map((subject) => (
                          <div
                            key={subject}
                            className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-2"
                          >
                            {subject}
                            <button 
                              onClick={() => handleRemoveSubject(subject)}
                              className="text-secondary-foreground/70 hover:text-secondary-foreground"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end">
                    <Button 
                      size="lg" 
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      Save All Settings
                    </Button>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
};

export default Settings;
