import { Link } from 'react-router-dom';
import DocLayout from '../../components/DocLayout';

export default function Modules() {
  return (
    <DocLayout
      title="Modules"
      description="Extend your multisig vault with powerful modules that add additional security features and functionality."
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
            Module configuration functions (such as setting limits, adding to whitelists, or setting up
            recovery) require multisig approval -- the caller must be the QuaiVault
            itself (<code className="text-primary-400">msg.sender == wallet</code>), ensuring that no
            single owner can unilaterally change module settings.
          </p>
          <p>
            All modules are optional and can be enabled independently. You can have multiple modules
            active simultaneously, each providing different capabilities.
          </p>
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

      {/* Daily Limit Module */}
      <div className="vault-panel p-6 mb-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4 flex items-center gap-3">
          <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Daily Limit Module
        </h2>

        <div className="space-y-4 text-base text-dark-300">
          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Overview</h3>
            <p className="leading-relaxed">
              The Daily Limit Module allows single-owner execution of transactions below a configured
              daily spending limit. This provides convenience for small, routine transactions while
              maintaining multisig security for larger amounts.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">How It Works</h3>
            <ol className="space-y-2 ml-4 list-decimal leading-relaxed">
              <li>
                <strong className="text-dark-200">Configuration:</strong> Set a daily spending limit
                in QUAI. Calling <code className="text-primary-400">setDailyLimit()</code> requires multisig
                approval -- the caller must be the QuaiVault itself
                (i.e., <code className="text-primary-400">msg.sender == wallet</code>), not just any owner.
              </li>
              <li>
                <strong className="text-dark-200">Single-Owner Execution:</strong> Any owner can execute
                transfers below the daily limit using the module's <code className="text-primary-400">executeBelowLimit()</code> function,
                bypassing the normal multisig approval flow. The module interacts with the QuaiVault via the
                Zodiac <code className="text-primary-400">IAvatar</code> interface,
                calling <code className="text-primary-400">execTransactionFromModule()</code> to execute the transfer.
              </li>
              <li>
                <strong className="text-dark-200">On-Chain Tracking:</strong> The module tracks spending
                on-chain over rolling 24-hour periods. Once the limit is reached, transactions require normal
                multisig approvals. Use the view
                functions <code className="text-primary-400">getRemainingLimit()</code> and <code className="text-primary-400">getTimeUntilReset()</code> to
                check available spending and when the current period resets.
              </li>
            </ol>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Key Features</h3>
            <ul className="space-y-2 ml-4 list-disc leading-relaxed">
              <li>Configurable daily spending limit (requires multisig approval to set)</li>
              <li>Rolling 24-hour window with automatic reset</li>
              <li>View functions: <code className="text-primary-400">getRemainingLimit()</code> and <code className="text-primary-400">getTimeUntilReset()</code> for querying current state</li>
              <li>On-chain enforcement through dedicated module function</li>
              <li>Only applies to simple QUAI transfers (not contract calls)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Use Cases</h3>
            <ul className="space-y-2 ml-4 list-disc leading-relaxed">
              <li>Small routine payments without requiring multiple approvals</li>
              <li>Operational expenses that need quick execution</li>
              <li>Reducing friction for low-value transactions</li>
            </ul>
          </div>

          <div className="doc-note mt-4">
            <p className="text-sm doc-note-text font-mono mb-1">Note:</p>
            <p className="text-sm doc-note-text">
              Daily limits only apply to simple QUAI transfers. Contract calls always require multisig
              approvals regardless of the daily limit configuration.
            </p>
          </div>
        </div>
      </div>

      {/* Whitelist Module */}
      <div className="vault-panel p-6 mb-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4 flex items-center gap-3">
          <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Whitelist Module
        </h2>

        <div className="space-y-4 text-base text-dark-300">
          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Overview</h3>
            <p className="leading-relaxed">
              The Whitelist Module allows you to pre-approve addresses for quick transaction execution.
              Transactions to whitelisted addresses can be executed immediately by a single owner without
              waiting for approvals.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">How It Works</h3>
            <ol className="space-y-2 ml-4 list-decimal leading-relaxed">
              <li>
                <strong className="text-dark-200">Configuration:</strong> Add addresses to the whitelist
                using <code className="text-primary-400">addToWhitelist()</code> or <code className="text-primary-400">batchAddToWhitelist()</code> for
                multiple addresses at once. These functions require multisig approval -- the caller must be
                the QuaiVault itself (i.e., <code className="text-primary-400">msg.sender == wallet</code>),
                not just any owner. You can remove addresses at any time through the same approval flow.
              </li>
              <li>
                <strong className="text-dark-200">Automatic Execution:</strong> When an owner proposes a
                transaction to a whitelisted address, it can be executed immediately without approvals. The
                module uses the Zodiac <code className="text-primary-400">IAvatar</code> interface,
                calling <code className="text-primary-400">execTransactionFromModule()</code> on the QuaiVault.
              </li>
              <li>
                <strong className="text-dark-200">Flexible Usage:</strong> Works with both QUAI transfers
                and contract calls to whitelisted addresses.
              </li>
            </ol>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Key Features</h3>
            <ul className="space-y-2 ml-4 list-disc leading-relaxed">
              <li>Add or remove addresses from whitelist (single or batch via <code className="text-primary-400">batchAddToWhitelist()</code>)</li>
              <li>Works with transfers and contract calls</li>
              <li>Single-owner execution for whitelisted addresses</li>
              <li>Manage whitelist through multisig transactions</li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Use Cases</h3>
            <ul className="space-y-2 ml-4 list-disc leading-relaxed">
              <li>Frequent transactions to trusted addresses (exchanges, services)</li>
              <li>Automated systems that need quick execution</li>
              <li>Reducing approval overhead for known-good addresses</li>
            </ul>
          </div>

          <div className="doc-callout-yellow mt-4">
            <p className="text-sm doc-callout-yellow-text">
              <strong>Security Warning:</strong> Only whitelist addresses you fully trust. Whitelisting an
              address enables ANY function call to that address without multisig approvals, not just simple
              value transfers. This means arbitrary contract interactions with whitelisted addresses bypass
              the normal approval flow. Regularly review and update your whitelist.
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

      {/* Module Combinations */}
      <div className="vault-panel p-6 mb-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">Module Combinations</h2>
        <div className="space-y-3 text-base text-dark-300 leading-relaxed">
          <p>
            You can enable multiple modules simultaneously. They work independently:
          </p>
          <ul className="space-y-2 ml-4 list-disc">
            <li>
              <strong className="text-dark-200">Daily Limit + Whitelist:</strong> Transactions to whitelisted
              addresses bypass both daily limit checks and approval requirements.
            </li>
            <li>
              <strong className="text-dark-200">Social Recovery + Others:</strong> Social Recovery works
              independently and can be used regardless of other module configurations.
            </li>
            <li>
              <strong className="text-dark-200">All Modules:</strong> You can enable all three modules
              for maximum flexibility and security.
            </li>
          </ul>
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
