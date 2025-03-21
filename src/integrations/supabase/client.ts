
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qxwlcoaqbdmqodgwhlei.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4d2xjb2FxYmRtcW9kZ3dobGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MDMyMjcsImV4cCI6MjA1NzQ3OTIyN30.-xI5VftnFkl3roRWarkyRiKGzBiyIoS5ivNg78SDWLo";

// API URL for FastAPI backend
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
