/**
 * Application configuration
 * Values can be overridden via environment variables (VITE_ prefix required for client-side)
 */

export const config = {
  // Site URLs
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://quaivault.org',
  appUrl: import.meta.env.VITE_APP_URL || 'https://testnet.quaivault.org',

  // GitHub repository
  githubRepo: import.meta.env.VITE_GITHUB_REPO || 'Quai-Vault/quai-multisig-www',

  // Supabase (for stats queries)
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',

  // Check if Supabase is configured
  get isSupabaseConfigured() {
    return Boolean(this.supabaseUrl && this.supabaseAnonKey);
  },

  // Derived URLs
  get githubUrl() {
    return `https://github.com/${this.githubRepo}`;
  },

  get githubIssuesUrl() {
    return `${this.githubUrl}/issues`;
  },

  get createVaultUrl() {
    return `${this.appUrl}/create`;
  },
} as const;

export default config;
