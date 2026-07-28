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
      description="Task-oriented recipes, and the three Quai Vault behaviours that catch people out."
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
              <pre>{`// One-time setup, requires full owner consensus
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
