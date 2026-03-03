import { Link } from 'react-router-dom';
import DocLayout from '../../components/DocLayout';

export default function MultisigWallets() {
  return (
    <DocLayout
      title="Multisig Wallets"
      description="Understanding how multisig wallets work, from proposals to execution, and everything in between."
    >
      {/* Overview */}
      <div className="vault-panel p-6 mb-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">What is a Multisig Wallet?</h2>
        <div className="space-y-3 text-base text-dark-300 leading-relaxed">
          <p>
            A multisig (multi-signature) wallet is a smart contract that requires multiple approvals before
            executing transactions. Unlike traditional single-signature wallets where one private key controls
            everything, multisig wallets distribute control among multiple owners.
          </p>
          <p>
            Quai Vault multisig wallets use a threshold-based approval system: you configure a number of
            owners and a threshold (e.g., 2 of 3, 3 of 5). Transactions require approval from at least the
            threshold number of owners before they can be executed.
          </p>
          <p>
            Under the hood, each vault is an immutable <strong className="text-dark-200">QuaiVaultProxy</strong> that
            delegates to the shared <strong className="text-dark-200">QuaiVault</strong> implementation contract. Contracts are non-upgradeable
            once deployed. Vaults are created in a single transaction through the <strong className="text-dark-200">QuaiVaultFactory</strong>,
            which uses CREATE2 with a mined salt to produce deterministic, shard-aware addresses on the Quai Network.
          </p>
        </div>
      </div>

      {/* Key Concepts */}
      <div className="vault-panel p-6 mb-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">Key Concepts</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Owners
            </h3>
            <p className="text-base text-dark-300 leading-relaxed">
              Owners are addresses that have the authority to propose, approve, and execute transactions.
              Each owner has equal voting power. Owners can be added or removed through a multisig transaction
              (requiring threshold approvals). A vault supports a maximum of 20 owners to prevent gas limit
              denial-of-service attacks.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Threshold
            </h3>
            <p className="text-base text-dark-300 leading-relaxed">
              The threshold is the minimum number of owner approvals required to execute a transaction.
              It must be between 1 and the total number of owners. For example, a 2-of-3 multisig requires
              2 approvals out of 3 owners.
            </p>
            <div className="doc-note mt-3">
              <p className="text-sm doc-note-text font-mono mb-1">Security Note:</p>
              <p className="text-sm doc-note-text">
                Higher thresholds provide more security but reduce flexibility. Choose a threshold that
                balances security with operational needs.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Proposals
            </h3>
            <p className="text-base text-dark-300 leading-relaxed">
              Any owner can propose a transaction. A proposal includes the destination address, value (QUAI amount),
              and data (for contract calls). Proposals can optionally include an expiration timestamp and an execution
              delay. Once proposed, the transaction enters a pending state waiting for approvals.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Approvals
            </h3>
            <p className="text-base text-dark-300 leading-relaxed">
              Owners can approve pending proposals. Each owner can only approve once per proposal. Once the
              threshold number of approvals is reached, the transaction becomes eligible for execution (subject
              to any timelock). Owners can
              use <code className="text-primary-400 bg-dark-700 px-1.5 py-0.5 rounded text-sm">approveAndExecute</code> to
              approve and execute in a single transaction when their approval meets the threshold and no timelock
              is configured. Owners can
              call <code className="text-primary-400 bg-dark-700 px-1.5 py-0.5 rounded text-sm">revokeApproval</code> to
              withdraw their approval. The system uses epoch-based invalidation: when an owner is removed from
              the vault, all of their in-flight approvals across every pending transaction are invalidated instantly.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Execution
            </h3>
            <p className="text-base text-dark-300 leading-relaxed">
              Once a proposal has received the required number of approvals, any owner can execute it.
              Execution is a separate transaction that actually performs the proposed action (transfer,
              contract call, etc.). Additionally, enabled modules can execute transactions directly
              via <code className="text-primary-400 bg-dark-700 px-1.5 py-0.5 rounded text-sm">execTransactionFromModule</code>,
              bypassing the standard approval flow. This Zodiac IAvatar-compatible interface enables
              integration with DAO governance frameworks and automated execution strategies.
            </p>
          </div>
        </div>
      </div>

      {/* Transaction Lifecycle */}
      <div className="vault-panel p-6 mb-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">Transaction Lifecycle</h2>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="doc-step-badge">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-base font-display font-bold text-dark-200 mb-1">Proposal</h3>
              <p className="text-base text-dark-300 leading-relaxed">
                An owner proposes a transaction by specifying the destination, value, and optional calldata.
                The proposal is stored on-chain and assigned a unique transaction hash.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="doc-step-badge">
              2
            </div>
            <div className="flex-1">
              <h3 className="text-base font-display font-bold text-dark-200 mb-1">Approval Phase</h3>
              <p className="text-base text-dark-300 leading-relaxed">
                Owners review the proposal and approve it if they agree. The frontend tracks approval status
                and shows how many approvals are needed. Owners can approve in any order. If an owner changes
                their mind, they can revoke their approval before the transaction is executed.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="doc-step-badge">
              3
            </div>
            <div className="flex-1">
              <h3 className="text-base font-display font-bold text-dark-200 mb-1">Threshold Met (Timelock Begins)</h3>
              <p className="text-base text-dark-300 leading-relaxed">
                Once the threshold number of approvals is reached, the <code className="text-primary-400 bg-dark-700 px-1.5 py-0.5 rounded text-sm">approvedAt</code> timestamp
                is recorded permanently. If the transaction has an execution delay, the timelock countdown begins.
                The transaction becomes executable after the delay elapses.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="doc-step-badge">
              4
            </div>
            <div className="flex-1">
              <h3 className="text-base font-display font-bold text-dark-200 mb-1">Execution</h3>
              <p className="text-base text-dark-300 leading-relaxed">
                Any owner can execute the transaction once approvals are met and any timelock has elapsed.
                Execution performs the actual on-chain action (transfer, contract call, etc.).
                The transaction enters one of two terminal states: <strong className="text-dark-200">executed</strong> (success)
                or <strong className="text-dark-200">failed</strong> (external call reverted). Both are final — the
                transaction cannot be re-executed.
              </p>
            </div>
          </div>

          <div className="doc-note mt-4">
            <p className="text-sm doc-note-text font-mono mb-1">Transaction States:</p>
            <p className="text-sm doc-note-text">
              Transactions have 5 possible states: <strong>pending</strong> (awaiting approvals or timelock),{' '}
              <strong>executed</strong> (successfully completed), <strong>cancelled</strong> (cancelled by proposer
              or consensus), <strong>expired</strong> (past expiration timestamp), and <strong>failed</strong> (execution
              reverted). All states except pending are terminal.
            </p>
          </div>
        </div>
      </div>

      {/* Transaction Types */}
      <div className="vault-panel p-6 mb-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">Transaction Types</h2>

        <div className="space-y-4">
          <div className="border-l-4 border-primary-500 pl-4">
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">QUAI Transfers</h3>
            <p className="text-base text-dark-300 leading-relaxed mb-2">
              Send QUAI tokens to any address. Specify the recipient address and amount.
              The data field should be empty (0x) for simple transfers.
            </p>
            <div className="doc-note">
              <p className="text-xs font-mono doc-note-text">Example: Send 10 QUAI to 0x1234...</p>
            </div>
          </div>

          <div className="border-l-4 border-primary-500 pl-4">
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Contract Calls</h3>
            <p className="text-base text-dark-300 leading-relaxed mb-2">
              Interact with smart contracts by providing the contract address and function call data.
              This allows you to call any function on any contract, enabling complex operations.
            </p>
            <div className="doc-note">
              <p className="text-xs font-mono doc-note-text">Example: Call approve() on an ERC20 token</p>
            </div>
          </div>

          <div className="border-l-4 border-primary-500 pl-4">
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Self-Calls (Owner Management)</h3>
            <p className="text-base text-dark-300 leading-relaxed mb-2">
              Manage the vault itself by calling internal functions. This includes adding/removing owners,
              changing the threshold, and enabling/disabling modules. These are special transactions that
              call the vault contract itself.
            </p>
            <div className="doc-note">
              <p className="text-xs font-mono doc-note-text">Example: Add a new owner address</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation */}
      <div className="vault-panel p-6 mb-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">Cancelling Transactions</h2>
        <div className="space-y-3 text-base text-dark-300 leading-relaxed">
          <p>
            Transactions can be cancelled under certain conditions:
          </p>
          <ul className="space-y-2 ml-4 list-disc">
            <li>
              <strong className="text-dark-200">By the proposer (pre-approval):</strong> The owner who proposed the transaction
              can cancel it, but only before the approval threshold is first reached. Once quorum has been met
              (even if approvers later revoke), the proposer can no longer cancel.
            </li>
            <li>
              <strong className="text-dark-200">By consensus (post-approval):</strong> After the threshold has been reached,
              cancellation requires a new multisig proposal targeting the vault itself
              via <code className="text-primary-400 bg-dark-700 px-1.5 py-0.5 rounded text-sm">cancelByConsensus</code>.
              This ensures that approved transactions can only be cancelled with full multisig agreement.
            </li>
            <li>
              <strong className="text-dark-200">By expiration:</strong> If a transaction has an expiration timestamp and it passes,
              anyone can call <code className="text-primary-400 bg-dark-700 px-1.5 py-0.5 rounded text-sm">expireTransaction</code> to
              clean it up. The transaction moves to the expired state and can never be executed.
            </li>
          </ul>
          <div className="doc-callout-yellow mt-3">
            <p className="text-sm doc-callout-yellow-text">
              <strong>Note:</strong> Once a transaction is executed, it cannot be cancelled. Cancellation
              is only possible for pending transactions.
            </p>
          </div>
        </div>
      </div>

      {/* Timelocks & Expirations */}
      <div className="vault-panel p-6 mb-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">Timelocks & Expirations</h2>
        <div className="space-y-4 text-base text-dark-300 leading-relaxed">
          <div>
            <h3 className="font-semibold text-dark-200 mb-2">Vault-Level Minimum Delay</h3>
            <p className="text-dark-400 leading-relaxed">
              When creating a vault, you can set
              a <code className="text-primary-400 bg-dark-700 px-1.5 py-0.5 rounded text-sm">minExecutionDelay</code> (in
              seconds). This enforces a floor on all external transactions — even if threshold is met instantly,
              the transaction cannot execute until the delay elapses. Self-calls (owner management, threshold
              changes) bypass this delay for incident response. The delay can be changed later via a multisig
              self-call.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-dark-200 mb-2">Per-Transaction Execution Delay</h3>
            <p className="text-dark-400 leading-relaxed">
              When proposing a transaction, owners can request an additional execution delay beyond the vault
              minimum. The effective delay is the maximum of the vault minimum and the requested delay. The
              countdown begins when the approval threshold is first reached — the <code className="text-primary-400 bg-dark-700 px-1.5 py-0.5 rounded text-sm">approvedAt</code> timestamp
              is set once and never cleared, preventing clock-gaming attacks.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-dark-200 mb-2">Transaction Expiration</h3>
            <p className="text-dark-400 leading-relaxed">
              Transactions can optionally include an expiration timestamp. After expiry, the transaction cannot
              be executed and anyone can
              call <code className="text-primary-400 bg-dark-700 px-1.5 py-0.5 rounded text-sm">expireTransaction()</code> for
              cleanup. The contract validates that expiration allows at least one execution window after the
              timelock completes.
            </p>
          </div>
        </div>
      </div>

      {/* Token Support */}
      <div className="vault-panel p-6 mb-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">Token Support</h2>
        <div className="space-y-3 text-base text-dark-300 leading-relaxed">
          <p>
            Quai Vault natively supports holding and managing multiple token standards:
          </p>
          <ul className="space-y-2 ml-4 list-disc">
            <li>
              <strong className="text-dark-200">ERC-20 Tokens:</strong> Hold and send fungible tokens.
              Propose transactions with encoded <code className="text-primary-400 bg-dark-700 px-1.5 py-0.5 rounded text-sm">transfer()</code> or <code className="text-primary-400 bg-dark-700 px-1.5 py-0.5 rounded text-sm">approve()</code> calls.
            </li>
            <li>
              <strong className="text-dark-200">ERC-721 NFTs:</strong> Receive and send NFTs. The vault
              implements <code className="text-primary-400 bg-dark-700 px-1.5 py-0.5 rounded text-sm">onERC721Received</code> for
              safe transfers.
            </li>
            <li>
              <strong className="text-dark-200">ERC-1155 Multi-Tokens:</strong> Receive and send multi-tokens. The vault
              implements <code className="text-primary-400 bg-dark-700 px-1.5 py-0.5 rounded text-sm">onERC1155Received</code> and <code className="text-primary-400 bg-dark-700 px-1.5 py-0.5 rounded text-sm">onERC1155BatchReceived</code> for
              safe transfers.
            </li>
          </ul>
          <p>
            The frontend displays token balances, NFT holdings, and ERC-1155 inventory in dedicated panels
            on the vault detail page. Token metadata is automatically discovered by the indexer.
          </p>
        </div>
      </div>

      {/* Best Practices */}
      <div className="vault-panel p-6 mb-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">Best Practices</h2>
        <div className="space-y-4 text-base text-dark-300">
          <div>
            <h3 className="font-semibold text-dark-200 mb-2">Choose Appropriate Thresholds</h3>
            <p className="text-dark-400 leading-relaxed">
              Balance security with operational efficiency. A 2-of-3 multisig is good for small teams,
              while larger organizations might use 3-of-5 or higher thresholds.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-dark-200 mb-2">Verify Transaction Details</h3>
            <p className="text-dark-400 leading-relaxed">
              Always carefully review transaction details before approving. Check the destination address,
              amount, and decoded function calls (if applicable).
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-dark-200 mb-2">Configure Timelocks for High-Value Vaults</h3>
            <p className="text-dark-400 leading-relaxed">
              Set a minimum execution delay on your vault to give owners time to review and cancel suspicious
              transactions after they reach threshold. Use transaction expirations to prevent stale proposals
              from being executed long after they were proposed.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-dark-200 mb-2">Enable Social Recovery</h3>
            <p className="text-dark-400 leading-relaxed">
              Consider enabling the Social Recovery module to protect against key loss.
              See the <Link to="/docs/modules" className="text-primary-500 hover:text-primary-400 underline">Modules</Link> documentation.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-dark-200 mb-2">Keep Owner Keys Secure</h3>
            <p className="text-dark-400 leading-relaxed">
              Each owner's private key should be stored securely. Consider using hardware wallets for
              production multisig wallets.
            </p>
          </div>
        </div>
      </div>

      {/* Related Documentation */}
      <div className="vault-panel p-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">Related Documentation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/docs/modules"
            className="vault-panel p-4 hover:border-primary-500/50 transition-all group"
          >
            <h3 className="text-base font-display font-bold text-dark-200 mb-2 group-hover:text-primary-400 transition-colors">
              Modules
            </h3>
            <p className="text-sm text-dark-400">
              Extend your vault with Social Recovery and Zodiac-compatible modules.
            </p>
          </Link>
          <Link
            to="/docs/security"
            className="vault-panel p-4 hover:border-primary-500/50 transition-all group"
          >
            <h3 className="text-base font-display font-bold text-dark-200 mb-2 group-hover:text-primary-400 transition-colors">
              Security
            </h3>
            <p className="text-sm text-dark-400">
              Learn about security best practices for multisig wallets.
            </p>
          </Link>
        </div>
      </div>
    </DocLayout>
  );
}
