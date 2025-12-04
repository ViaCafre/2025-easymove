import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://daenefzzamswlrjdblut.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhZW5lZnp6YW1zd2xyamRibHV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NzMxMzMsImV4cCI6MjA4MDM0OTEzM30.S8b7tKxqty3sKerpaFD90HlhOCJuJ3PPMiDV6r2qXYE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
