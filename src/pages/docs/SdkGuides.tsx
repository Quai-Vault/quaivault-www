import { Link } from 'react-router-dom';
import DocLayout from '../../components/DocLayout';

const panel = 'vault-panel p-6 mb-6';
const h2 = 'text-lg font-display font-bold text-dark-200 mb-4';
const h3 = 'text-base font-display font-bold text-dark-200 mb-2';
const prose = 'text-base text-dark-300 leading-relaxed';
const code = 'bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-sm';
const block =
  'bg-vault-dark-4 rounded p-4 border border-dark-600 font-mono text-xs text-dark-300 overflow-x-auto';
const warn = 'border-l-2 border-primary-500 pl-4 py-1';

export default function SdkGuides() {
  return (
    <DocLayout
      title="SDK Guides"
      description="Task-oriented recipes, the three Quai Vault behaviours that catch people out, and what to do when the SDK cannot vouch for a decode."
    >
      {/* ---------------- Gotcha 1 ---------------- */}
      <div className={panel}>
        <h2 className={h2}>A successful receipt does not mean it executed</h2>
        <div className={`${prose} space-y-3`}>
          <p>
            This is the single most important thing to understand about Quai Vault. Three separate
            paths produce a Quai transaction with{' '}
            <code className={code}>status === 1</code> while the vault transaction did{' '}
            <strong className="text-dark-200">not</strong> run:
          </p>

          <div className={warn}>
            <p className="mb-2">
              <strong className="text-dark-200">The external call reverted.</strong> The vault marks
              the transaction executed <em>permanently</em> and emits{' '}
              <code className={code}>TransactionFailed</code> rather than reverting, so the outer
              transaction succeeds. This state is terminal — the proposal can never be retried.
            </p>
            <p className="mb-2">
              <strong className="text-dark-200">The timelock clock had not started.</strong> If a
              timelocked transaction reached quorum without <code className={code}>approvedAt</code>{' '}
              being set — for example the threshold was lowered after owners had approved — the first{' '}
              <code className={code}>execute</code> call starts the clock and returns. It
              deliberately does not revert, because a revert would roll back the clock start.
            </p>
            <p>
              <strong className="text-dark-200">approveAndExecute returned false.</strong> The
              threshold was unmet or the timelock had not elapsed. A boolean return value is
              invisible in a receipt.
            </p>
          </div>

          <p>
            The SDK classifies all of this from the receipt logs and hands you a discriminated
            result:
          </p>
        </div>

        <div className={`${block} mt-3`}>
          <pre>{`const result = await vault.execute(txHash);

switch (result.outcome) {
  case 'executed':
    break;                          // the target call succeeded

  case 'failed':
    // Terminal. Propose a replacement — this one can never run.
    console.error(result.decodedRevert?.message);
    break;

  case 'timelock_started':
    // Nothing ran. Come back after the delay.
    await vault.waitForExecutable(txHash);
    await vault.execute(txHash);
    break;

  case 'approved_only':
    // Your approval was recorded; more signatures are needed.
    break;
}

console.log(result.message); // plain-language explanation of what happened`}</pre>
        </div>
      </div>

      {/* ---------------- Gotcha 2 ---------------- */}
      <div className={panel}>
        <h2 className={h2}>Vault addresses have to be mined</h2>
        <div className={`${prose} space-y-3`}>
          <p>
            Quai addresses are shard-scoped. A vault deployed outside the deployer's shard is
            unreachable from it, so the CREATE2 salt must be brute-forced until the predicted address
            carries a valid shard prefix. <code className={code}>factory.create()</code> does this
            automatically.
          </p>
          <p>
            The predicted address is a pure function of the factory, implementation, deployer, salt
            and <em>every</em> create parameter — including{' '}
            <code className={code}>initialModules</code> and{' '}
            <code className={code}>initialDelegatecallTargets</code>. Mining with different
            parameters than you deploy with predicts the wrong address.
          </p>
        </div>

        <div className={`${block} mt-3`}>
          <pre>{`// Mine and deploy in one step
const { address, salt, predictionMatched } = await qv.factory.create(
  {
    owners: [a, b, c],
    threshold: 2,
    minExecutionDelay: 86_400,                    // 1 day, max 30 days
    initialModules: [socialRecoveryAddress],      // must match at mine time
    initialDelegatecallTargets: [multiSendAddress],
  },
  { onProgress: (p) => console.log(p.step, p.message) },
);

// Or mine ahead of time and deploy later with identical params
const mined = await qv.factory.mineSalt(params);
await qv.factory.create({ ...params, salt: mined.salt });`}</pre>
        </div>
      </div>

      {/* ---------------- Gotcha 3 ---------------- */}
      <div className={panel}>
        <h2 className={h2}>Qi addresses cannot be owners</h2>
        <div className={`${prose} space-y-3`}>
          <p>
            Quai has two ledgers. <strong className="text-dark-200">Qi is a UTXO ledger with no
            contract execution</strong>, so a Qi address can never sign a vault transaction, approve
            a recovery, or receive value that stays on the Quai side.
          </p>
          <p>
            The contracts do not check for this — <code className={code}>_addOwner</code> rejects only
            the zero address, the vault itself and the module sentinel. A Qi owner is permanent dead
            weight against the threshold, and enough of them brick the vault.
          </p>
          <p>Two independent properties are encoded in every address, and both must hold:</p>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm text-dark-300">
            <thead>
              <tr className="text-left text-dark-500 border-b border-dark-600">
                <th className="pb-2 pr-4 font-normal">Property</th>
                <th className="pb-2 pr-4 font-normal">Where</th>
                <th className="pb-2 font-normal">Valid</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-dark-700/50">
                <td className="py-2 pr-4">Zone</td>
                <td className="py-2 pr-4 font-mono">first byte</td>
                <td className="py-2 font-mono">0x00–0x02, 0x10–0x12, 0x20–0x22</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Ledger</td>
                <td className="py-2 pr-4 font-mono">9th bit</td>
                <td className="py-2 font-mono">clear = Quai, set = Qi</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className={`${prose} mt-3`}>
          They are orthogonal: <code className={code}>0x0081…</code> sits in a real zone but is Qi,
          and <code className={code}>0x7E11…</code> is Quai-ledger but in no zone. The SDK rejects
          both wherever an address takes a role or receives value. Removals stay permissive, so a
          vault that admitted a bad address can still clean it up.
        </p>

        <div className={`${block} mt-3`}>
          <pre>{`import { isUsableQuaiAddress, inspectAddress } from '@quaivault/sdk';

isUsableQuaiAddress('0x0081...');  // false
inspectAddress('0x0081...');
// { valid: false, zone: '0x00', ledger: 'qi', reason: 'is a Qi-ledger address, ...' }`}</pre>
        </div>
      </div>

      {/* ---------------- Recipes ---------------- */}
      <div className={panel}>
        <h2 className={h2}>Recipes</h2>

        <div className="space-y-6">
          <div>
            <h3 className={h3}>Find a user's vaults</h3>
            <p className={`${prose} mb-2 text-sm`}>
              Indexer-only — there is no on-chain reverse index from owner to vault.
            </p>
            <div className={block}>
              <pre>{`const vaults = await qv.vaults.forOwner(userAddress);
const asGuardian = await qv.vaults.forGuardian(userAddress);`}</pre>
            </div>
          </div>

          <div>
            <h3 className={h3}>Send tokens</h3>
            <div className={block}>
              <pre>{`await vault.propose.erc20Transfer({ token, to, amount });
await vault.propose.erc721Transfer({ token, to, tokenId });
await vault.propose.erc1155Transfer({ token, to, id, amount });`}</pre>
            </div>
          </div>

          <div>
            <h3 className={h3}>Batch several calls</h3>
            <p className={`${prose} mb-2 text-sm`}>
              Batching runs through MultiSendCallOnly, which must be on the vault's DelegateCall
              whitelist. That whitelist is empty by default — the SDK checks first and tells you
              which proposal you need rather than letting the batch revert.
            </p>
            <div className={block}>
              <pre>{`// One-time setup. A self-call, so it takes a normal
// threshold-of-owners approval — and bypasses the timelock.
await vault.propose.addDelegatecallTarget(multiSendAddress);

await vault.propose.batch([
  { to: tokenA, data: transferA },
  { to: tokenB, data: transferB },
]);`}</pre>
            </div>
          </div>

          <div>
            <h3 className={h3}>Rotate owners</h3>
            <p className={`${prose} mb-2 text-sm`}>
              Owner and threshold changes are self-calls: proposals targeting the vault itself. They
              always bypass the timelock.
            </p>
            <div className={block}>
              <pre>{`await vault.propose.addOwner(newOwner);
await vault.propose.changeThreshold(3);

// Lower the threshold first if removal would drop below it —
// the SDK raises a typed error explaining exactly that.
await vault.propose.removeOwner(oldOwner);`}</pre>
            </div>
          </div>

          <div>
            <h3 className={h3}>Set up and run social recovery</h3>
            <p className={`${prose} mb-2 text-sm`}>
              Configuring guardians goes through the owner multisig; everything after is
              guardian-driven. <code className={code}>cancel</code> is callable by any current owner —
              the owners' defence against a hostile or mistaken guardian action.
            </p>
            <div className={block}>
              <pre>{`// Owners configure guardians
await vault.propose.setupRecovery({
  guardians: [g1, g2, g3],
  threshold: 2,
  recoveryPeriodSeconds: 86_400,
});

// Guardians drive recovery
const { recoveryHash } = await vault.recovery.initiate({
  newOwners: [n1, n2],
  newThreshold: 2,
});
await vault.recovery.approve(recoveryHash);
await vault.recovery.execute(recoveryHash);   // after the recovery period

// Owners can cancel at any point before execution
await vault.recovery.cancel(recoveryHash);`}</pre>
            </div>
          </div>

          <div>
            <h3 className={h3}>Sign a hash for EIP-1271</h3>
            <p className={`${prose} mb-2 text-sm`}>
              Quai Vault's EIP-1271 is a <strong className="text-dark-200">pre-approval</strong>{' '}
              model, not live ECDSA — the signature argument is ignored entirely. A counterparty's
              check only passes if the exact 32-byte hash was approved by multisig beforehand.
              Signing an arbitrary-length message does <em>not</em> make its hash validate.
            </p>
            <div className={block}>
              <pre>{`await vault.propose.approveHashForEip1271(hash);
// ...approve and execute the proposal, then:
await vault.isValidSignature(hash); // true`}</pre>
            </div>
          </div>

          <div>
            <h3 className={h3}>React to changes in real time</h3>
            <div className={block}>
              <pre>{`const sub = vault.watch(
  (e) => console.log(e.topic, e.type),
  { topics: ['transactions', 'confirmations', 'owners'] },
);

await sub.unsubscribe();`}</pre>
            </div>
            <p className={`${prose} mt-2 text-sm text-dark-400`}>
              Events fire after the indexer processes a block, so treat them as a signal to re-read
              rather than as state themselves.
            </p>
          </div>

          <div>
            <h3 className={h3}>Preview a write without signing</h3>
            <div className={block}>
              <pre>{`const preview = await vault.propose.transfer({
  to, amount, dryRun: true,
});

preview.data;         // exact calldata
preview.gasEstimate;  // null if estimation reverted
preview.wouldRevert;  // decoded revert, if any
preview.description;  // "Propose: Transfer 1.0 QUAI to 0x00cd…"`}</pre>
            </div>
          </div>

          <div>
            <h3 className={h3}>Read many transactions at once</h3>
            <p className={`${prose} mb-2 text-sm`}>
              <code className={code}>transactions()</code> shares one owner and threshold read, and
              one confirmations query, across the whole set — rather than repeating them per hash.
            </p>
            <div className={block}>
              <pre>{`const byHash = await vault.transactions([h1, h2, h3]);  // Map<Bytes32, VaultTransaction>
byHash.get(h1)?.summary;`}</pre>
            </div>
          </div>

          <div>
            <h3 className={h3}>Pin owners and threshold for a render pass</h3>
            <p className={`${prose} mb-2 text-sm`}>
              Rendering a list of transactions otherwise re-reads the owner set for each one.{' '}
              <code className={code}>view()</code> takes an explicit snapshot with a visible{' '}
              <code className={code}>capturedAt</code>, and{' '}
              <code className={code}>pinned(view)</code> returns a vault handle that reuses it.
            </p>
            <div className={block}>
              <pre>{`const view = await vault.view();      // { owners, threshold, capturedAt, source }
const pinned = vault.pinned(view);

await Promise.all(hashes.map((h) => pinned.affordances(h, caller)));`}</pre>
            </div>
            <p className={`${prose} mt-2 text-sm text-dark-400`}>
              Write preconditions bypass the snapshot by construction, so a pinned view can never
              gate a signature — it only ever affects what you display.
            </p>
          </div>

          <div>
            <h3 className={h3}>List balances</h3>
            <p className={`${prose} mb-2 text-sm`}>
              Token discovery is indexer-driven, because the chain cannot answer "which contracts
              has this address touched" without scanning every log. Amounts are then verified on
              chain by default, since replaying transfers misses anything the indexer did not
              observe.
            </p>
            <div className={block}>
              <pre>{`const { native, tokens, truncated } = await vault.balances({
  verify: true,            // default — confirm each amount on chain
  maxTokens: 50,           // default
  transferScanLimit: 500,  // default; raise for long-lived vaults
  concurrency: 8,          // default ceiling on in-flight RPC reads
});

truncated?.transfers;      // set when the scan budget was exhausted
truncated?.tokens;         // set when more tokens existed than maxTokens`}</pre>
            </div>
            <p className={`${prose} mt-2 text-sm text-dark-400`}>
              Token <code className={code}>symbol</code> and <code className={code}>name</code> are
              deployer-controlled strings. They are run through{' '}
              <code className={code}>sanitizeText</code> — which strips ANSI escapes, bidi
              overrides and zero-width characters — before you ever see them.
            </p>
          </div>
        </div>
      </div>

      {/* ---------------- Affordances ---------------- */}
      <div className={panel}>
        <h2 className={h2}>Knowing what you are allowed to do</h2>
        <div className={`${prose} space-y-3`}>
          <p>
            Rather than attempting an action and interpreting the revert,{' '}
            <code className={code}>affordances()</code> reports what a given address may legally do
            right now — and when a blocked action unlocks.
          </p>
        </div>
        <div className={`${block} mt-3`}>
          <pre>{`for (const a of await vault.affordances(txHash, caller)) {
  console.log(a.allowed ? 'YES' : 'no', a.action, a.reason, a.availableAt);
}`}</pre>
        </div>
        <p className={`${prose} mt-3`}>
          It encodes the rules that are easy to miss: proposer-cancel is permanently blocked once
          quorum is reached — even if approvals are later revoked — self-calls bypass the timelock,
          and <code className={code}>expire</code> is permissionless once past the deadline.
        </p>
        <p className={`${prose} mt-2 text-sm text-dark-400`}>
          <code className={code}>vault.describe(txHash)</code> renders the same information as a
          compact human-readable block.
        </p>
      </div>

      {/* ---------------- ABIs ---------------- */}
      <div className={panel}>
        <h2 className={h2}>Describing calls to contracts the SDK doesn't know</h2>
        <div className={`${prose} space-y-3`}>
          <p>
            The SDK ships ABIs for the vault, factory, recovery module, MultiSend and the token
            standards. A proposal targeting anything else renders honestly but bluntly:
          </p>
        </div>
        <div className={`${block} mt-3`}>
          <pre>{`Call 0x0033…3333 (selector 0xa9059cbb)`}</pre>
        </div>
        <p className={`${prose} mt-3`}>
          Supply an ABI for that address and it gets described instead. The lookup is address-keyed
          rather than a list to try: attempting a pile of ABIs against arbitrary calldata until one
          parses is how a call gets confidently decoded as the wrong thing.
        </p>
        <div className={`${block} mt-3`}>
          <pre>{`import { connect, abiRegistry } from '@quaivault/sdk';

const qv = connect({
  network: 'mainnet',
  abis: abiRegistry({ '0x0033...': stakingAbi }),   // matched case-insensitively
});`}</pre>
        </div>

        <p className={`${prose} mt-4`}>
          Every decode carries <code className={code}>abiSource</code>, and it is a required field
          rather than an optional one. In a multisig the summary is what owners read before
          approving, so decodes of different strength must not render identically. The name is
          about <em>how the ABI was bound to this address</em> — which is the part that can be
          wrong — not merely where it came from.
        </p>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm text-dark-300">
            <thead>
              <tr className="text-left text-dark-500 border-b border-dark-600">
                <th className="pb-2 pr-4 font-normal font-mono">abiSource</th>
                <th className="pb-2 font-normal">Bound how</th>
              </tr>
            </thead>
            <tbody className="align-top">
              {[
                [
                  'builtin',
                  'The SDK knows which contract this address is — a vault self-call, the configured recovery module, the configured MultiSend, or a bare value transfer that needs no ABI at all.',
                ],
                [
                  'heuristic',
                  'Selector shape alone, against an address the SDK knows nothing about. transfer(address,uint256) reads as an ERC20 transfer whether the target is a token, an unrelated contract exposing that signature, or an address with no code. Usually right, never verified.',
                ],
                [
                  'supplied',
                  'You said so, via abis. The SDK cannot verify the ABI corresponds to the deployed code.',
                ],
                ['none', 'Nothing matched. Only the 4-byte selector is known, and the summary says exactly that.'],
              ].map(([src, meaning]) => (
                <tr key={src} className="border-b border-dark-700/50">
                  <td className="py-2 pr-4 font-mono text-primary-400 whitespace-nowrap align-top">
                    {src}
                  </td>
                  <td className="py-2">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className={`${prose} mt-4`}>
          Summaries are deliberately not hedged for <code className={code}>heuristic</code>: an
          ordinary token transfer is the common case, and phrasing every one as uncertain would make
          the warning worthless by repetition. The field carries the uncertainty instead — so if you
          are building an approval UI, render it.
        </p>
        <p className={`${prose} mt-2`}>
          Supplied ABIs are consulted only after every built-in match, so they cannot change how a
          vault self-call or a known module call is read, and before the token selector heuristics.{' '}
          <code className={code}>decoded.selector</code> is surfaced so a reviewer can check the
          claimed function against an independent source — the only defence against a colliding
          selector in a supplied ABI, which the SDK cannot detect on its own.
        </p>
        <p className={`${prose} mt-2 text-sm text-dark-400`}>
          The SDK does not fetch ABIs from the network. A malformed ABI, or a lookup that throws,
          degrades that one row to <code className={code}>abiSource: 'none'</code> rather than
          failing the surrounding page.
        </p>
      </div>

      {/* ---------------- Clock ---------------- */}
      <div className={panel}>
        <h2 className={h2}>When the local clock cannot be trusted</h2>
        <div className={`${prose} space-y-3`}>
          <p>
            The contracts decide with <code className={code}>block.timestamp</code>. Everything the
            SDK derives locally — a transaction's <code className={code}>ready</code> vs{' '}
            <code className={code}>timelocked</code>, what a caller may do next, whether a recovery
            period has elapsed — predicts that, and a machine whose clock is wrong predicts wrongly.
            Containers, CI runners and VMs resumed from a snapshot drift in ways a desktop usually
            does not.
          </p>
          <p>If you have measured the offset, feed it back in:</p>
        </div>
        <div className={`${block} mt-3`}>
          <pre>{`// Measure once against a block you trust...
const probe = connect({ network: 'mainnet' });
const block = await probe.provider.getBlock('latest');
const skew = Date.now() / 1000 - Number(block.timestamp);   // positive: local clock ahead

// ...then hand the corrected clock to the client you actually use.
const qv = connect({ network: 'mainnet', now: () => Date.now() / 1000 - skew });

// Or override for a single call.
await vault.affordances(txHash, caller, atUnixSeconds);`}</pre>
        </div>
        <p className={`${prose} mt-3`}>
          A function rather than a scalar offset on purpose: an offset needs a sign convention, and
          getting it backwards doubles the error instead of cancelling it, silently. Here the
          arithmetic sits in your code, where it reads as what it means. Detection is deliberately
          yours — deriving the offset costs an RPC call the SDK should not make on your behalf, and
          caching one has no clear invalidation.
        </p>
        <p className={`${prose} mt-2 text-sm text-dark-400`}>
          This never touches elapsed-time measurement. Retry backoff, timeouts, poll intervals and
          cache TTLs stay on the raw local clock — a clock being 12 seconds fast does not make 30
          seconds of backoff into 18. And nothing here can change an on-chain outcome: the chain is
          the authority, and a wrong local time fails safe into a revert or a refusal. What it
          changes is what the SDK <em>tells</em> you.
        </p>
      </div>

      <div className={panel}>
        <h2 className={h2}>Reference</h2>
        <p className={prose}>
          For the complete API surface, error codes and standalone utilities, see the{' '}
          <Link to="/docs/sdk-reference" className="text-primary-500 hover:text-primary-400 underline">
            SDK Reference
          </Link>
          .
        </p>
      </div>
    </DocLayout>
  );
}
