import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import VaultScene from '../components/VaultScene'
import { useTheme } from '../contexts/ThemeContext'
import config from '../config'
import { fetchVaultStats } from '../services/stats'
import type { VaultStats } from '../services/stats'

export default function Home() {
  const sectionsRef = useRef<HTMLElement[]>([])
  const { theme } = useTheme()
  const [stats, setStats] = useState<VaultStats | null>(null)

  // Fetch live stats from Supabase
  useEffect(() => {
    fetchVaultStats().then(setStats).catch(console.error)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Fixed 3D Background for entire page */}
      <VaultScene />

      <main className="relative z-10 bg-vault-ambient bg-vault-mesh">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 ${
            theme === 'dark'
              ? 'bg-[#1a1a1a]/80 border-[#222222]'
              : 'bg-white/80 border-gray-200 shadow-sm'
          }`}>
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-dark-400 text-sm">Live on Orchard Testnet</span>
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-dark-100 mb-6">
            Secure Your Assets with{' '}
            <span className="text-gradient-red vault-text-glow">Multi-Signature</span>{' '}
            Protection
          </h1>

          <p className="text-dark-400 text-lg sm:text-xl max-w-3xl mx-auto mb-6">
            Quai Vault is a decentralized multisig wallet that requires multiple
            approvals before any transaction can execute. Like a digital safe that
            requires multiple keys to open.
          </p>

          <p className="text-dark-500 text-sm max-w-2xl mx-auto mb-10">
            Currently in public testing on Quai's Orchard Testnet. Fully functional for testing purposes.
            Mainnet deployment coming after security audits.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={config.appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-lg px-8 py-4 flex items-center gap-2"
            >
              Launch App
              <ArrowRight className="w-5 h-5" />
            </a>
            <Link
              to="/docs"
              className="btn-secondary text-lg px-8 py-4"
            >
              View Documentation
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8">
            {[
              { value: '100%', label: 'Open Source', isLive: false },
              { value: stats?.walletCount?.toString() ?? '—', label: 'Active Vaults', isLive: stats?.isLive },
              { value: stats?.totalQuaiSecured ? `${stats.totalQuaiSecured} QUAI` : '—', label: 'Total Secured', isLive: stats?.isLive },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display font-bold text-3xl md:text-4xl text-gradient-red">
                  {stat.value}
                </div>
                <div className="text-dark-500 text-sm mt-1 flex items-center justify-center gap-1">
                  {stat.label}
                  {stat.isLive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" title="Live data" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
    </main>
    </>
  )
}
