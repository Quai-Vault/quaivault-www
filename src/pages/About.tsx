import { Link } from 'react-router-dom'
import {
  Shield,
  Zap,
  Users,
  Lock,
  Code,
  RefreshCw,
  CheckCircle,
  Server,
  Globe,
  Building,
  Wallet,
  FileText,
} from 'lucide-react'
import VaultScene from '../components/VaultScene'
import { useTheme } from '../contexts/ThemeContext'
import config from '../config'

export default function About() {
  const { theme } = useTheme()

  const features = [
    {
      icon: Users,
      title: 'Multi-Owner Control',
      description: 'Configure multiple owners with customizable approval thresholds. No single point of failure.',
    },
    {
      icon: Zap,
      title: 'Transaction Management',
      description: '5-state transaction lifecycle with propose, approve, execute, cancel, and expire. Full control with hash-based unordered execution.',
    },
    {
      icon: Lock,
      title: 'Native Timelocks',
      description: 'Vault-level and per-transaction execution delays. Configurable time windows before transactions can execute.',
    },
    {
      icon: RefreshCw,
      title: 'Token Support',
      description: 'Hold and manage ERC-20 tokens, ERC-721 NFTs, and ERC-1155 multi-tokens natively in your vault.',
    },
    {
      icon: Code,
      title: 'Zodiac Compatible',
      description: 'Full Zodiac IAvatar compliance enables DAO treasury management, governance integration, and extensible modules including Social Recovery.',
    },
    {
      icon: Shield,
      title: 'Contract Signatures',
      description: 'EIP-1271 message signing via multisig consensus. Sign and unsign messages through the standard approval flow.',
    },
    {
      icon: Globe,
      title: 'Real-Time Indexer',
      description: 'Supabase-powered indexer tracks all vault events in real time — transactions, approvals, token transfers, and more.',
    },
    {
      icon: Shield,
      title: 'DelegateCall Hardening',
      description: 'DelegateCall disabled by default to prevent storage corruption attacks. Opt-in only when needed for MultiSend batching.',
    },
  ]

  const useCases = [
    {
      icon: Users,
      title: 'Team Wallets',
      description: 'Organizations can manage funds with multiple authorized signers, ensuring no single person has unilateral control.',
    },
    {
      icon: Lock,
      title: 'High-Value Storage',
      description: 'Extra security layer for significant amounts of QUAI, requiring multiple approvals before any movement.',
    },
    {
      icon: Building,
      title: 'DAO Treasuries',
      description: 'Full Zodiac IAvatar compatibility enables seamless integration with governance ecosystems like MolochDAO, DAOhaus, and Snapshot+SafeSnap.',
    },
    {
      icon: Wallet,
      title: 'Escrow Services',
      description: 'Multi-party escrow scenarios where funds require approval from multiple parties before release.',
    },
  ]

  const decentralizationBenefits = [
    { title: 'On-Chain Authority', description: 'All wallet operations are enforced by immutable smart contracts — no off-chain intermediaries' },
    { title: 'Self-Hostable', description: 'The entire frontend and indexer can run on your own infrastructure' },
    { title: 'Censorship Resistant', description: 'No single entity can block or control your wallet' },
    { title: 'Open Source', description: 'All contracts, indexer, and frontend code are publicly auditable' },
  ]

  return (
    <>
      <VaultScene />

      <main className="relative z-10 bg-vault-ambient bg-vault-mesh">
        {/* Header */}
        <section className="relative pt-32 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/"
              className="text-primary-500 hover:text-primary-400 mb-6 inline-flex items-center gap-2 transition-colors font-semibold"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-dark-100 mb-4">
              About <span className="text-gradient-red">Quai Vault</span>
            </h1>
            <p className="text-xl text-dark-400">
              Decentralized Multisig Solution for Quai Network
            </p>
          </div>
        </section>

        {/* What is Quai Vault */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="vault-panel p-8">
              <h2 className="font-display font-bold text-2xl text-dark-100 mb-6 flex items-center gap-3">
                <Shield className="w-6 h-6 text-primary-500" />
                What is Quai Vault?
              </h2>
              <div className="space-y-4 text-dark-300 leading-relaxed">
                <p>
                  <strong className="text-dark-100">Quai Vault</strong> is a decentralized multisignature (multisig) wallet solution built specifically for the Quai Network.
                  It enables secure, collaborative management of QUAI tokens and smart contract interactions through a multi-owner approval system.
                </p>
                <p>
                  Unlike traditional single-signature wallets where one person has complete control, Quai Vault requires multiple authorized parties
                  (owners) to approve transactions before they can be executed. This provides enhanced security, shared control, and protection against
                  single points of failure.
                </p>
                <p>
                  Think of it as a digital safe that requires multiple keys to open—no single person can move funds without the consent of others,
                  making it ideal for teams, organizations, or individuals who want extra security for their assets.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Philosophy */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="vault-panel p-8 border-2 border-primary-600/30">
              <h2 className="font-display font-bold text-2xl text-dark-100 mb-6 flex items-center gap-3">
                <Lock className="w-6 h-6 text-primary-500" />
                Core Philosophy: True Decentralization
              </h2>
              <div className="space-y-4 text-dark-300 leading-relaxed">
                <p>
                  <strong className="text-primary-500">Quai Vault is built on a fundamental principle: on-chain authority.</strong>{' '}
                  All wallet logic, access control, timelocks, and module permissions are enforced by immutable smart contracts on Quai Network.
                  Transaction writes go directly through blockchain RPC — no intermediaries can authorize or block your operations.
                </p>

                <div className={`rounded-lg p-6 mt-6 border ${
                  theme === 'dark'
                    ? 'bg-vault-dark-4 border-vault-dark-4'
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <p className="text-primary-500 font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    What This Means for You
                  </p>
                  <ul className="space-y-3">
                    {decentralizationBenefits.map((benefit) => (
                      <li key={benefit.title} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary-500 mt-1 flex-shrink-0" />
                        <span>
                          <strong className="text-dark-200">{benefit.title}:</strong>{' '}
                          <span className="text-dark-400">{benefit.description}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-dark-500 italic mt-4">
                  A Supabase indexer powers real-time data synchronization for the frontend, tracking
                  transactions, approvals, token transfers, and module events as they happen on-chain.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="vault-panel p-8">
              <h2 className="font-display font-bold text-2xl text-dark-100 mb-6 flex items-center gap-3">
                <Zap className="w-6 h-6 text-primary-500" />
                How It Works
              </h2>
              <div className="space-y-4">
                {[
                  { step: 1, title: 'Create Your Vault', description: 'Deploy a new vault in a single transaction. Specify owners, an approval threshold (e.g., 2 of 3), and an optional minimum execution delay. The factory uses CREATE2 for deterministic, shard-aware addresses.' },
                  { step: 2, title: 'Propose Transactions', description: 'Any owner can propose a transaction (sending QUAI, tokens, NFTs, calling contracts). Optionally set an expiration and execution delay. The transaction enters the pending state.' },
                  { step: 3, title: 'Gather Approvals', description: 'Other owners review and approve the transaction. Once the threshold is met (e.g., 2 of 3 approvals), the timelock begins if one is configured.' },
                  { step: 4, title: 'Wait for Timelock', description: 'If the transaction has an execution delay, it becomes executable only after the delay elapses. The countdown starts from the moment quorum was first reached.' },
                  { step: 5, title: 'Execute', description: 'Any owner can execute the transaction once approvals are met and the timelock has elapsed. The transaction is then processed on-chain.' },
                ].map((item) => (
                  <div key={item.step} className={`rounded-lg p-6 border ${
                    theme === 'dark'
                      ? 'bg-vault-dark-4 border-vault-dark-4'
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600/20 flex items-center justify-center text-primary-500 font-bold">
                        {item.step}
                      </span>
                      <div>
                        <h3 className="font-display font-semibold text-dark-100 mb-2">{item.title}</h3>
                        <p className="text-dark-400">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="vault-panel p-8">
              <h2 className="font-display font-bold text-2xl text-dark-100 mb-6 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-primary-500" />
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature) => (
                  <div key={feature.title} className={`rounded-lg p-6 border ${
                    theme === 'dark'
                      ? 'bg-vault-dark-4 border-vault-dark-4'
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <h3 className="text-primary-500 font-semibold mb-2 flex items-center gap-2">
                      <feature.icon className="w-4 h-4" />
                      {feature.title}
                    </h3>
                    <p className="text-dark-400 text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Technical Architecture */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="vault-panel p-8">
              <h2 className="font-display font-bold text-2xl text-dark-100 mb-6 flex items-center gap-3">
                <Server className="w-6 h-6 text-primary-500" />
                Technical Architecture
              </h2>
              <div className="space-y-6 text-dark-300">
                <div>
                  <h3 className="font-display font-semibold text-dark-100 mb-3">Smart Contract Layer</h3>
                  <p className="text-dark-400 mb-3">
                    Quai Vault deploys immutable smart contracts with Zodiac IAvatar compatibility:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500">•</span>
                      <span><strong className="text-dark-200">QuaiVault:</strong> Core implementation with multisig logic and Zodiac IAvatar interface</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500">•</span>
                      <span><strong className="text-dark-200">QuaiVaultProxy:</strong> Minimal immutable forwarding proxy deployed per vault instance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500">•</span>
                      <span><strong className="text-dark-200">QuaiVaultFactory:</strong> CREATE2 factory for deterministic, single-transaction deployment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500">•</span>
                      <span><strong className="text-dark-200">MultiSend:</strong> Batched transaction execution via DelegateCall</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-display font-semibold text-dark-100 mb-3">Frontend Layer</h3>
                  <p className="text-dark-400 mb-3">
                    Built with React and TypeScript, powered by the Supabase indexer:
                  </p>
                  <ul className="space-y-2 ml-4 text-dark-400">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500">•</span>
                      <span><strong className="text-dark-200">Quais.js:</strong> Quai Network SDK for blockchain interactions and transaction signing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500">•</span>
                      <span><strong className="text-dark-200">Supabase Indexer:</strong> Real-time event tracking for transactions, approvals, and token transfers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500">•</span>
                      <span><strong className="text-dark-200">Token Management:</strong> ERC-20 balances, NFT holdings, and ERC-1155 inventory panels</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-display font-semibold text-dark-100 mb-3">Security Features</h3>
                  <ul className="space-y-2 ml-4 text-dark-400">
                    <li className="flex items-start gap-2"><span className="text-primary-500">•</span> ReentrancyGuard protection on all execution functions</li>
                    <li className="flex items-start gap-2"><span className="text-primary-500">•</span> Checks-Effects-Interactions pattern throughout</li>
                    <li className="flex items-start gap-2"><span className="text-primary-500">•</span> Owner-only and self-only modifiers for access control</li>
                    <li className="flex items-start gap-2"><span className="text-primary-500">•</span> Hash-based transaction IDs with unordered execution and replay protection</li>
                    <li className="flex items-start gap-2"><span className="text-primary-500">•</span> Epoch-based approval invalidation — owner removal atomically invalidates all in-flight approvals</li>
                    <li className="flex items-start gap-2"><span className="text-primary-500">•</span> Native timelocks with clock-gaming protection (approvedAt set once, never cleared)</li>
                    <li className="flex items-start gap-2"><span className="text-primary-500">•</span> Terminal failure handling — failed external calls cannot block the wallet</li>
                    <li className="flex items-start gap-2"><span className="text-primary-500">•</span> EIP-1271 contract signatures via multisig consensus</li>
                    <li className="flex items-start gap-2"><span className="text-primary-500">•</span> Maximum 20 owners and 50 modules to prevent gas limit DoS</li>
                    <li className="flex items-start gap-2"><span className="text-primary-500">•</span> Module access control via Zodiac linked list storage</li>
                    <li className="flex items-start gap-2"><span className="text-primary-500">•</span> DelegateCall disabled by default — prevents storage corruption attacks from malicious modules</li>
                    <li className="flex items-start gap-2"><span className="text-primary-500">•</span> 5 rounds of AI-assisted security audits (0 Critical, 0 High, 0 Medium findings)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="vault-panel p-8">
              <h2 className="font-display font-bold text-2xl text-dark-100 mb-6 flex items-center gap-3">
                <Users className="w-6 h-6 text-primary-500" />
                Use Cases
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {useCases.map((useCase) => (
                  <div key={useCase.title} className={`rounded-lg p-6 border ${
                    theme === 'dark'
                      ? 'bg-vault-dark-4 border-vault-dark-4'
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <h3 className="text-primary-500 font-semibold mb-2 flex items-center gap-2">
                      <useCase.icon className="w-4 h-4" />
                      {useCase.title}
                    </h3>
                    <p className="text-dark-400 text-sm">{useCase.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Getting Started CTA */}
        <section className="py-16 pb-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="vault-panel p-8 border-2 border-primary-600/30">
              <h2 className="font-display font-bold text-2xl text-dark-100 mb-4 flex items-center gap-3">
                <Zap className="w-6 h-6 text-primary-500" />
                Ready to Get Started?
              </h2>
              <p className="text-dark-400 mb-6">
                Create your first multisig vault and start managing your assets securely with multi-signature protection.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={config.appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Launch App
                </a>
                <Link to="/docs" className="btn-secondary">
                  <FileText className="w-4 h-4 mr-2" />
                  Read Documentation
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
