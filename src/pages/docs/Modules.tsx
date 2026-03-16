import { Link } from 'react-router-dom';
import DocLayout from '../../components/DocLayout';

export default function Modules() {
  return (
    <DocLayout
      title="Modules"
      description="Extend your multisig vault with Zodiac-compatible modules for additional security features and functionality."
    >
      {/* Overview */}
      <div className="vault-panel p-6 mb-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">What are Modules?</h2>
        <div className="space-y-3 text-base text-dark-300 leading-relaxed">
          <p>
            Modules are separate smart contracts that extend the functionality of your QuaiVault.
            They can be enabled or disabled at any time through a multisig transaction. Modules provide
            additional security features and operational controls beyond the core multisig functionality.
          </p>
          <p>
            Modules interact with the QuaiVault through the
            Zodiac <code className="text-primary-400">IAvatar</code> interface, specifically
            the <code className="text-primary-400">execTransactionFromModule()</code> function. This
            standardized interface ensures modules can only perform actions the vault has authorized.
            Module configuration functions (such as setting up guardians for recovery) require multisig
            approval -- the caller must be the QuaiVault
            itself (<code className="text-primary-400">msg.sender == wallet</code>), ensuring that no
            single owner can unilaterally change module settings.
          </p>
          <p>
            Quai Vault implements the <strong className="text-dark-200">Zodiac IAvatar</strong> standard,
            which means any Zodiac-compatible module can be enabled on your vault via multisig consensus.
            The Social Recovery Module is the built-in module provided by Quai Vault, but the module system
            is open and extensible.
          </p>
          <div className="doc-callout-yellow mt-2">
            <p className="text-sm doc-callout-yellow-text">
              <strong>DelegateCall is disabled by default.</strong> Modules execute via <code>Call</code> only.
              If a module requests <code>DelegateCall</code> (e.g., MultiSend for batched transactions), the
              vault will reject it unless <code>delegatecallDisabled</code> has been set to <code>false</code> via
              a multisig self-call. This protects against storage corruption attacks where a malicious module
              could overwrite vault state.
            </p>
          </div>
        </div>
      </div>

      {/* Social Recovery Module */}
      <div className="vault-panel p-6 mb-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4 flex items-center gap-3">
          <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Social Recovery Module
        </h2>

        <div className="space-y-4 text-base text-dark-300">
          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Overview</h3>
            <p className="leading-relaxed">
              The Social Recovery Module allows trusted guardians to recover access to your vault if you
              lose access to your owner keys. This provides a safety net for critical multisig wallets
              while maintaining security through guardian consensus.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">How It Works</h3>
            <ol className="space-y-2 ml-4 list-decimal leading-relaxed">
              <li>
                <strong className="text-dark-200">Configuration:</strong> Set up guardians (trusted addresses,
                maximum 20) and a threshold (how many guardians must approve a recovery). Configuration
                changes require multisig approval -- the caller must be the QuaiVault itself
                (i.e., <code className="text-primary-400">msg.sender == wallet</code>), not just any owner.
              </li>
              <li>
                <strong className="text-dark-200">Recovery Initiation:</strong> A guardian initiates a recovery
                by proposing new owners and a new threshold for the vault. Each recovery is tracked with a
                unique recovery nonce to prevent replay attacks.
              </li>
              <li>
                <strong className="text-dark-200">Approval Period:</strong> Other guardians review and approve
                the recovery proposal. The recovery requires the configured threshold of guardian approvals.
                While a recovery is pending, guardian configuration cannot be changed.
              </li>
              <li>
                <strong className="text-dark-200">Time Delay:</strong> After enough approvals, there's a
                configurable time delay (minimum 1 day) before execution. This gives current owners time
                to cancel if the recovery is malicious.
              </li>
              <li>
                <strong className="text-dark-200">Execution:</strong> Once the time delay has passed and
                threshold approvals are met, anyone can execute the recovery. The module interacts with the
                QuaiVault via the Zodiac <code className="text-primary-400">IAvatar</code> interface,
                calling <code className="text-primary-400">execTransactionFromModule()</code> to replace
                the vault's owners and threshold.
              </li>
            </ol>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Key Features</h3>
            <ul className="space-y-2 ml-4 list-disc leading-relaxed">
              <li>Configurable guardian set (up to 20 guardians) and approval threshold</li>
              <li>Recovery nonce prevents replay attacks across multiple recoveries</li>
              <li>Time delay before execution (prevents immediate takeovers)</li>
              <li>Current owners can cancel recoveries</li>
              <li>Configuration changes are blocked while a recovery is pending</li>
              <li>Threshold stored at initiation time prevents manipulation attacks</li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Use Cases</h3>
            <ul className="space-y-2 ml-4 list-disc leading-relaxed">
              <li>Recovering access if owner keys are lost</li>
              <li>Migrating to a new set of owners</li>
              <li>Emergency access recovery for critical vaults</li>
            </ul>
          </div>

          <div className="doc-callout-blue mt-4">
            <p className="text-sm doc-callout-blue-text">
              <strong>Security Warning:</strong> Only configure trusted addresses as guardians. Guardians
              have significant power and can recover your wallet if enough of them agree. Choose guardians
              carefully and consider using hardware wallets or other secure key management solutions.
            </p>
          </div>
        </div>
      </div>

      {/* Zodiac Compatibility */}
      <div className="vault-panel p-6 mb-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4 flex items-center gap-3">
          <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
          </svg>
          Zodiac-Compatible Modules
        </h2>

        <div className="space-y-4 text-base text-dark-300">
          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Overview</h3>
            <p className="leading-relaxed">
              Quai Vault implements the <strong className="text-dark-200">Zodiac IAvatar</strong> interface,
              an open standard for modular smart account governance. This means any module built to the Zodiac
              specification can be enabled on your vault through a multisig transaction.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Compatible Module Types</h3>
            <ul className="space-y-2 ml-4 list-disc leading-relaxed">
              <li><strong className="text-dark-200">Zodiac Delay:</strong> Enforce time delays on module-executed transactions</li>
              <li><strong className="text-dark-200">Zodiac Roles:</strong> Granular permission system for different roles</li>
              <li><strong className="text-dark-200">Zodiac Scope:</strong> Restrict which functions a module can call</li>
              <li><strong className="text-dark-200">Snapshot + SafeSnap:</strong> Execute on-chain proposals from Snapshot governance votes</li>
              <li><strong className="text-dark-200">MultiSend:</strong> Batch multiple transactions into a single execution (requires DelegateCall enabled)</li>
              <li><strong className="text-dark-200">Custom Modules:</strong> Build your own modules using the IAvatar interface</li>
            </ul>
            <div className="doc-note mt-3">
              <p className="text-sm doc-note-text font-mono mb-1">MultiSend & DelegateCall:</p>
              <p className="text-sm doc-note-text">
                MultiSend uses DelegateCall to execute batched transactions in the vault's context.
                To use MultiSend, you must first enable DelegateCall on your vault by calling <code>setDelegatecallDisabled(false)</code> via
                a multisig self-call. Only do this if you trust all enabled modules.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Module Limits</h3>
            <p className="leading-relaxed">
              A vault can have up to <strong className="text-dark-200">50 modules</strong> enabled simultaneously.
              Modules are stored in a linked list following the Zodiac standard, enabling efficient iteration
              and management. Each module operates independently and cannot modify its own permissions --
              only the vault (via multisig consensus) can enable or disable modules.
            </p>
          </div>
        </div>
      </div>

      {/* Enabling Modules */}
      <div className="vault-panel p-6 mb-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">Enabling Modules</h2>
        <div className="space-y-3 text-base text-dark-300 leading-relaxed">
          <p>
            To enable a module:
          </p>
          <ol className="space-y-2 ml-4 list-decimal">
            <li>Navigate to your vault's detail page</li>
            <li>Click "Manage Modules" in the modules section</li>
            <li>Click "Enable" next to the module you want to add</li>
            <li>Approve the transaction (requires threshold approvals)</li>
            <li>Once enabled, configure the module settings</li>
          </ol>
          <p className="mt-4">
            Both enabling and configuring modules require multisig approval. All module configuration
            functions enforce that <code className="text-primary-400">msg.sender</code> is the QuaiVault
            contract itself, meaning changes must go through the standard multisig transaction flow.
            Modules can be disabled at any time through the same process. Disabling a module
            removes its functionality but doesn't affect existing configurations (they'll be restored if you
            re-enable the module).
          </p>
        </div>
      </div>

      {/* Related Documentation */}
      <div className="vault-panel p-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">Related Documentation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/docs/multisig-wallets"
            className="vault-panel p-4 hover:border-primary-500/50 transition-all group"
          >
            <h3 className="text-base font-display font-bold text-dark-200 mb-2 group-hover:text-primary-400 transition-colors">
              Multisig Wallets
            </h3>
            <p className="text-sm text-dark-400">
              Understand the core multisig functionality that modules extend.
            </p>
          </Link>
          <Link
            to="/docs/security"
            className="vault-panel p-4 hover:border-primary-500/50 transition-all group"
          >
            <h3 className="text-base font-display font-bold text-dark-200 mb-2 group-hover:text-primary-400 transition-colors">
              Security Best Practices
            </h3>
            <p className="text-sm text-dark-400">
              Learn about security considerations when using modules.
            </p>
          </Link>
        </div>
      </div>
    </DocLayout>
  );
}
