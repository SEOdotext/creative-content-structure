import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useWebsites } from './WebsitesContext';
import { toast } from 'sonner';

// Define the PostTheme type
export interface PostTheme {
  id: string;
  website_id: string;
  subject_matter: string;
  keywords: string[];
  status: 'pending' | 'generated' | 'published';
  scheduled_date: string;
  created_at: string;
  updated_at: string;
}

// Define the context type
interface PostThemesContextType {
  postThemes: PostTheme[];
  isLoading: boolean;
  error: Error | null;
  fetchPostThemes: () => Promise<void>;
  getPostThemesBySubject: (subject: string) => PostTheme[];
  createPostTheme: (subject: string, keywords: string[]) => Promise<PostTheme | null>;
  updatePostTheme: (id: string, updates: Partial<PostTheme>) => Promise<boolean>;
  deletePostTheme: (id: string) => Promise<boolean>;
}

// Create the context with default values
const PostThemesContext = createContext<PostThemesContextType>({
  postThemes: [],
  isLoading: false,
  error: null,
  fetchPostThemes: async () => {},
  getPostThemesBySubject: () => [],
  createPostTheme: async () => null,
  updatePostTheme: async () => false,
  deletePostTheme: async () => false,
});

// Create the provider component
export const PostThemesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [postThemes, setPostThemes] = useState<PostTheme[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentWebsite } = useWebsites();

  // Fetch post themes when the current website changes
  useEffect(() => {
    if (currentWebsite?.id) {
      fetchPostThemes();
    }
  }, [currentWebsite?.id]);

  // Function to fetch post themes from the database
  const fetchPostThemes = async () => {
    if (!currentWebsite?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('post_themes')
        .select('*')
        .eq('website_id', currentWebsite.id)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;

      setPostThemes(data || []);
      console.log('Fetched post themes:', data);
    } catch (err) {
      console.error('Error fetching post themes:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch post themes'));
      toast.error('Failed to load post themes');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get post themes by subject
  const getPostThemesBySubject = (subject: string): PostTheme[] => {
    return postThemes.filter(theme => theme.subject_matter === subject);
  };

  // Function to create a new post theme
  const createPostTheme = async (subject: string, keywords: string[]): Promise<PostTheme | null> => {
    if (!currentWebsite?.id) {
      toast.error('No website selected');
      return null;
    }

    try {
      // Calculate scheduled date (7 days from now by default)
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + 7);

      const newTheme = {
        website_id: currentWebsite.id,
        subject_matter: subject,
        keywords: keywords,
        status: 'pending' as const,
        scheduled_date: scheduledDate.toISOString()
      };

      const { data, error } = await supabase
        .from('post_themes')
        .insert(newTheme)
        .select()
        .single();

      if (error) throw error;

      setPostThemes(prev => [...prev, data]);
      toast.success(`Post theme for "${subject}" created`);
      return data;
    } catch (err) {
      console.error('Error creating post theme:', err);
      toast.error(`Failed to create post theme for "${subject}"`);
      return null;
    }
  };

  // Function to update a post theme
  const updatePostTheme = async (id: string, updates: Partial<PostTheme>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('post_themes')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setPostThemes(prev => 
        prev.map(theme => theme.id === id ? { ...theme, ...updates } : theme)
      );
      
      toast.success('Post theme updated');
      return true;
    } catch (err) {
      console.error('Error updating post theme:', err);
      toast.error('Failed to update post theme');
      return false;
    }
  };

  // Function to delete a post theme
  const deletePostTheme = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('post_themes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPostThemes(prev => prev.filter(theme => theme.id !== id));
      toast.success('Post theme deleted');
      return true;
    } catch (err) {
      console.error('Error deleting post theme:', err);
      toast.error('Failed to delete post theme');
      return false;
    }
  };

  // Create the context value
  const contextValue: PostThemesContextType = {
    postThemes,
    isLoading,
    error,
    fetchPostThemes,
    getPostThemesBySubject,
    createPostTheme,
    updatePostTheme,
    deletePostTheme
  };

  return (
    <PostThemesContext.Provider value={contextValue}>
      {children}
    </PostThemesContext.Provider>
  );
};

// Create a custom hook to use the context
export const usePostThemes = () => useContext(PostThemesContext); 