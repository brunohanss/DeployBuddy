import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vmdpxaongmlurzagvitd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtZHB4YW9uZ21sdXJ6YWd2aXRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE1Njk3OTQsImV4cCI6MjAzNzE0NTc5NH0.kzpNmEv5i9Uc5KovWxZPpeddjr_yUzLDzYX8bKKJXLg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
