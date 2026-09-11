import { Link } from 'react-router-dom';
import DocLayout from '../../components/DocLayout';

const panel = 'vault-panel p-6 mb-6';
const h2 = 'text-lg font-display font-bold text-dark-200 mb-4';
const h3 = 'text-base font-display font-bold text-dark-200 mb-2';
const prose = 'text-base text-dark-300 leading-relaxed';
const code = 'bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-sm';
const block =
  'bg-vault-dark-4 rounded p-4 border border-dark-600 font-mono text-xs text-dark-300 overflow-x-auto';

export default function SdkOverview() {
  return (
    <DocLayout
      title="SDK"
      description="TypeScript SDK for building on Quai Vault — install, configure, and understand what it does for you."
    >
      {/* Why */}
      <div className={panel}>
        <h2 className={h2}>What it is</h2>
        <div className={`${prose} space-y-3`}>
          <p>
            <code className={code}>@quaivault/sdk</code> is the supported way to build on Quai Vault
            from TypeScript or JavaScript. It works in Node and the browser, with any signer.
          </p>
          <p>
            You can integrate with the contracts directly using{' '}
            <code className={code}>quais</code> and the ABIs — the{' '}
            <Link to="/docs/developer-guide" className="text-primary-500 hover:text-primary-400 underline">
              Developer Guide
            </Link>{' '}
            covers that. The SDK exists because three parts of Quai Vault are easy to get wrong, and
            getting them wrong costs real money:
          </p>
          <ul className="space-y-2 ml-4 list-disc">
            <li>
              <strong className="text-dark-200">A successful transaction receipt does not mean your
              vault transaction executed.</strong> Three separate paths produce a status-1 receipt
              with nothing executed.
            </li>
            <li>
              <strong className="text-dark-200">Vault addresses must be mined.</strong> Quai addresses
              are shard-scoped, so a CREATE2 salt has to be brute-forced or the vault lands somewhere
              you cannot reach.
            </li>
            <li>
              <strong className="text-dark-200">Qi addresses cannot interact with contracts.</strong>{' '}
              A Qi owner can never sign, and the contracts do not reject one.
            </li>
          </ul>
          <p>
            The SDK handles all three, decodes every custom error into an actionable message, and
            falls back from the indexer to the chain automatically.
          </p>
        </div>
      </div>

      {/* Install */}
      <div className={panel}>
        <h2 className={h2}>Install</h2>
        <div className={block}>
          <pre>{`npm install @quaivault/sdk quais`}</pre>
        </div>
        <p className={`${prose} mt-3`}>
          Current version <strong className="text-dark-200">0.6.1</strong>. Ships ESM and CommonJS
          builds with full TypeScript types, and publishes with an npm provenance attestation
          linking each release to the commit and workflow run that built it.
        </p>
        <p className={`${prose} mt-2 text-sm text-dark-400`}>
          Requires <strong className="text-dark-200">Node 22 or later</strong> — realtime needs a
          global <code className={code}>WebSocket</code>, which Node 20 does not provide. While the
          version is <code className={code}>0.x</code>, minor bumps may contain breaking changes;
          the{' '}
          <a
            href="https://github.com/Quai-Vault/quaivault-sdk/blob/main/CHANGELOG.md"
            target="_blank"
            rel="noreferrer"
            className="text-primary-500 hover:text-primary-400 underline"
          >
            changelog
          </a>{' '}
          records every one and why it was made.
        </p>

        <h3 className={`${h3} mt-5`}>quais is a peer dependency</h3>
        <div className={`${prose} space-y-3`}>
          <p>
            As of 0.6.0 you install <code className={code}>quais</code> yourself, and the supported
            versions are named explicitly rather than given as a range. npm 7 and later install
            peers automatically, so most projects will not notice the change.
          </p>
        </div>
        <div className={`${block} mt-3`}>
          <pre>{`"peerDependencies": { "quais": "1.0.0-alpha.55 || 1.0.0-alpha.56" }`}</pre>
        </div>
        <p className={`${prose} mt-3`}>
          It is a peer rather than a normal dependency for two reasons. The SDK's public API hands
          you quais types — <code className={code}>Provider</code>,{' '}
          <code className={code}>Signer</code>, <code className={code}>InterfaceAbi</code> — so you
          and it must be holding the same object graph. And a pinned normal dependency cannot
          deduplicate: an app already using quais directly would ship two copies, roughly 200 KB
          gzip of avoidable weight in a browser bundle.
        </p>
        <p className={`${prose} mt-2`}>
          The allowlist names the versions CI actually runs the suite against, so an unlisted
          version is refused at install time rather than accepted and hoped for.{' '}
          <code className={code}>quais</code> is pre-1.0 and every release is an alpha, so there is
          no compatibility promise to lean on. If you need a version that is not listed,{' '}
          <a
            href="https://github.com/Quai-Vault/quaivault-sdk/issues"
            target="_blank"
            rel="noreferrer"
            className="text-primary-500 hover:text-primary-400 underline"
          >
            open an issue
          </a>{' '}
          — adding one is a test run, not a negotiation.
        </p>
      </div>

      {/* Quickstart */}
      <div className={panel}>
        <h2 className={h2}>Quickstart</h2>

        <div className="space-y-5">
          <div>
            <h3 className={h3}>Read a vault</h3>
            <p className={`${prose} mb-2`}>
              No wallet, no key, no configuration — the network presets ship with working RPC and
              indexer credentials.
            </p>
            <div className={block}>
              <pre>{`import { connect } from '@quaivault/sdk';

const qv = connect({ network: 'mainnet' });
const vault = qv.vault('0x005f2629A632962f4944d23686efDa5c160d535b');

const info = await vault.info();
console.log(\`\${info.threshold}-of-\${info.owners.length}, balance \${info.balance}\`);

for (const tx of await vault.pendingTransactions()) {
  console.log(tx.status, \`\${tx.approvalCount}/\${tx.threshold}\`, tx.summary);
}`}</pre>
            </div>
          </div>

          <div>
            <h3 className={h3}>Propose and execute</h3>
            <p className={`${prose} mb-2`}>
              Add a signer to write. Every <code className={code}>propose.*</code> method returns the
              vault-transaction hash you approve and execute against.
            </p>
            <div className={block}>
              <pre>{`const qv = connect({
  network: 'mainnet',
  privateKey: process.env.QUAIVAULT_PRIVATE_KEY,
});

const vault = qv.vault(address);

const { txHash } = await vault.propose.transfer({
  to: '0x00...',
  amount: 1_000000000000000000n, // 1 QUAI
});

await vault.approve(txHash);

const result = await vault.execute(txHash);
if (result.outcome !== 'executed') {
  console.warn(result.message); // explains exactly what happened, and what to do next
}`}</pre>
            </div>
          </div>

          <div>
            <h3 className={h3}>Deploy a vault</h3>
            <p className={`${prose} mb-2`}>
              The salt is mined for you, on the deployer's shard.
            </p>
            <div className={block}>
              <pre>{`const { address, salt } = await qv.factory.create(
  { owners: [a, b, c], threshold: 2, minExecutionDelay: 86_400 },
  { onProgress: (p) => console.log(p.step, p.message) },
);`}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className={panel}>
        <h2 className={h2}>Configuration</h2>
        <div className={`${prose} space-y-3`}>
          <p>
            Configuration resolves in one direction:{' '}
            <strong className="text-dark-200">explicit options win, then environment variables, then
            the network preset.</strong>{' '}
            Nothing is read at import time, so importing the SDK never touches{' '}
            <code className={code}>process.env</code>.
          </p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm text-dark-300">
            <thead>
              <tr className="text-left text-dark-500 border-b border-dark-600">
                <th className="pb-2 pr-4 font-normal font-mono">Variable</th>
                <th className="pb-2 font-normal">Purpose</th>
              </tr>
            </thead>
            <tbody className="align-top">
              {[
                ['QUAIVAULT_NETWORK', 'mainnet or testnet'],
                ['QUAIVAULT_RPC_URL', 'RPC base URL — the shard path is appended automatically'],
                ['QUAIVAULT_PRIVATE_KEY', 'Signing key. Required only for writes'],
                ['QUAIVAULT_INDEXER_URL', 'Point at a self-hosted indexer'],
                ['QUAIVAULT_INDEXER_ANON_KEY', 'Override the shipped read-only indexer key'],
                ['QUAIVAULT_INDEXER_SCHEMA', 'mainnet or testnet'],
                ['QUAIVAULT_INDEXER_HEALTH_URL', 'Endpoint used for the lag and liveness probe'],
                ['QUAIVAULT_CONSISTENCY', 'auto (default), indexed, or chain'],
                ['QUAIVAULT_MAX_INDEXER_LAG_BLOCKS', 'Lag budget before auto falls back to chain. Default 50'],
              ].map(([name, purpose]) => (
                <tr key={name} className="border-b border-dark-700/50">
                  <td className="py-2 pr-4 font-mono text-primary-400 whitespace-nowrap">{name}</td>
                  <td className="py-2">{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className={`${h3} mt-6`}>Networks</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-dark-300">
            <thead>
              <tr className="text-left text-dark-500 border-b border-dark-600">
                <th className="pb-2 pr-4 font-normal">Preset</th>
                <th className="pb-2 pr-4 font-normal">Chain ID</th>
                <th className="pb-2 pr-4 font-normal">RPC</th>
                <th className="pb-2 font-normal">Indexer schema</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-dark-700/50">
                <td className="py-2 pr-4 font-mono">mainnet</td>
                <td className="py-2 pr-4 font-mono">9</td>
                <td className="py-2 pr-4 font-mono text-primary-400">https://rpc.quai.network</td>
                <td className="py-2 font-mono">mainnet</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono">testnet</td>
                <td className="py-2 pr-4 font-mono">15000</td>
                <td className="py-2 pr-4 font-mono text-primary-400">
                  https://orchard.rpc.quai.network
                </td>
                <td className="py-2 font-mono">testnet</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className={`${prose} mt-3 text-sm text-dark-400`}>
          Indexer credentials ship with the SDK, so vault discovery, history and realtime work with
          no setup. The publishable key is a public read-only credential — the indexer grants the{' '}
          <code className={code}>anon</code> role <code className={code}>SELECT</code> and nothing
          else. Contract addresses come from the preset too, and are overridable with{' '}
          <code className={code}>QUAIVAULT_FACTORY</code>,{' '}
          <code className={code}>QUAIVAULT_IMPLEMENTATION</code>,{' '}
          <code className={code}>QUAIVAULT_SOCIAL_RECOVERY_MODULE</code> and{' '}
          <code className={code}>QUAIVAULT_MULTISEND_CALL_ONLY</code> for a custom deployment.
        </p>

        <h3 className={`${h3} mt-6`}>Options with no environment equivalent</h3>
        <p className={`${prose} mb-3 text-sm`}>
          These take a function or an object, so they are passed to{' '}
          <code className={code}>connect()</code> directly.
        </p>
        <div className={block}>
          <pre>{`const qv = connect({
  network: 'mainnet',

  provider,           // bring your own quais Provider
  signer,             // or your own Signer — a browser wallet, a KMS-backed signer
  abis,               // describe calls to contracts the SDK does not ship
  now: () => secs,    // source of "now" when the local clock cannot be trusted
  retry: { maxAttempts: 4, baseDelayMs: 250, onRetry },
  useEnv: false,      // ignore process.env entirely
});`}</pre>
        </div>
        <p className={`${prose} mt-3 text-sm text-dark-400`}>
          <code className={code}>qv.config</code> returns the resolved configuration with the
          private key stripped and the indexer key masked, so it is safe to log.
        </p>
      </div>

      {/* Consistency */}
      <div className={panel}>
        <h2 className={h2}>Where data comes from</h2>
        <div className={`${prose} space-y-3`}>
          <p>
            Quai Vault has two data planes: the chain, which is authoritative but slow and cannot
            answer historical questions, and the indexer, which is fast but lags and cannot see
            everything. The SDK resolves between them for you.
          </p>
          <ul className="space-y-2 ml-4 list-disc">
            <li>
              <code className={code}>auto</code> (default) — uses the indexer while it is live and
              within the lag budget, otherwise reads the chain. A stalled indexer degrades instead of
              serving stale data.
            </li>
            <li>
              <code className={code}>indexed</code> — indexer only. Fastest; may be stale.
            </li>
            <li>
              <code className={code}>chain</code> — RPC only. Authoritative; some history queries are
              unavailable.
            </li>
          </ul>
          <p>
            <strong className="text-dark-200">Writes ignore this setting entirely.</strong> Every
            write re-reads the chain before signing, because indexed approval counts can diverge from
            on-chain reality and must never gate a signature.
          </p>
          <p className="text-sm text-dark-400">
            After a write, the indexer has not seen your transaction yet. Call{' '}
            <code className={code}>await vault.waitForIndexer()</code> before an indexed read, or the
            transaction you just created will be missing from the list.
          </p>
        </div>
      </div>

      {/* Resilience */}
      <div className={panel}>
        <h2 className={h2}>Resilience</h2>
        <div className={`${prose} space-y-3`}>
          <p>
            Before every write, both the read RPC and the signer's RPC must report the selected
            network's chain ID. External signers must be connected and have a valid Quai address.
            Supplied deployment salts are checked for the deployer's shard before broadcast.
          </p>
          <p>
            Reads retry transient RPC and indexer failures with exponential backoff and full
            jitter. Rate limits, 5xx responses and raw transport failures are retried; reverts,
            user rejections, and nonce and funds errors are permanent by definition and are not.
            Anything unrecognised is treated as permanent too, so a genuine bug surfaces
            immediately instead of hiding behind three slow attempts.
          </p>
          <p>
            <strong className="text-dark-200">Writes are never retried.</strong> A resubmit that
            looks like a timeout to the client may already be in the mempool, so retrying risks a
            double broadcast.
          </p>
          <p>
            If submission succeeds but its receipt cannot be verified,{' '}
            <code className={code}>BroadcastError</code> carries code{' '}
            <code className={code}>BROADCAST_UNKNOWN</code> and the submitted{' '}
            <code className={code}>chainTxHash</code>. Reconcile that hash on chain before retrying.
          </p>
        </div>
        <div className={`${block} mt-3`}>
          <pre>{`const qv = connect({
  network: 'mainnet',
  retry: {
    maxAttempts: 4,
    baseDelayMs: 250,
    onRetry: ({ attempt, delayMs, error }) => log(attempt, delayMs, error),
  },
});`}</pre>
        </div>
      </div>

      {/* Next */}
      <div className={panel}>
        <h2 className={h2}>Next</h2>
        <div className="space-y-3">
          <div>
            <Link to="/docs/sdk-guides" className="text-primary-500 hover:text-primary-400 underline">
              SDK Guides
            </Link>
            <p className="text-sm text-dark-500 mt-1">
              Task-oriented recipes: deploying, transfers, batching, rotating owners, social
              recovery, EIP-1271, describing calls to unknown contracts, clock skew — and the three
              behaviours that surprise people.
            </p>
          </div>
          <div>
            <Link
              to="/docs/sdk-reference"
              className="text-primary-500 hover:text-primary-400 underline"
            >
              SDK Reference
            </Link>
            <p className="text-sm text-dark-500 mt-1">
              The complete API surface, error codes, and standalone utilities.
            </p>
          </div>
          <div>
            <Link to="/docs/developer-guide" className="text-primary-500 hover:text-primary-400 underline">
              Developer Guide
            </Link>
            <p className="text-sm text-dark-500 mt-1">
              Contract-level integration: addresses, function signatures, events, and custom errors.
            </p>
          </div>
        </div>
      </div>
    </DocLayout>
  );
}
