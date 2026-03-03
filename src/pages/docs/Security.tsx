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
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Transaction Identification</h3>
            <p className="text-base text-dark-300 leading-relaxed">
              Transaction identifiers are hash-based, computed from the transaction content (destination, value, data,
              nonce, chain ID, and vault address). This enables unordered execution — multiple transactions can be
              in-flight simultaneously and executed in any order, eliminating head-of-line blocking. Chain ID and vault
              address in the hash prevent replay attacks across chains and between different vaults.
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

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Native Timelocks</h3>
            <p className="text-base text-dark-300 leading-relaxed">
              Timelocks are built into the core contract at two levels. The vault-level <code className="text-primary-400">minExecutionDelay</code> enforces
              a floor on all external transactions. Individual transactions can request additional delay beyond the vault
              minimum. The <code className="text-primary-400">approvedAt</code> timestamp is set once when quorum is first reached and is never
              cleared — even if approvers subsequently revoke, the clock cannot be gamed. Self-calls (owner management,
              threshold changes) always execute immediately, which is required for incident response.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Transaction Expiration</h3>
            <p className="text-base text-dark-300 leading-relaxed">
              Transactions can optionally include an expiration timestamp. After expiry, the transaction cannot be executed
              and anyone can call <code className="text-primary-400">expireTransaction()</code> for permissionless cleanup. The contract uses a
              dedicated <code className="text-primary-400">expiredTxs</code> mapping to unambiguously distinguish expired transactions from cancelled
              ones. Expiration validation ensures there is always a guaranteed execution window between timelock completion
              and expiry.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Epoch-Based Approval Invalidation</h3>
            <p className="text-base text-dark-300 leading-relaxed">
              When an owner is removed from the vault, their <code className="text-primary-400">ownerVersions</code> counter increments atomically. All
              in-flight approvals from that owner become invalid instantly — an O(1) operation with no loops over active
              transactions. If the same address is later re-added, their old approvals remain invalid because they belong
              to a previous epoch. This prevents "ghost approval" resurrection attacks where a removed-and-re-added owner's
              old approvals could cross the threshold.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Terminal Failure Handling</h3>
            <p className="text-base text-dark-300 leading-relaxed">
              Quai Vault follows Option B failure semantics for external calls. When a transaction execution fails (the
              external call reverts), the transaction is marked as <code className="text-primary-400">failed</code> — a terminal state. It cannot be
              re-executed. This prevents an attacker from crafting a transaction that permanently fails execution while
              keeping the wallet's approval slot occupied. Self-calls (admin operations) always revert on failure because
              partial admin state changes are unacceptable.
            </p>
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
              <li>Configure appropriate timelocks for high-value transactions</li>
              <li>Use transaction expirations to prevent stale proposals from executing</li>
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
