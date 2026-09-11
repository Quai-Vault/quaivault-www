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
      description="Complete API surface for @quaivault/sdk v0.6.1 — client, vault, factory, recovery, types, errors and utilities."
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
            ['qv.now: Clock', 'Configured source of "now", in Unix seconds. Defaults to the local clock.'],
            ['qv.abis: AbiLookup | undefined', 'Configured ABI lookup for contracts the SDK does not ship.'],
            ['qv.indexer / qv.queries', 'IndexerClient and typed query layer, or null when no indexer is configured.'],
            ['await qv.address()', 'Connected address, or null.'],
            ['await qv.indexerHealth()', 'Liveness and lag: { available, lastIndexedBlock, chainHead?, blocksBehind?, isSyncing, error? }.'],
          ]}
        />

        <h3 className={`${h3} mt-5`}>Discovery</h3>
        <Api
          entries={[
            ['await qv.vaults.forOwner(address, page?) → Address[]', 'Indexer-only — no on-chain reverse index exists. Throws NoIndexerError without one.'],
            ['await qv.vaults.forGuardian(address, page?) → Address[]', 'Vaults where the address is an active guardian. Indexer-only.'],
            ['await qv.vaults.exists(address)', 'Whether the factory deployed or registered this vault. Reads chain.'],
            ['qv.vaults.get(address) → Vault', 'Alias for qv.vault(address).'],
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
            ['await qv.factory.verify() → { valid, errors }', 'Confirms the configured implementation matches the factory. Catches a misconfiguration before it produces wrong addresses.'],
            ['await qv.factory.implementation()', 'Implementation every proxy delegates to.'],
            ['qv.factory.address', 'Configured factory address.'],
            ['await qv.factory.vaultCount() / vaultAt(i) / isRegistered(v)', 'Registry enumeration and membership.'],
            ['await qv.factory.register(vault)', 'Register an externally deployed proxy. Owner-only.'],
          ]}
        />
        <p className={`${prose} mt-3 text-sm text-dark-400`}>
          <code className={code}>CreateVaultParams</code>: <code className={code}>owners</code>,{' '}
          <code className={code}>threshold</code>, and optionally{' '}
          <code className={code}>minExecutionDelay</code> (0–30 days),{' '}
          <code className={code}>initialModules</code>,{' '}
          <code className={code}>initialDelegatecallTargets</code>,{' '}
          <code className={code}>salt</code>. Capped at 20 owners and 50 initial modules, both
          validated before deploying rather than reverting on chain.
        </p>
      </div>

      {/* Vault reads */}
      <div className={panel}>
        <h2 className={h2}>Vault — reads</h2>
        <Api
          entries={[
            ['await vault.info()', 'owners, threshold, minExecutionDelay, nonce, moduleCount, balance.'],
            ['await vault.owners() / threshold() / balance()', ''],
            ['await vault.view() → VaultView', 'Explicit owners + threshold snapshot with a visible capturedAt and source.'],
            ['vault.pinned(view) → Vault', 'A handle that reuses that snapshot for reads. Write preconditions bypass it by construction, so a pinned view can never gate a signature.'],
            ['await vault.modules()', 'In linked-list order — always read from chain, because disableModule needs the predecessor.'],
            ['await vault.previousModule(m)', 'The linked-list predecessor disableModule requires.'],
            ['await vault.delegatecallTargets()', 'Indexer-only: the on-chain mapping is not enumerable.'],
            ['await vault.isOwner(a) / isModuleEnabled(m) / isDelegatecallAllowed(t)', ''],
            ['await vault.hasApproved(txHash, owner)', 'Whether that owner currently has an active approval.'],
            ['await vault.isValidSignature(hash)', 'Whether a hash is pre-approved for EIP-1271.'],
            ['await vault.transaction(txHash)', 'One transaction as a VaultTransaction.'],
            ['await vault.transactions(txHashes) → Map', 'Batched. Shares one owner/threshold read and one confirmations query across the set.'],
            ['await vault.pendingTransactions(page?)', ''],
            ['await vault.transactionHistory(page?)', 'Executed, cancelled, expired and failed.'],
            ['await vault.transactionHash(to, value, data, nonce?)', 'Compute a vault-transaction hash.'],
            ['await vault.balances(options?)', 'Native plus tokens. Discovery via the indexer; amounts verified on chain by default.'],
            ['await vault.deposits(page?) / tokenTransfers(page?) / signedMessages()', ''],
            ['await vault.affordances(txHash, caller?, at?)', 'What the caller may legally do now, and when blocked actions unlock. at overrides the configured clock for this call.'],
            ['await vault.describe(txHash, caller?)', 'Compact human-readable summary.'],
          ]}
        />
        <p className={`${prose} mt-3 text-sm text-dark-400`}>
          <code className={code}>BalanceOptions</code>: <code className={code}>verify</code>{' '}
          (default true), <code className={code}>maxTokens</code> (50),{' '}
          <code className={code}>transferScanLimit</code> (500),{' '}
          <code className={code}>maxTokenIdChecks</code> (100),{' '}
          <code className={code}>concurrency</code> (8). Scan limits that bind are reported back in{' '}
          <code className={code}>VaultBalances.truncated</code> rather than silently dropping
          holdings.
        </p>
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
            ['await vault.waitForExecutable(txHash, options?)', 'Polls until ready; if quorum exists but the clock has not started, call execute() once before waiting. Poll delays honor AbortSignal immediately.'],
            ['await vault.waitForIndexer(blockNumber?, options?)', 'Closes the write-then-read race. Returns { reached, lastIndexedBlock }.'],
            ['vault.watch(handler, options?) → Subscription', 'Realtime; one channel per vault. Events fire after the indexer processes a block, so treat them as a signal to re-read.'],
          ]}
        />
        <p className={`${prose} mt-3 text-sm text-dark-400`}>
          <code className={code}>WatchOptions.topics</code>:{' '}
          <code className={code}>transactions</code>, <code className={code}>confirmations</code>,{' '}
          <code className={code}>owners</code>, <code className={code}>modules</code>,{' '}
          <code className={code}>deposits</code>, <code className={code}>tokenTransfers</code>,{' '}
          <code className={code}>recoveries</code>, <code className={code}>signedMessages</code>.{' '}
          <code className={code}>onStatus</code> surfaces subscription lifecycle changes so you can
          show reconnects.
        </p>
      </div>

      {/* Recovery */}
      <div className={panel}>
        <h2 className={h2}>Social recovery</h2>
        <Api
          entries={[
            ['await vault.recovery.config()', '{ guardians, threshold, recoveryPeriod, configured }.'],
            ['await vault.recovery.isGuardian(a) / isEnabled() / hasPending() / pendingHashes()', ''],
            ['await vault.recovery.get(hash) / pending()', 'get() throws for a cancelled recovery — cancellation deletes the on-chain record.'],
            ['await vault.recovery.history(page?)', 'Indexer-only. Throws NoIndexerError without one, rather than returning [] — an empty array is indistinguishable from "no recovery history".'],
            ['await vault.recovery.approvals(hash)', 'Guardians with an active approval.'],
            ['await vault.recovery.predictHash(newOwners, newThreshold)', ''],
            ['await vault.recovery.initiate({ newOwners, newThreshold })', 'Guardians only. Returns { recoveryHash, chainTxHash }.'],
            ['await vault.recovery.approve(h) / revokeApproval(h)', 'Guardians only.'],
            ['await vault.recovery.execute(h)', 'Pre-checks the transient owner count against the 20-owner cap.'],
            ['await vault.recovery.cancel(h)', 'Any current vault owner.'],
            ['await vault.recovery.expire(h)', 'Permissionless once past the deadline.'],
            ['await vault.recovery.affordances(hash, caller?, at?)', 'at overrides the configured clock for this call.'],
          ]}
        />
        <p className={`${prose} mt-3 text-sm text-dark-400`}>
          Recovery status is derived from timestamps rather than read from a stored flag, and
          nothing transitions a recovery to expired on its own —{' '}
          <code className={code}>expire</code> is a permissionless cleanup call somebody has to
          make. An un-cleaned recovery therefore still reads as{' '}
          <code className={code}>pending</code> in the indexer long after its deadline.
        </p>
      </div>

      {/* Types */}
      <div className={panel}>
        <h2 className={h2}>Key types</h2>

        <h3 className={h3}>VaultTransaction</h3>
        <div className={block}>
          <pre>{`{
  hash, vault, to, value, data,
  proposer,
  proposedAt,       // Unix seconds — 0 on indexer reads. Never render 0 as a date.
  proposedAtBlock?, // block number — indexer reads only

  kind,          // 'transfer' | 'wallet_admin' | 'erc20_transfer' | ...
  decoded?,      // { name, signature, args, target, selector }
  summary,       // one-line human-readable description
  abiSource,     // 'builtin' | 'heuristic' | 'supplied' | 'none' — required

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
        <p className={`${prose} mt-2 text-sm text-dark-400`}>
          Only chain reads carry a proposal timestamp — the vault stores one in the transaction
          struct, while the indexer records the block instead. Use{' '}
          <code className={code}>proposedAtBlock</code> when{' '}
          <code className={code}>source === 'indexer'</code>.
        </p>

        <h3 className={`${h3} mt-5`}>AbiSource</h3>
        <p className={`${prose} mb-2 text-sm`}>
          Present on every <code className={code}>VaultTransaction</code> and{' '}
          <code className={code}>DecodeResult</code>. It measures how the ABI was bound to the
          target address — the part that can be wrong — not merely where the ABI came from. Render
          it in any UI where an owner approves based on the summary.
        </p>
        <div className={block}>
          <pre>{`'builtin'    // the SDK knows which contract this address is
'heuristic'  // selector shape alone, against an unknown address — usually right, never verified
'supplied'   // an ABI you provided via ClientOptions.abis / DecodeContext.abis
'none'       // nothing matched; only the 4-byte selector is known`}</pre>
        </div>

        <h3 className={`${h3} mt-5`}>VaultView</h3>
        <div className={block}>
          <pre>{`{
  owners, threshold,
  capturedAt,    // Unix seconds the snapshot was taken
  source,        // 'indexer' | 'chain'
}`}</pre>
        </div>

        <h3 className={`${h3} mt-5`}>Page&lt;T&gt;</h3>
        <div className={block}>
          <pre>{`{
  data,      // T[]
  total,     // APPROXIMATE on large result sets — planner estimate, not a full scan
  hasMore,   // always exact. This is what a paging loop should test.
}`}</pre>
        </div>

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

        <h3 className={`${h3} mt-5`}>RecoveryRequest</h3>
        <div className={block}>
          <pre>{`{
  hash, vault, newOwners, newThreshold,
  approvalCount,
  requiredThreshold,  // captured at initiation — later config changes do not move it
  executionTime,      // unix seconds after which execution is permitted
  expiration,         // unix seconds after which it is dead and can be cleaned up
  status,             // 'pending' | 'timelocked' | 'ready' | 'executed'
                      // | 'cancelled' | 'expired'
  executed,
  initiator?,         // indexer reads only — the module's struct does not retain it
  source,             // 'indexer' | 'chain'
}`}</pre>
        </div>
        <p className={`${prose} mt-2 text-sm text-dark-400`}>
          <code className={code}>cancelled</code> is only ever reported from the indexer.{' '}
          <code className={code}>cancelRecovery</code> deletes the on-chain struct, so a chain read
          cannot distinguish a cancelled recovery from one that never existed.
        </p>
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
                ['ABORTED', 'AbortError', 'An AbortSignal fired — one typed error for every abort path'],
                ['BROADCAST_UNKNOWN', 'BroadcastError', 'Submitted but receipt unverified; carries chainTxHash. Reconcile before retrying.'],
                ['CONFIG', 'ConfigError', 'Missing or invalid configuration, unusable private key, or RPC chain ID mismatch'],
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
  predictVaultAddress, mineSalt, shardPrefixOf,
  encodeInitData, computeBytecodeHash, computeFullSalt,

  // addresses
  assertQuaiAddress, assertQuaiAddresses, isUsableQuaiAddress, inspectAddress,

  // encoding
  selfCall, tokenCalls, recoveryCall, encodeMultiSend,
  encodeMultiSendPayload, minimumExpiration, interfaces,

  // decoding
  decodeCall, decodeMultiSendPayload, abiRegistry,

  // lifecycle
  classifyExecution, extractProposedTxHash,
  deriveStatus, deriveRecoveryStatus, executableAfterOf, isTerminal, nowSeconds,
  computeAffordances, allowedActions,

  // errors
  decodeRevert, decodeRevertFromError, knownErrorSelectors, remediationFor,

  // resilience and concurrency
  withRetry, isTransient, mapPooled, DEFAULT_CONCURRENCY,

  // display safety
  sanitizeText, DEFAULT_TEXT_LIMIT,

  // config and limits
  networks, mainnet, testnet, isNetworkName, resolveConfig, ENV_VARS,
  MAX_OWNERS, MAX_MODULES, MAX_EXECUTION_DELAY, SENTINEL_MODULES, ZERO_ADDRESS,
} from '@quaivault/sdk';

