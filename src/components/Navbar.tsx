import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ExternalLink, Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import config from '../config'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'About', href: '/about' },
    { name: 'Docs', href: '/docs' },
  ]

  const scrolledBg = theme === 'dark'
    ? 'bg-[#0f0f0f]/95 border-[#222222]'
    : 'bg-white/95 border-gray-200'

  const mobileBg = theme === 'dark'
    ? 'bg-[#0f0f0f]/98 border-[#222222]'
    : 'bg-white/98 border-gray-200'

  const toggleBtnBg = theme === 'dark'
    ? 'bg-[#1a1a1a] hover:bg-[#222222] border-[#222222]'
    : 'bg-gray-100 hover:bg-gray-200 border-gray-200'

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? `${scrolledBg} backdrop-blur-md border-b`
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <img
                src={theme === 'dark' ? '/logo.svg' : '/logo-light.svg'}
                alt="Quai Vault"
                className="w-10 h-10 transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary-500/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-display font-bold text-xl text-dark-100">
              Quai <span className="text-gradient-red">Vault</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-dark-400 hover:text-dark-100 transition-colors text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button + Theme Toggle */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition-colors ${toggleBtnBg}`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-dark-400 hover:text-dark-100" />
              ) : (
                <Moon className="w-5 h-5 text-dark-400 hover:text-dark-100" />
              )}
            </button>
            <a
              href={config.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-400 hover:text-dark-100 transition-colors text-sm font-medium flex items-center gap-1"
            >
              GitHub
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={config.appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm"
            >
              Launch App
            </a>
          </div>

          {/* Mobile Menu Button + Theme Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition-colors ${toggleBtnBg}`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-dark-400" />
              ) : (
                <Moon className="w-5 h-5 text-dark-400" />
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-dark-400 hover:text-dark-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden backdrop-blur-md border-t ${mobileBg}`}>
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-dark-400 hover:text-dark-100 transition-colors text-base font-medium py-2"
              >
                {link.name}
              </Link>
            ))}
            <div className={`pt-4 border-t space-y-3 ${theme === 'dark' ? 'border-[#222222]' : 'border-gray-200'}`}>
              <a
                href={config.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-dark-400 hover:text-dark-100 transition-colors text-base font-medium py-2 flex items-center gap-2"
              >
                GitHub
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href={config.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary block text-center"
              >
                Launch App
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
