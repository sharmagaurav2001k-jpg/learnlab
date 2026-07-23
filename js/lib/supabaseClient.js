// Supabase client (singleton). The publishable key is safe to expose in the
// browser — all data access is protected by Row Level Security policies.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
const SUPABASE_URL='https://fvxyicvpyvsrkmeiezga.supabase.co'
const SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eHlpY3ZweXZzcmttZWllemdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyMTU3NDcsImV4cCI6MjA5ODc5MTc0N30.Mwhie11VyPMLpy6JOHLb_P5NIIK-SwyaM-PmtaXEhgU'
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Expose for cross-module access from non-module inline handlers
window.sb = supabase;
