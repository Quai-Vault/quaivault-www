import { Github, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import config from '../config'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { theme } = useTheme()

  return (
    <footer className="relative z-10 bg-vault-dark-1 border-t border-vault-dark-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img
                src={theme === 'dark' ? '/logo.svg' : '/logo-light.svg'}
                alt="Quai Vault"
                className="w-10 h-10"
              />
              <span className="font-display font-bold text-xl text-dark-100">
                Quai <span className="text-gradient-red">Vault</span>
              </span>
            </div>
            <p className="text-dark-500 text-sm max-w-md mb-4">
              Decentralized multisig wallet for Quai Network. Secure your assets
              with multi-signature protection. No intermediaries, no compromises.
            </p>
            <div className="flex items-center gap-4">
              <a
                href={config.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-500 hover:text-primary-500 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-display font-semibold text-dark-200 mb-4">Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={config.appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-500 hover:text-dark-200 transition-colors text-sm flex items-center gap-1"
                >
                  Launch App
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link
                  to="/docs"
                  className="text-dark-500 hover:text-dark-200 transition-colors text-sm"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <a
                  href={config.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-500 hover:text-dark-200 transition-colors text-sm flex items-center gap-1"
                >
                  GitHub
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://qu.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-500 hover:text-dark-200 transition-colors text-sm flex items-center gap-1"
                >
                  Quai Network
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://pelaguswallet.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-500 hover:text-dark-200 transition-colors text-sm flex items-center gap-1"
                >
                  Pelagus Wallet
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-vault-dark-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-dark-600 text-sm">
            &copy; {currentYear} Quai Vault. Built for Quai Network.
          </p>
          <p className="text-dark-600 text-sm">
            Decentralized. Non-custodial. Open source.
          </p>
        </div>
      </div>
    </footer>
  )
}
