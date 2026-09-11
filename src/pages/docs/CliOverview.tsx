import { Link } from 'react-router-dom';
import DocLayout from '../../components/DocLayout';

const panel = 'vault-panel p-6 mb-6';
const h2 = 'text-lg font-display font-bold text-dark-200 mb-4';
const h3 = 'text-base font-display font-bold text-dark-200 mb-2';
const prose = 'text-base text-dark-300 leading-relaxed';
const code = 'bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-sm';
const block =
  'bg-vault-dark-4 rounded p-4 border border-dark-600 font-mono text-xs text-dark-300 overflow-x-auto';

export default function CliOverview() {
  return (
    <DocLayout
      title="CLI"
      description="Install and operate Quai Vault from a terminal, CI job, or software agent with the @quaivault/cli package."
    >
      <div className={panel}>
        <h2 className={h2}>Install</h2>
        <div className={block}>
          <pre>{`npm install -g @quaivault/cli

qv --version
qv doctor`}</pre>
        </div>
        <div className={`${prose} mt-3 space-y-2`}>
          <p>
            The current release is <code className={code}>@quaivault/cli@0.6.1</code>. It provides both{' '}
            <code className={code}>qv</code> and <code className={code}>quaivault</code> binaries and
            requires <strong className="text-dark-200">Node.js 22 or later</strong>.
          </p>
          <p className="text-sm text-dark-400">
            <code className={code}>qv doctor</code> checks the Node runtime, RPC and indexer
            connectivity, clock skew, configuration, and key setup without exposing secret values.
          </p>
        </div>
      </div>

      <div className={panel}>
        <h2 className={h2}>Start read-only</h2>
        <p className={`${prose} mb-3`}>
          Reading a known vault needs no wallet, private key, account, or local configuration. Network
          endpoints and contract addresses are supplied by the underlying SDK presets.
        </p>
        <div className={block}>
          <pre>{`# Inspect any vault
qv vault show 0x005f2629A632962f4944d23686efDa5c160d535b

# Inspect pending and completed transactions
qv tx ls 0x005f2629A632962f4944d23686efDa5c160d535b
qv tx history 0x005f2629A632962f4944d23686efDa5c160d535b

# Check whether an address is on the Quai ledger and in a valid zone
qv addr check 0x00...`}</pre>
        </div>

        <h3 className={`${h3} mt-5`}>Set your identity and default vault</h3>
        <p className={`${prose} mb-3`}>
          An identity tells read commands which owner or guardian you are. It is only an address; it
          does not unlock a key. A default vault makes the positional vault argument optional on
          commands that support it.
        </p>
        <div className={block}>
          <pre>{`qv use --as 0x<your-address>
qv alias add treasury 0x<vault-address>
qv use treasury

qv inbox       # work awaiting your identity across all vaults
qv vault show  # uses the default vault`}</pre>
        </div>
        <p className={`${prose} mt-3 text-sm text-dark-400`}>
          Use <code className={code}>qv contact add alice 0x...</code> to label owners and guardians
          in transaction disclosures. Aliases and contacts are local display conveniences; the CLI
          resolves them before making a request.
        </p>
      </div>

      <div className={panel}>
        <h2 className={h2}>Add a signing key</h2>
        <p className={`${prose} mb-3`}>
          Add a key only when you need to propose, approve, execute, or perform a recovery action.
          The interactive import reads the raw key from the terminal without putting it in shell
          history or the process list.
        </p>
        <div className={block}>
          <pre>{`# Prompt for a raw private key and encrypt it locally
qv key import owner --use

# Or import an existing Web3 Secret Storage V3 keystore
qv key import owner --keystore ./geth-key.json --use

qv key ls
qv key use owner`}</pre>
        </div>
        <div className={`${prose} mt-3 space-y-2`}>
          <p>
            Local keys use Web3 Secret Storage V3. They live under{' '}
            <code className={code}>~/.quaivault/keys/</code> (or the platform configuration home),
            with restrictive permissions and atomic writes.
          </p>
          <p>
            There are deliberately no <code className={code}>--private-key</code>,{' '}
            <code className={code}>--password</code>, or <code className={code}>--mnemonic</code>{' '}
            flags. Command-line arguments can be visible to other processes. For CI, use a protected
            file or file descriptor and the environment variables described below.
          </p>
        </div>
      </div>

      <div className={panel}>
        <h2 className={h2}>Propose, approve, execute</h2>
        <p className={`${prose} mb-3`}>
          A <code className={code}>propose</code> command creates a vault transaction; it does not
          directly perform the requested transfer or configuration change. Co-owners then approve
          the transaction, and it can execute after quorum and any timelock are satisfied.
        </p>
        <div className={block}>
          <pre>{`# Propose 1.5 QUAI from the default vault
qv propose transfer treasury --to 0x<recipient> --amount 1.5

# Inspect the exact transaction before signing
qv tx show 0x<vault> 0x<transaction-hash>

# Approve; optionally execute when this approval reaches quorum
qv tx approve 0x<vault> 0x<transaction-hash> --and-execute

# Or execute separately once ready
qv tx wait 0x<vault> 0x<transaction-hash>
qv tx execute 0x<vault> 0x<transaction-hash>`}</pre>
        </div>
        <div className={`${prose} mt-3 space-y-2`}>
          <p>
            Before every signature, the CLI re-reads the transaction from chain and prints its target,
            value, calldata decode, ABI provenance, operation type, and live approvals. A successful
            chain receipt is not treated as proof that the inner vault call succeeded.
          </p>
          <p>
            Both RPC providers must match the selected network before broadcast. The unlocked key
            must match the identity selected by flags, environment, or profile. Invalid network
            names are rejected instead of falling back to mainnet.
          </p>
          <p>
            Unknown or unverified calldata is shown as raw 32-byte words. Signing it—or signing a
            DelegateCall—requires <code className={code}>--i-understand-unverified</code>. Prefer
            commands whose decode provenance is <code className={code}>builtin</code>.
          </p>
        </div>
      </div>

      <div className={panel}>
        <h2 className={h2}>Configuration</h2>
        <p className={`${prose} mb-3`}>
          Configuration is stored in <code className={code}>~/.quaivault/config.toml</code>,{' '}
          <code className={code}>$XDG_CONFIG_HOME/quaivault/config.toml</code>, or the platform
          configuration directory. Flags override environment variables, which override the selected
          profile.
        </p>
        <div className={block}>
          <pre>{`default_profile = "default"

[profiles.default]
network = "mainnet"       # or "testnet"
address = "0x00..."       # watch-only identity
vault = "0x00..."         # optional default vault
# rpc_url = "https://..." # optional endpoint override
# indexer_url = "https://..."

[aliases]
treasury = "0x005f..."

[contacts]
alice = "0x00a1..."`}</pre>
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
                ['QUAIVAULT_PROFILE', 'Configuration profile to use'],
                ['QUAIVAULT_ADDRESS', 'Watch-only identity to act as'],
                ['QUAIVAULT_VAULT', 'Default vault alias or address'],
                ['QUAIVAULT_PRIVATE_KEY_FILE', 'Raw signing key file for CI; preferred automation input'],
                ['QUAIVAULT_PRIVATE_KEY', 'Raw signing key in the environment; supported but least preferred'],
                ['QUAIVAULT_KEYSTORE_PASSWORD_FILE', 'Password file for non-interactive keystore unlocks'],
              ].map(([name, purpose]) => (
                <tr key={name} className="border-b border-dark-700/50">
                  <td className="py-2 pr-4 font-mono text-primary-400 whitespace-nowrap">{name}</td>
                  <td className="py-2">{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={`${prose} mt-3 text-sm text-dark-400`}>
          <code className={code}>NO_COLOR</code>, <code className={code}>FORCE_COLOR</code>, and{' '}
          <code className={code}>--color auto|always|never</code> control ANSI output. Piped human
          output omits presentation chrome; machine consumers should use <code className={code}>--json</code>.
        </p>
      </div>

      <div className={panel}>
        <h2 className={h2}>Automation and agents</h2>
        <p className={`${prose} mb-3`}>
          JSON output is a versioned CLI-owned protocol. It is emitted on stdout for both success and
          handled failure, all bigint values are decimal strings, and writes remain non-interactive
          only when <code className={code}>--yes</code> is supplied separately.
        </p>
        <div className={block}>
          <pre>{`# Discover every command, option, precondition, and JSON output shape
qv --schema --schema-version 1

# Read safely without prompts
qv inbox --json
qv tx show 0x<vault> 0x<full-hash> --json

# Preview a write without unlocking a key or broadcasting
qv propose transfer 0x<vault> --to 0x<recipient> --amount 1 --dry-run --json

# Bind approval to values verified earlier, then authorize the write
qv tx approve 0x<vault> 0x<full-hash> \
  --expect-data-hash 0x<hash> \
  --expect-to 0x<recipient> \
  --expect-value 1000000000000000000 \
  --expect-abi-source builtin \
  --json --yes`}</pre>
        </div>
        <div className={`${prose} mt-3 space-y-2`}>
          <p>
            Proposal automation should set <code className={code}>--idempotency-key</code> to a stable
            operation identifier. A confirmed retry with identical inputs returns{' '}
            <code className={code}>changed: false</code>; reusing the identifier with different inputs
            fails closed. The key is reserved before submission; an interrupted or unresolved
            submission blocks reuse until its chain history and journal record are reconciled.
            Do not bypass that check by using a new identifier.
          </p>
          <p>
            A receipt timeout after submission reports <code className={code}>BROADCAST_UNKNOWN</code>,{' '}
            <code className={code}>changed: &quot;unknown&quot;</code>, and{' '}
            <code className={code}>retryable: false</code>. The submitted{' '}
            <code className={code}>chainTxHash</code> is in both data and error. Look up that hash
            before retrying. A terminal target-call failure reports changed: true because the
            vault proposal was consumed.
          </p>
          <p>
            Under <code className={code}>--json</code>, abbreviated transaction hashes are rejected.
            Pass the complete 66-character hash and branch on <code className={code}>ok</code>,{' '}
            <code className={code}>changed</code>, <code className={code}>retryable</code>, and the
            process exit code.
          </p>
        </div>

        <h3 className={`${h3} mt-5`}>Bound non-interactive signing with a policy</h3>
        <div className={block}>
          <pre>{`qv policy init
qv policy show`}</pre>
        </div>
        <p className={`${prose} mt-3`}>
          Non-interactive writes require <code className={code}>policy.toml</code> in the CLI
          configuration directory, normally <code className={code}>~/.quaivault</code> or{' '}
          <code className={code}>$XDG_CONFIG_HOME/quaivault</code>. The starter policy limits
          approval value and rate, refuses vault administration, module configuration, recovery
          setup, and DelegateCall, and requires a built-in ABI decode. Invalid fields or values
          fail closed. Approval slots are reserved before signing and count for one hour even
          when the result is uncertain. There is no per-command policy-path override.
        </p>
      </div>

      <div className={panel}>
        <h2 className={h2}>Key safety and interrupted operations</h2>
        <div className={`${prose} space-y-3`}>
          <p>
            Keystore import validates scrypt N, r, p, combined memory and CPU cost, and PBKDF2
            iterations before decryption. The normal floor is scrypt N=131072 with r=8, or
            600000 PBKDF2 iterations. <code className={code}>--accept-weak-kdf</code> can accept a
            weaker imported key, but never bypasses resource limits. Imports are re-encrypted
            with the standard scrypt settings and cannot overwrite a concurrently imported key.
          </p>
          <p>
            Signing locks do not expire while a receipt is pending. After a crash, verify the
            recorded PID and pending chain transactions before manually removing the lock named
            in the error. Reconcile unresolved idempotency records before repairing the journal.
          </p>
        </div>
      </div>

      <div className={panel}>
        <h2 className={h2}>Exit codes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-dark-300">
            <thead>
              <tr className="text-left text-dark-500 border-b border-dark-600">
                <th className="pb-2 pr-4 font-normal">Code</th>
                <th className="pb-2 font-normal">Meaning</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['0', 'Success'],
                ['1', 'Operational failure, including an inner vault execution failure'],
                ['2', 'Usage or configuration error'],
                ['3', 'Precondition not met or policy refusal'],
                ['4', 'Not executed: approval-only or timelock started'],
                ['5', 'User declined confirmation'],
                ['130', 'Interrupted'],
              ].map(([value, meaning]) => (
                <tr key={value} className="border-b border-dark-700/50">
                  <td className="py-2 pr-4 font-mono text-primary-400">{value}</td>
                  <td className="py-2">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={panel}>
        <h2 className={h2}>Shell completion and TUI</h2>
        <div className={block}>
          <pre>{`qv completion bash > ~/.local/share/bash-completion/completions/qv
qv completion zsh  > ~/.zfunc/_qv
qv completion fish > ~/.config/fish/completions/qv.fish

qv tui`}</pre>
        </div>
        <p className={`${prose} mt-3`}>
          The full-screen TUI monitors configured vaults. It never retains a signing key; write
          actions are delegated to a short-lived one-shot <code className={code}>qv</code> process.
          Use <code className={code}>qv watch [vault]</code> when an event stream is a better fit than
          an interactive display.
        </p>
      </div>

      <div className={panel}>
        <h2 className={h2}>Next</h2>
        <div className={`${prose} space-y-2`}>
          <p>
            See the{' '}
            <Link to="/docs/cli-reference" className="text-primary-500 hover:text-primary-400 underline">
              CLI Reference
            </Link>{' '}
            for every command, positional argument, shared option, and exit behavior.
          </p>
          <p>
            If you are embedding Quai Vault into an application instead of invoking a process, use
            the <Link to="/docs/sdk" className="text-primary-500 hover:text-primary-400 underline">SDK</Link>.
          </p>
          <p>
            Source, release notes, and the security policy are available in the{' '}
            <a
              href="https://github.com/Quai-Vault/quaivault-cli"
              target="_blank"
              rel="noreferrer"
              className="text-primary-500 hover:text-primary-400 underline"
            >
              CLI repository
            </a>.
          </p>
        </div>
      </div>
    </DocLayout>
  );
}
