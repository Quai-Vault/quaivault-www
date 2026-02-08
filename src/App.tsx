import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import DocsIndex from './pages/docs/DocsIndex'
import GettingStarted from './pages/docs/GettingStarted'
import MultisigWallets from './pages/docs/MultisigWallets'
import Modules from './pages/docs/Modules'
import FrontendGuide from './pages/docs/FrontendGuide'
import DeveloperGuide from './pages/docs/DeveloperGuide'
import Security from './pages/docs/Security'
import FAQ from './pages/docs/FAQ'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/docs" element={<DocsIndex />} />
        <Route path="/docs/getting-started" element={<GettingStarted />} />
        <Route path="/docs/multisig-wallets" element={<MultisigWallets />} />
        <Route path="/docs/modules" element={<Modules />} />
        <Route path="/docs/frontend-guide" element={<FrontendGuide />} />
        <Route path="/docs/developer-guide" element={<DeveloperGuide />} />
        <Route path="/docs/security" element={<Security />} />
        <Route path="/docs/faq" element={<FAQ />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
