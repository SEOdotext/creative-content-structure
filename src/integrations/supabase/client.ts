// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vehcghewfnjkwlwmmrix.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlaGNnaGV3Zm5qa3dsd21tcml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDQzODMsImV4cCI6MjA1NjgyMDM4M30.EOH52BJNUdvWQ66htgH4oAvXA6C9-VySeC21qqKcKsY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);