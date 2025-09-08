/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // add more VITE_ variables here if you need
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
