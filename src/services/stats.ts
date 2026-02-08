import { createClient } from '@supabase/supabase-js';
import config from '../config';

// Create Supabase client (only if configured)
const supabase = config.isSupabaseConfigured
  ? createClient(config.supabaseUrl, config.supabaseAnonKey)
  : null;

export interface VaultStats {
  walletCount: number;
  totalQuaiSecured: string; // Keep as string due to large numbers
  isLive: boolean; // Whether stats are from live data or placeholders
}

// Default placeholder stats when Supabase is not configured
const PLACEHOLDER_STATS: VaultStats = {
  walletCount: 0,
  totalQuaiSecured: '0',
  isLive: false,
};

/**
 * Fetch vault stats from Supabase using the configured schema
 */
export async function fetchVaultStats(): Promise<VaultStats> {
  const schema = config.supabaseSchema;
  if (!supabase) {
    console.warn('Supabase not configured, returning placeholder stats');
    return PLACEHOLDER_STATS;
  }

  try {
    // Fetch wallet count
    const { count: walletCount, error: walletError } = await supabase
      .schema(schema)
      .from('wallets')
      .select('*', { count: 'exact', head: true });

    if (walletError) {
      console.error('Error fetching wallet count:', walletError);
      return PLACEHOLDER_STATS;
    }

    // Fetch deposits to calculate total QUAI secured
    // Note: amount is stored as TEXT (wei), so we need to fetch and sum
    const { data: deposits, error: depositsError } = await supabase
      .schema(schema)
      .from('deposits')
      .select('amount');

    if (depositsError) {
      console.error('Error fetching deposits:', depositsError);
      return {
        walletCount: walletCount ?? 0,
        totalQuaiSecured: '0',
        isLive: true,
      };
    }

    // Sum all deposit amounts (handling big numbers as strings)
    const totalWei = deposits?.reduce((sum, deposit) => {
      return sum + BigInt(deposit.amount || '0');
    }, BigInt(0)) ?? BigInt(0);

    // Convert wei to QUAI (18 decimals)
    const totalQuai = formatQuaiAmount(totalWei);

    return {
      walletCount: walletCount ?? 0,
      totalQuaiSecured: totalQuai,
      isLive: true,
    };
  } catch (error) {
    console.error('Error fetching vault stats:', error);
    return PLACEHOLDER_STATS;
  }
}

/**
 * Format wei amount to human-readable QUAI
 * @param weiAmount - Amount in wei as BigInt
 */
function formatQuaiAmount(weiAmount: bigint): string {
  const decimals = 18;
  const divisor = BigInt(10 ** decimals);
  const wholePart = weiAmount / divisor;
  const fractionalPart = weiAmount % divisor;

  // Format with 2 decimal places for display
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0').slice(0, 2);

  // Add thousands separator to whole part
  const wholeFormatted = wholePart.toLocaleString('en-US');

  if (fractionalStr === '00') {
    return wholeFormatted;
  }

  return `${wholeFormatted}.${fractionalStr}`;
}