import { QuaiVaultAbi, QuaiVaultFactoryAbi } from '@quaivault/sdk/abi';`}</pre>
        </div>
        <p className={`${prose} mt-3 text-sm text-dark-400`}>
          <code className={code}>sanitizeText</code> strips ANSI escapes, bidi overrides and
          zero-width characters from attacker-controlled display strings. The SDK already applies it
          to token <code className={code}>symbol</code> / <code className={code}>name</code> and to
          revert reasons — both deployer-chosen, and both destined for terminals. Apply it yourself
          to any other on-chain string you render.
        </p>
      </div>

      {/* Indexer */}
      <div className={panel}>
        <h2 className={h2}>Indexer access</h2>
        <p className={`${prose} mb-3 text-sm`}>
          For queries the typed surface does not cover. Available as{' '}
          <code className={code}>qv.indexer</code>, or <code className={code}>null</code> when no
          indexer is configured.
        </p>
        <Api
          entries={[
            ['qv.indexer.rest → PostgrestClient', 'Escape hatch to the raw query builder.'],
            ['qv.indexer.from(table)', 'Schema-scoped query builder for one table.'],
            ['qv.indexer.channel(name) / removeChannel(ch)', 'Realtime channels, for subscriptions beyond vault.watch().'],
            ['await qv.indexer.state()', '{ lastIndexedBlock, isSyncing }, or null.'],
            ['await qv.indexer.health(force?)', 'Cached liveness and lag probe.'],
            ['await qv.indexer.waitForBlock(n, options?)', 'Underlying primitive behind vault.waitForIndexer().'],
          ]}
        />
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
