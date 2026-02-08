import DocLayout from '../../components/DocLayout';

export default function Security() {
  return (
    <DocLayout
      title="Security"
      description="Security considerations, best practices, and audit information for Quai Vault."
    >
      {/* Security Model */}
      <div className="vault-panel p-6 mb-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">Security Model</h2>
        <div className="space-y-3 text-base text-dark-300 leading-relaxed">
          <p>
            Quai Vault implements a threshold-based multisig security model where transactions require
            multiple approvals before execution. This provides defense-in-depth against single points of failure.
          </p>
          <p>
            Key security principles:
          </p>
          <ul className="space-y-2 ml-4 list-disc">
            <li><strong className="text-dark-200">Distributed Control:</strong> No single key controls the vault</li>
            <li><strong className="text-dark-200">Threshold Protection:</strong> Requires consensus for execution</li>
            <li><strong className="text-dark-200">On-Chain Transparency:</strong> All actions are verifiable on-chain</li>
            <li><strong className="text-dark-200">Modular Design:</strong> Modules add security layers without compromising core functionality</li>
          </ul>
        </div>
      </div>

      {/* Smart Contract Security */}
      <div className="vault-panel p-6 mb-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">Smart Contract Security</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Contract Architecture</h3>
            <p className="text-base text-dark-300 leading-relaxed">
              The core contracts are <code className="text-primary-400">QuaiVault</code> (implementation logic),{' '}
              <code className="text-primary-400">QuaiVaultProxy</code> (minimal forwarding proxy per wallet), and{' '}
              <code className="text-primary-400">QuaiVaultFactory</code> (deterministic deployment). All contracts are
              immutable and non-upgradeable once deployed -- there are no admin or upgrade functions exposed.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Reentrancy Protection</h3>
            <p className="text-base text-dark-300 leading-relaxed">
              All execution functions use OpenZeppelin's <code className="text-primary-400">ReentrancyGuard</code> to
              prevent reentrancy attacks. The Checks-Effects-Interactions pattern is followed throughout: state changes
              are committed before any external calls are made.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Access Control</h3>
            <p className="text-base text-dark-300 leading-relaxed">
              Strict access control is enforced through dedicated modifiers:
            </p>
            <ul className="space-y-1 ml-4 list-disc text-base text-dark-300 mt-2">
              <li><code className="text-primary-400">onlyOwner</code> -- restricts calls to current vault owners</li>
              <li><code className="text-primary-400">onlySelf</code> -- restricts calls to the vault contract itself (via approved multisig transaction)</li>
              <li><code className="text-primary-400">onlyModule</code> -- restricts calls to enabled modules</li>
            </ul>
            <p className="text-base text-dark-300 leading-relaxed mt-2">
              Module configuration (enabling, disabling) requires multisig approval because it is gated
              by <code className="text-primary-400">msg.sender == address(this)</code>, meaning only an executed
              multisig transaction can modify modules.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Owner Limits and Gas Safety</h3>
            <p className="text-base text-dark-300 leading-relaxed">
              A maximum of <strong className="text-dark-200">20 owners</strong> is enforced per vault. This cap prevents
              gas DoS scenarios where owner enumeration or signature loops could exceed block gas limits.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Replay Attack Prevention</h3>
            <p className="text-base text-dark-300 leading-relaxed">
              Transaction hashes are computed using a <strong className="text-dark-200">nonce</strong> that increments
              with each submitted transaction, combined with the <strong className="text-dark-200">chain ID</strong> and
              the vault address. This prevents replay attacks both across chains and across different vaults on the same chain.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Module Storage</h3>
            <p className="text-base text-dark-300 leading-relaxed">
              Enabled modules are tracked using a <strong className="text-dark-200">linked list</strong> storage pattern,
              allowing gas-efficient enumeration and O(1) addition and removal without array re-indexing.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Input Validation</h3>
            <p className="text-base text-dark-300 leading-relaxed">
              All inputs are validated: addresses checked for zero, thresholds validated against owner counts,
              transaction existence verified before operations.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Social Recovery Security</h3>
            <p className="text-base text-dark-300 leading-relaxed">
              The Social Recovery Module includes several security features:
            </p>
            <ul className="space-y-1 ml-4 list-disc text-base text-dark-300 mt-2">
              <li>Threshold stored at initiation time prevents manipulation</li>
              <li>Configuration locked during pending recoveries</li>
              <li>Time delay prevents immediate takeovers</li>
              <li>Owner cancellation rights provide final safeguard</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="vault-panel p-6 mb-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">Security Best Practices</h2>

        <div className="space-y-4 text-base text-dark-300">
          <div>
            <h3 className="font-semibold text-dark-200 mb-2">Key Management</h3>
            <ul className="space-y-1 ml-4 list-disc text-dark-400">
              <li>Use hardware wallets for owner keys when possible</li>
              <li>Store keys securely and separately</li>
              <li>Never share private keys</li>
              <li>Use different keys for different vaults</li>
              <li>Consider using multisig wallets as owners (nested multisig)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-dark-200 mb-2">Threshold Selection</h3>
            <ul className="space-y-1 ml-4 list-disc text-dark-400">
              <li>Balance security with operational needs</li>
              <li>Avoid 1-of-N thresholds (defeats purpose of multisig)</li>
              <li>Consider geographic/key distribution when setting thresholds</li>
              <li>Higher thresholds for higher-value vaults</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-dark-200 mb-2">Module Configuration</h3>
            <ul className="space-y-1 ml-4 list-disc text-dark-400">
              <li>Only whitelist trusted addresses</li>
              <li>Set conservative daily limits</li>
              <li>Choose trusted guardians for social recovery</li>
              <li>Regularly review module configurations</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-dark-200 mb-2">Transaction Verification</h3>
            <ul className="space-y-1 ml-4 list-disc text-dark-400">
              <li>Always verify transaction details before approving</li>
              <li>Check decoded contract calls when possible</li>
              <li>Verify destination addresses</li>
              <li>Use transaction lookup to verify on-chain state</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Known Limitations */}
      <div className="vault-panel p-6 mb-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">Known Limitations</h2>

        <div className="space-y-4 text-base text-dark-300">
          <div className="doc-callout-yellow">
            <h3 className="text-base font-semibold doc-callout-yellow-text mb-2">Testnet Deployment</h3>
            <p className="text-sm doc-callout-yellow-text">
              Quai Vault is currently deployed on Orchard Testnet for engineering testing.
              <strong> Do not store significant funds.</strong> Mainnet deployment will follow after
              comprehensive testing and security audits.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Daily Limit Module Scope</h3>
            <p className="leading-relaxed">
              The Daily Limit Module provides on-chain enforcement through its <code className="text-primary-400">executeBelowLimit()</code> function.
              However, normal multisig transactions (via <code className="text-primary-400">executeTransaction()</code>) are not subject to daily limits—they
              require threshold approvals regardless. The module is designed to provide a fast path for small transfers, not to restrict
              the core multisig functionality.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Social Recovery Guardians</h3>
            <p className="leading-relaxed">
              If a threshold of guardians is compromised, they can recover your vault. Choose guardians
              carefully and use secure key management.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">DelegateCall Risks</h3>
            <p className="leading-relaxed">
              Enabled modules can execute arbitrary code in the context of the wallet
              via <code className="text-primary-400">delegatecall</code>. This means a malicious or buggy module has
              full access to the vault's storage and funds. Only enable modules that have been reviewed and are trusted.
              Module enabling and disabling is gated by multisig approval to mitigate this risk.
            </p>
          </div>
        </div>
      </div>

      {/* Audit Status */}
      <div className="vault-panel p-6 mb-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">Security Review Status</h2>
        <div className="space-y-3 text-base text-dark-300">
          <p>
            <strong className="text-dark-200">Current Status:</strong> Internal security review completed (Testnet)
          </p>
          <p>
            An internal security analysis has been completed with the following results:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
            <div className="vault-panel p-3 text-center">
              <div className="text-xl font-bold text-green-500">0</div>
              <div className="text-xs text-dark-400">Critical</div>
            </div>
            <div className="vault-panel p-3 text-center">
              <div className="text-xl font-bold text-green-500">2 Fixed</div>
              <div className="text-xs text-dark-400">High</div>
            </div>
            <div className="vault-panel p-3 text-center">
              <div className="text-xl font-bold text-green-500">5 Fixed</div>
              <div className="text-xs text-dark-400">Medium</div>
            </div>
            <div className="vault-panel p-3 text-center">
              <div className="text-xl font-bold text-yellow-500">6 Open</div>
              <div className="text-xs text-dark-400">Low</div>
            </div>
          </div>
          <p>
            All critical, high, and medium severity issues have been addressed. Low severity issues
            remain open as acceptable risk. A formal third-party audit is planned before mainnet deployment.
            All code is open source and available for review.
          </p>
          <div className="mt-4">
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Test Coverage</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="vault-panel p-3 text-center">
                <div className="text-xl font-bold text-green-500">154</div>
                <div className="text-xs text-dark-400">Contract Tests Passing</div>
              </div>
              <div className="vault-panel p-3 text-center">
                <div className="text-xl font-bold text-green-500">357</div>
                <div className="text-xs text-dark-400">Frontend Tests Passing</div>
              </div>
            </div>
          </div>
          <div className="doc-note mt-3">
            <p className="text-sm doc-note-text font-mono mb-1">Security Researchers</p>
            <p className="text-sm doc-note-text">
              If you discover a security vulnerability, please report it responsibly via GitHub's
              private security reporting feature.
            </p>
          </div>
        </div>
      </div>

      {/* Attack Vectors */}
      <div className="vault-panel p-6 mb-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">Potential Attack Vectors</h2>

        <div className="space-y-4 text-base text-dark-300">
          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Owner Key Compromise</h3>
            <p className="leading-relaxed">
              <strong className="text-dark-200">Risk:</strong> If an owner's key is compromised, the attacker
              can propose and approve transactions.
            </p>
            <p className="leading-relaxed mt-2">
              <strong className="text-dark-200">Mitigation:</strong> Use hardware wallets, secure key storage,
              and appropriate thresholds. Remove compromised owners immediately.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Guardian Compromise</h3>
            <p className="leading-relaxed">
              <strong className="text-dark-200">Risk:</strong> If enough guardians are compromised (meeting threshold),
              they can initiate and execute recoveries.
            </p>
            <p className="leading-relaxed mt-2">
              <strong className="text-dark-200">Mitigation:</strong> Choose trusted guardians, use secure key management,
              and monitor recovery proposals. Current owners can cancel malicious recoveries.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Social Engineering</h3>
            <p className="leading-relaxed">
              <strong className="text-dark-200">Risk:</strong> Attackers may try to trick owners into approving
              malicious transactions.
            </p>
            <p className="leading-relaxed mt-2">
              <strong className="text-dark-200">Mitigation:</strong> Always verify transaction details, use
              transaction decoding, and establish clear approval processes.
            </p>
          </div>
        </div>
      </div>

      {/* Reporting Issues */}
      <div className="vault-panel p-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">Reporting Security Issues</h2>
        <div className="space-y-3 text-base text-dark-300">
          <p>
            If you discover a security vulnerability:
          </p>
          <ol className="space-y-2 ml-4 list-decimal">
            <li>Do not open a public GitHub issue</li>
            <li>Contact the maintainers directly or use GitHub's private security reporting</li>
            <li>Provide detailed information about the vulnerability</li>
            <li>Allow time for the issue to be addressed before public disclosure</li>
          </ol>
          <div className="doc-note mt-3">
            <p className="text-sm doc-note-text font-mono mb-1">Responsible Disclosure</p>
            <p className="text-sm doc-note-text">
              We appreciate responsible disclosure and will work with security researchers to address
              issues promptly.
            </p>
          </div>
        </div>
      </div>
    </DocLayout>
  );
}
