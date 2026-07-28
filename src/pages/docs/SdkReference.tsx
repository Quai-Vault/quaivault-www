import { Link } from 'react-router-dom';
import DocLayout from '../../components/DocLayout';

const panel = 'vault-panel p-6 mb-6';
const h2 = 'text-lg font-display font-bold text-dark-200 mb-4';
const h3 = 'text-base font-display font-bold text-dark-200 mb-2';
const prose = 'text-base text-dark-300 leading-relaxed';
const code = 'bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-sm';
const block =
  'bg-vault-dark-4 rounded p-4 border border-dark-600 font-mono text-xs text-dark-300 overflow-x-auto';

/** A signature list with per-entry notes. */
function Api({ entries }: { entries: Array<[string, string]> }) {
  return (
    <div className="space-y-2">
      {entries.map(([sig, note]) => (
        <div key={sig} className="bg-vault-dark-4 rounded p-3 border border-dark-600">
          <p className="font-mono text-sm text-primary-400 break-words">{sig}</p>
          {note && <p className="text-xs text-dark-400 mt-1">{note}</p>}
        </div>
      ))}
    </div>
  );
}

export default function SdkReference() {
  return (
    <DocLayout
      title="SDK Reference"
      description="Complete API surface for @quaivault/sdk — client, vault, factory, recovery, errors and utilities."
    >
      {/* Client */}
      <div className={panel}>
        <h2 className={h2}>Client</h2>
        <Api
          entries={[
            ['connect(options?): QuaiVaultClient', 'Entry point. Performs no I/O until a method is called.'],
            ['qv.vault(address): Vault', 'Handle to one vault. No I/O.'],
            ['qv.network / qv.provider / qv.signer', 'Resolved network, provider, and signer (null when read-only).'],
            ['qv.config', 'Resolved config with the private key stripped and the indexer key masked — safe to log.'],
            ['await qv.address()', 'Connected address, or null.'],
            ['await qv.indexerHealth()', 'Liveness and lag: { available, lastIndexedBlock, blocksBehind, isSyncing }.'],
          ]}
        />

        <h3 className={`${h3} mt-5`}>Discovery</h3>
        <Api
          entries={[
            ['await qv.vaults.forOwner(address, page?)', 'Indexer-only — no on-chain reverse index exists.'],
            ['await qv.vaults.forGuardian(address, page?)', 'Vaults where the address is an active guardian.'],
            ['await qv.vaults.exists(address)', 'Whether the factory deployed or registered this vault.'],
          ]}
        />
      </div>

      {/* Factory */}
      <div className={panel}>
        <h2 className={h2}>Factory</h2>
        <Api
          entries={[
            ['await qv.factory.create(params, options?)', 'Mines a salt if none is given, deploys, returns { address, salt, chainTxHash, predictionMatched }.'],
            ['await qv.factory.mineSalt(params, options?, strategy?)', 'Mine only. Reusable later with identical params.'],
            ['qv.factory.predictAddress(deployer, salt, params)', 'Off-chain CREATE2 prediction; matches predictWalletAddress exactly.'],
            ['await qv.factory.verify()', 'Confirms the configured implementation matches the factory. Catches a misconfiguration before it produces wrong addresses.'],
            ['await qv.factory.implementation()', 'Implementation every proxy delegates to.'],
            ['await qv.factory.vaultCount() / vaultAt(i)', 'Registry enumeration.'],
            ['await qv.factory.register(vault)', 'Register an externally deployed proxy. Owner-only.'],
          ]}
        />
        <p className={`${prose} mt-3 text-sm text-dark-400`}>
          <code className={code}>CreateVaultParams</code>: <code className={code}>owners</code>,{' '}
          <code className={code}>threshold</code>, and optionally{' '}
          <code className={code}>minExecutionDelay</code> (0–30 days),{' '}
          <code className={code}>initialModules</code>,{' '}
          <code className={code}>initialDelegatecallTargets</code>,{' '}
          <code className={code}>salt</code>. Max 20 owners.
        </p>
      </div>

      {/* Vault reads */}
      <div className={panel}>
        <h2 className={h2}>Vault — reads</h2>
        <Api
          entries={[
            ['await vault.info()', 'owners, threshold, minExecutionDelay, nonce, moduleCount, balance.'],
            ['await vault.owners() / threshold() / balance()', ''],
            ['await vault.modules()', 'In linked-list order — always read from chain, because disableModule needs the predecessor.'],
            ['await vault.delegatecallTargets()', 'Indexer-only: the on-chain mapping is not enumerable.'],
            ['await vault.isOwner(a) / isModuleEnabled(m) / isDelegatecallAllowed(t)', ''],
            ['await vault.isValidSignature(hash)', 'Whether a hash is pre-approved for EIP-1271.'],
            ['await vault.transaction(txHash)', 'One transaction as a VaultTransaction.'],
            ['await vault.pendingTransactions(page?)', ''],
            ['await vault.transactionHistory(page?)', 'Executed, cancelled, expired and failed.'],
            ['await vault.transactionHash(to, value, data, nonce?)', 'Compute a vault-transaction hash.'],
            ['await vault.balances(options?)', 'Native plus tokens. Discovery via the indexer; amounts verified on chain by default.'],
            ['await vault.deposits(page?) / tokenTransfers(page?) / signedMessages()', ''],
            ['await vault.affordances(txHash, caller?)', 'What the caller may legally do now, and when blocked actions unlock.'],
            ['await vault.describe(txHash, caller?)', 'Compact human-readable summary.'],
          ]}
        />
      </div>

      {/* Vault writes */}
      <div className={panel}>
        <h2 className={h2}>Vault — proposals</h2>
        <p className={`${prose} mb-3 text-sm`}>
          Every method is async, and every one accepts{' '}
          <code className={code}>{'{ expiration, executionDelay, dryRun }'}</code>. Validation
          failures are always rejections, never synchronous throws.
        </p>
        <Api
          entries={[
            ['propose.call({ to, value?, data? })', 'Arbitrary call. Everything else routes through this.'],
            ['propose.transfer({ to, amount })', 'Native QUAI.'],
            ['propose.erc20Transfer({ token, to, amount })', ''],
            ['propose.erc721Transfer({ token, to, tokenId })', ''],
            ['propose.erc1155Transfer({ token, to, id, amount, data? })', ''],
            ['propose.batch(calls, options?)', 'Via MultiSendCallOnly; checks the DelegateCall whitelist first.'],
            ['propose.addOwner(a) / removeOwner(a) / changeThreshold(n)', 'Self-calls. removeOwner pre-checks the threshold.'],
            ['propose.setMinExecutionDelay(seconds)', '0–30 days.'],
            ['propose.enableModule(m) / disableModule(m)', 'disableModule resolves the linked-list predecessor for you.'],
            ['propose.addDelegatecallTarget(t) / removeDelegatecallTarget(t)', ''],
            ['propose.cancelByConsensus(txHash)', 'The post-quorum cancellation path.'],
            ['propose.signMessage(bytes) / unsignMessage(bytes)', 'Arbitrary message.'],
            ['propose.approveHashForEip1271(hash) / revokeHashForEip1271(hash)', 'Enforces the 32-byte precondition.'],
            ['propose.setupRecovery({ guardians, threshold, recoveryPeriodSeconds })', 'Call to the module, not a self-call.'],
          ]}
        />

        <h3 className={`${h3} mt-5`}>Lifecycle</h3>
        <Api
          entries={[
            ['await vault.approve(txHash)', ''],
            ['await vault.execute(txHash) → ExecuteResult', 'Read the outcome; a receipt alone is not proof of execution.'],
            ['await vault.approveAndExecute(txHash) → ExecuteResult', ''],
            ['await vault.revokeApproval(txHash)', ''],
            ['await vault.cancel(txHash)', 'Proposer-only, and only before quorum is ever reached.'],
            ['await vault.expire(txHash)', 'Permissionless once past the deadline.'],
            ['await vault.waitForExecutable(txHash, options?)', 'Polls until ready; fails fast when waiting cannot help.'],
            ['await vault.waitForIndexer(blockNumber?, options?)', 'Closes the write-then-read race. Returns { reached, lastIndexedBlock }.'],
            ['vault.watch(handler, options?) → Subscription', 'Supabase Realtime; one channel per vault.'],
          ]}
        />
      </div>

      {/* Recovery */}
      <div className={panel}>
        <h2 className={h2}>Social recovery</h2>
        <Api
          entries={[
            ['await vault.recovery.config()', '{ guardians, threshold, recoveryPeriod, configured }.'],
            ['await vault.recovery.isGuardian(a) / isEnabled() / hasPending()', ''],
            ['await vault.recovery.get(hash) / pending() / history(page?)', 'get() throws for a cancelled recovery — cancellation deletes the on-chain record.'],
            ['await vault.recovery.approvals(hash)', 'Guardians with an active approval.'],
            ['await vault.recovery.predictHash(newOwners, newThreshold)', ''],
            ['await vault.recovery.initiate({ newOwners, newThreshold })', 'Guardians only. Returns { recoveryHash, chainTxHash }.'],
            ['await vault.recovery.approve(h) / revokeApproval(h)', 'Guardians only.'],
            ['await vault.recovery.execute(h)', 'Pre-checks the transient owner count against the 20-owner cap.'],
            ['await vault.recovery.cancel(h)', 'Any current vault owner.'],
            ['await vault.recovery.expire(h)', 'Permissionless once past the deadline.'],
            ['await vault.recovery.affordances(hash, caller?)', ''],
          ]}
        />
      </div>

      {/* Types */}
      <div className={panel}>
        <h2 className={h2}>Key types</h2>

        <h3 className={h3}>VaultTransaction</h3>
        <div className={block}>
          <pre>{`{
  hash, vault, to, value, data,
  proposer, proposedAt,
  kind,          // 'transfer' | 'wallet_admin' | 'erc20_transfer' | ...
  decoded?,      // { name, signature, args, target }
  summary,       // one-line human-readable description

  status,        // 'pending' | 'timelocked' | 'ready' | 'executed'
                 // | 'failed' | 'cancelled' | 'expired'
  approvals,     // [{ owner, active }]
  approvalCount, // intersected with the live owner set
  threshold,

  expiration, executionDelay, approvedAt, executableAfter,
  failedReturnData?, decodedRevert?,
  source,        // 'indexer' | 'chain'
  indexedAtBlock?,
}`}</pre>
        </div>
        <p className={`${prose} mt-2 text-sm text-dark-400`}>
          <code className={code}>ready</code> and <code className={code}>timelocked</code> are SDK
          refinements of the contract's "pending": both mean quorum reached and not yet executed,
          differing only on whether the delay has elapsed.
        </p>

        <h3 className={`${h3} mt-5`}>ExecuteResult</h3>
        <div className={block}>
          <pre>{`{
  outcome,       // 'executed' | 'failed' | 'timelock_started' | 'approved_only'
  txHash, chainTxHash, blockNumber, gasUsed,
  returnData?, decodedRevert?,   // when outcome === 'failed'
  executableAfter?,              // when outcome === 'timelock_started'
  approvalsNeeded?,              // when outcome === 'approved_only'
  message,                       // plain-language explanation
}`}</pre>
        </div>

        <h3 className={`${h3} mt-5`}>Affordance</h3>
        <div className={block}>
          <pre>{`{
  action,        // 'approve' | 'execute' | 'cancel' | 'expire' | ...
  allowed,
  reason,        // why not, in plain language
  availableAt?,  // unix seconds when a time gate lifts
  blockedBy?,    // 'not_owner' | 'threshold' | 'timelock' | 'quorum_locked' | ...
}`}</pre>
        </div>
      </div>

      {/* Errors */}
      <div className={panel}>
        <h2 className={h2}>Errors</h2>
        <p className={`${prose} mb-3`}>
          Every error extends <code className={code}>QuaiVaultError</code> with a stable{' '}
          <code className={code}>code</code>, a <code className={code}>remediation</code> string and{' '}
          <code className={code}>toJSON()</code>. Reverts are decoded against all QuaiVault ABIs — 73
          custom error selectors — and rendered with guidance.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-dark-300">
            <thead>
              <tr className="text-left text-dark-500 border-b border-dark-600">
                <th className="pb-2 pr-4 font-normal font-mono">code</th>
                <th className="pb-2 pr-4 font-normal font-mono">class</th>
                <th className="pb-2 font-normal">Meaning</th>
              </tr>
            </thead>
            <tbody className="align-top">
              {[
                ['CONFIG', 'ConfigError', 'Missing or invalid configuration, including an unusable private key'],
                ['NO_SIGNER', 'NoSignerError', 'A write was attempted on a read-only client'],
                ['NO_INDEXER', 'NoIndexerError', 'An indexer-only operation without indexer configuration'],
                ['INDEXER_QUERY', 'IndexerQueryError', 'The indexer query failed'],
                ['VALIDATION', 'ValidationError', 'Bad input — including Qi and zone-less addresses'],
                ['NOT_FOUND', 'NotFoundError', 'No such transaction or recovery'],
                ['PRECONDITION', 'PreconditionError', 'A contract rule would reject this; checked before signing'],
                ['REVERT', 'RevertError', 'The call reverted; carries the decoded custom error'],
                ['SALT_MINING', 'SaltMiningError', 'No shard-valid salt found within the budget'],
                ['STALE_PROPOSAL', 'StaleProposalError', 'A disableModule proposal whose predecessor is now wrong'],
              ].map(([c, cls, meaning]) => (
                <tr key={c} className="border-b border-dark-700/50">
                  <td className="py-2 pr-4 font-mono text-primary-400 whitespace-nowrap">{c}</td>
                  <td className="py-2 pr-4 font-mono whitespace-nowrap">{cls}</td>
                  <td className="py-2">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={`${block} mt-4`}>
          <pre>{`NotEnoughApprovals — The approval threshold has not been reached yet.

DelegateCallNotAllowed(0x00…) — DelegateCall targets must be explicitly
  whitelisted. Propose addDelegatecallTarget for this address first.`}</pre>
        </div>
      </div>

      {/* Utilities */}
      <div className={panel}>
        <h2 className={h2}>Standalone utilities</h2>
        <p className={`${prose} mb-3 text-sm`}>Usable without a client.</p>
        <div className={block}>
          <pre>{`import {
  // CREATE2
  predictVaultAddress, mineSalt, shardPrefixOf, encodeInitData,

  // addresses
  assertQuaiAddress, isUsableQuaiAddress, inspectAddress,

  // encoding / decoding
  selfCall, tokenCalls, encodeMultiSend, minimumExpiration,
  decodeCall, decodeMultiSendPayload,

  // lifecycle
  classifyExecution, deriveStatus, deriveRecoveryStatus, computeAffordances,

  // errors
  decodeRevert, knownErrorSelectors, remediationFor,

  // resilience
  withRetry, isTransient,

  // config
  networks, mainnet, testnet, ENV_VARS,
} from '@quaivault/sdk';

import { QuaiVaultAbi, QuaiVaultFactoryAbi } from '@quaivault/sdk/abi';`}</pre>
        </div>
      </div>

      <div className={panel}>
        <h2 className={h2}>See also</h2>
        <div className="space-y-3">
          <div>
            <Link to="/docs/sdk" className="text-primary-500 hover:text-primary-400 underline">
              SDK
            </Link>
            <p className="text-sm text-dark-500 mt-1">Install, configure, and quickstart.</p>
          </div>
          <div>
            <Link to="/docs/sdk-guides" className="text-primary-500 hover:text-primary-400 underline">
              SDK Guides
            </Link>
            <p className="text-sm text-dark-500 mt-1">Recipes and the behaviours that surprise people.</p>
          </div>
          <div>
            <Link to="/docs/developer-guide" className="text-primary-500 hover:text-primary-400 underline">
              Developer Guide
            </Link>
            <p className="text-sm text-dark-500 mt-1">
              Contract-level integration without the SDK.
            </p>
          </div>
        </div>
      </div>
    </DocLayout>
  );
}
