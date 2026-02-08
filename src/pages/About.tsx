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
      description: 'Propose, approve, execute, and cancel transactions. Full control over the transaction lifecycle.',
    },
    {
      icon: RefreshCw,
      title: 'Owner Management',
      description: 'Add or remove owners, change approval thresholds—all through multisig transactions for security.',
    },
    {
      icon: Code,
      title: 'Modular Architecture',
      description: 'Extensible module system for additional features like daily limits, whitelisting, and social recovery.',
    },
    {
      icon: Shield,
      title: 'Zodiac Compatible',
      description: 'Full Zodiac IAvatar compliance enables DAO treasury management and integration with governance ecosystems.',
    },
    {
      icon: Globe,
      title: 'Real-Time Updates',
      description: 'Real-time subscriptions keep your wallet state synchronized instantly. Falls back to polling if unavailable.',
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
    { title: 'No Backend Required', description: 'All wallet operations work directly with the blockchain' },
    { title: 'No Third-Party Dependencies', description: 'Your interactions are between you and the smart contracts' },
    { title: 'Self-Hostable', description: 'The entire frontend can run on IPFS or your own server' },
    { title: 'Censorship Resistant', description: 'No single entity can block or control your wallet' },
    { title: 'Privacy First', description: 'No data is sent to external services' },
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
                  <strong className="text-primary-500">Quai Vault is built on a fundamental principle: complete decentralization.</strong>{' '}
                  Every interaction with your multisig wallet works directly through blockchain RPC calls—no third-party services,
                  no centralized backends, no intermediaries.
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
                  An optional indexer provides real-time subscriptions and faster queries,
                  but is never required—the frontend automatically falls back to direct RPC calls if unavailable.
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
                  { step: 1, title: 'Create Your Vault', description: 'Deploy a new vault in a single transaction. Specify owners and an approval threshold (e.g., 2 of 3). The factory uses CREATE2 for deterministic, shard-aware addresses.' },
                  { step: 2, title: 'Propose Transactions', description: 'Any owner can propose a transaction (sending QUAI, calling contracts, etc.). The transaction is created but not executed yet.' },
                  { step: 3, title: 'Gather Approvals', description: 'Other owners review and approve the transaction. Once the threshold is met (e.g., 2 of 3 approvals), the transaction becomes ready to execute.' },
                  { step: 4, title: 'Execute', description: 'Any owner can execute the transaction once it has enough approvals. The transaction is then executed on-chain and the funds or contract call is processed.' },
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
                    Quai Vault deploys immutable smart contracts with Zodiac IAvatar compatibility and three core components:
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
                    Built with React and TypeScript, using a hybrid data fetching approach:
                  </p>
                  <ul className="space-y-2 ml-4 text-dark-400">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500">•</span>
                      <span><strong className="text-dark-200">Quais.js:</strong> Quai Network SDK for blockchain interactions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500">•</span>
                      <span><strong className="text-dark-200">Hybrid Data Fetching:</strong> Indexer for fast reads, blockchain for writes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500">•</span>
                      <span><strong className="text-dark-200">No Backend Required:</strong> Core functionality works via direct RPC calls</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-display font-semibold text-dark-100 mb-3">Security Features</h3>
                  <ul className="space-y-2 ml-4 text-dark-400">
                    <li className="flex items-start gap-2"><span className="text-primary-500">•</span> ReentrancyGuard protection on all execution functions</li>
                    <li className="flex items-start gap-2"><span className="text-primary-500">•</span> Checks-Effects-Interactions pattern throughout</li>
                    <li className="flex items-start gap-2"><span className="text-primary-500">•</span> Owner-only and self-only modifiers for access control</li>
                    <li className="flex items-start gap-2"><span className="text-primary-500">•</span> Threshold validation before execution</li>
                    <li className="flex items-start gap-2"><span className="text-primary-500">•</span> Nonce-based transaction hashing with chain ID for replay protection</li>
                    <li className="flex items-start gap-2"><span className="text-primary-500">•</span> Maximum 20 owners to prevent gas limit DoS</li>
                    <li className="flex items-start gap-2"><span className="text-primary-500">•</span> Module access control via linked list storage</li>
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
