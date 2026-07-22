// Supabase client (singleton). The publishable key is safe to expose in the
// browser — all data access is protected by Row Level Security policies.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://fvxyicvpyvsrkmeiezga.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_-zVApcKM-Ly_MjPBwzMapg_hPoDG9yJ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Expose for cross-module access from non-module inline handlers
window.sb = supabase;
