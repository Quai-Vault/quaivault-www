import { Link } from 'react-router-dom';
import DocLayout from '../../components/DocLayout';

const panel = 'vault-panel p-6 mb-6';
const h2 = 'text-lg font-display font-bold text-dark-200 mb-4';
const h3 = 'text-base font-display font-bold text-dark-200 mb-2';
const prose = 'text-base text-dark-300 leading-relaxed';
const code = 'bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-sm';
const block =
  'bg-vault-dark-4 rounded p-4 border border-dark-600 font-mono text-xs text-dark-300 overflow-x-auto';

interface CommandEntry {
  usage: string;
  description: string;
  options?: string[];
  note?: string;
}

function Commands({ entries }: { entries: CommandEntry[] }) {
  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div key={entry.usage} className="bg-vault-dark-4 rounded p-4 border border-dark-600">
          <p className="font-mono text-sm text-primary-400 break-words">{entry.usage}</p>
          <p className="text-sm text-dark-300 mt-1">{entry.description}</p>
          {entry.options && entry.options.length > 0 && (
            <ul className="mt-2 space-y-1 text-xs text-dark-400">
              {entry.options.map((option) => (
                <li key={option} className="font-mono break-words">
                  {option}
                </li>
              ))}
            </ul>
          )}
          {entry.note && <p className="text-xs text-dark-500 mt-2">{entry.note}</p>}
        </div>
      ))}
    </div>
  );
}

export default function CliReference() {
  return (
    <DocLayout
      title="CLI Reference"
      description="Complete command and option reference for @quaivault/cli v0.5.0."
    >
      <div className={panel}>
        <h2 className={h2}>Syntax</h2>
        <div className={block}>
          <pre>{`qv [global options] <command> [arguments] [command options]`}</pre>
        </div>
        <div className={`${prose} mt-3 space-y-2`}>
          <p>
            Both <code className={code}>qv</code> and <code className={code}>quaivault</code> invoke
            the same binary. Global options may appear before or after the leaf command. Angled
            brackets below are required arguments; square brackets are optional.
          </p>
          <p className="text-sm text-dark-400">
            An optional <code className={code}>[vault]</code> resolves from the argument, then{' '}
            <code className={code}>--vault</code>, <code className={code}>QUAIVAULT_VAULT</code>, or
            the active profile. Aliases created with <code className={code}>qv alias add</code> work
            anywhere a vault alias or address is accepted.
          </p>
        </div>
      </div>

      <div className={panel}>
        <h2 className={h2}>Global options</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-dark-300">
            <thead>
              <tr className="text-left text-dark-500 border-b border-dark-600">
                <th className="pb-2 pr-4 font-normal font-mono">Option</th>
                <th className="pb-2 font-normal">Behavior</th>
              </tr>
            </thead>
            <tbody className="align-top">
              {[
                ['--json', 'Emit one versioned JSON envelope on stdout; implies no input, but does not authorize writes'],
                ['-y, --yes', 'Skip confirmation prompts; non-interactive writes still require a policy'],
                ['--no-input', 'Never prompt; fail when input or authorization is needed'],
                ['-q, --quiet', 'Suppress human hints and presentation chrome'],
                ['--debug', 'Include diagnostic stack traces on human-readable errors'],
                ['--wide', 'Disable human-output truncation'],
                ['--color <auto|always|never>', 'Control ANSI color; default auto'],
                ['-p, --profile <name>', 'Select a configuration profile'],
                ['--vault <alias|address>', 'Select a vault without a positional vault argument'],
                ['--as <address>', 'Act as this watch-only identity; on qv use, persist it'],
                ['--dry-run', 'Plan a write without unlocking, signing, or broadcasting'],
                ['--i-understand-unverified', 'Permit signing an unverified decode or DelegateCall'],
                ['-V, --version', 'Print the CLI version'],
                ['-h, --help', 'Show help for the current command or command group'],
              ].map(([option, behavior]) => (
                <tr key={option} className="border-b border-dark-700/50">
                  <td className="py-2 pr-4 font-mono text-primary-400 whitespace-nowrap">{option}</td>
                  <td className="py-2">{behavior}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className={`${h3} mt-6`}>Introspection and completion</h3>
        <Commands
          entries={[
            {
              usage: 'qv --schema [--schema-version 1]',
              description: 'Emit the command registry, input requirements, output shapes, exit codes, and error codes as JSON.',
            },
            {
              usage: 'qv completion <bash|zsh|fish>',
              description: 'Emit a static shell completion script to stdout.',
            },
          ]}
        />
      </div>

      <div className={panel}>
        <h2 className={h2}>Status and vault reads</h2>
        <p className={`${prose} mb-4 text-sm`}>
          These commands do not load or require a signing key. Commands marked as indexer-required
          fail explicitly when historical or cross-vault data is unavailable.
        </p>
        <Commands
          entries={[
            {
              usage: 'qv status',
              description: 'Show the active network, indexer health, and clock state.',
            },
            {
              usage: 'qv doctor',
              description: 'Check Node.js, connectivity, clock, configuration, and key setup.',
            },
            {
              usage: 'qv addr check <address>',
              description: 'Report address validity, Quai zone, ledger, and any reason it cannot hold a vault role.',
            },
            {
              usage: 'qv vault show [vault]',
              description: 'Show owners, threshold, balance, timelock, modules, and pending transactions.',
            },
            {
              usage: 'qv vault ls [--role owner|guardian]',
              description: 'List vaults associated with the active identity. Requires the indexer.',
            },
            {
              usage: 'qv vault receive [vault]',
              description: 'Print the vault address used to receive funds.',
            },
            {
              usage: 'qv inbox [--count] [--limit <n>]',
              description: 'Show transactions awaiting the active identity across every vault. Requires the indexer.',
              options: ['--count — print only the integer count', '--limit <n> — maximum vaults to scan; default 200'],
            },
            {
              usage: 'qv inbox-count',
              description: 'Print a bare count of transactions needing the active identity, suitable for a shell prompt.',
            },
            {
              usage: 'qv balance [vault] [--nfts] [--no-verify]',
              description: 'Show native and token balances. Requires the indexer.',
              options: ['--nfts — include ERC-721 and ERC-1155 holdings', '--no-verify — skip on-chain verification of indexed amounts'],
            },
            {
              usage: 'qv messages [vault]',
              description: 'List EIP-1271 messages signed by the vault. Requires the indexer.',
            },
            {
              usage: 'qv activity deposits [vault] [--limit <n>] [--offset <n>]',
              description: 'List native QUAI deposits received by a vault. Requires the indexer.',
              options: ['--limit <n> — maximum rows; default 50', '--offset <n> — rows to skip; default 0'],
            },
            {
              usage: 'qv activity token-transfers [vault] [--limit <n>] [--offset <n>]',
              description: 'List ERC-20, ERC-721, and ERC-1155 transfers involving a vault. Requires the indexer.',
              options: ['--limit <n> — maximum rows; default 50', '--offset <n> — rows to skip; default 0'],
            },
          ]}
        />
      </div>

      <div className={panel}>
        <h2 className={h2}>Transaction reads</h2>
        <Commands
          entries={[
            {
              usage: 'qv tx show <vault> <hash>',
              description: 'Show complete transaction detail, calldata verification, approvals, timing, and caller affordances.',
              note: 'Human output accepts an unambiguous hash prefix. --json requires the full 66-character hash.',
            },
            {
              usage: 'qv tx ls [vault] [--limit <n>]',
              description: 'List pending transactions on a vault. The default limit is 50.',
            },
            {
              usage: 'qv tx history [vault] [--limit <n>] [--status <status>]',
              description: 'List terminal transactions. Requires the indexer.',
              options: [
                '--limit <n> — maximum rows; default 50',
                '--status executed|cancelled|expired|failed — filter by terminal status',
              ],
            },
            {
              usage: 'qv tx wait <vault> <hash> [--timeout <seconds>]',
              description: 'Poll chain state until a transaction becomes executable; default timeout 900 seconds.',
            },
          ]}
        />
      </div>

      <div className={panel}>
        <h2 className={h2}>Configuration and keys</h2>
        <Commands
          entries={[
            {
              usage: 'qv use [vault-alias|address] [--as <address>]',
              description: 'Persist the default vault, watch-only identity, or both in the active profile.',
            },
            {
              usage: 'qv alias [add <name> <address> | rm <name> | ls]',
              description: 'Create, remove, or list local vault aliases. The default action is ls.',
            },
            {
              usage: 'qv contact [add <name> <address> | rm <name> | ls]',
              description: 'Create, remove, or list local owner and guardian labels. The default action is ls.',
            },
            {
              usage: 'qv policy [init | show | set <field> <value> | unset <field>]',
              description: 'Create, inspect, or edit the fixed-path non-interactive signing policy.',
              note: 'set and unset require an attended terminal; a non-interactive caller cannot widen its own policy.',
            },
            {
              usage: 'qv key import <name> [options]',
              description: 'Import and encrypt a raw key, or copy an existing Web3 Secret Storage V3 keystore.',
              options: [
                '--keystore <file> — import an existing V3 keystore JSON file',
                '--key-file <path> — read a raw hex private key from a file',
                '--key-fd <n> — read a raw hex private key from a file descriptor',
                '--accept-weak-kdf — allow an imported keystore below the safe scrypt floor',
                '--use — make the imported key active',
              ],
            },
            { usage: 'qv key ls', description: 'List local keys and the active signer.' },
            { usage: 'qv key use <name>', description: 'Make a local key the active signer.' },
            { usage: 'qv key rm <name>', description: 'Delete a local key after confirmation.' },
            { usage: 'qv key change-password <name>', description: 'Re-encrypt a local key under a new password.' },
            { usage: 'qv key export <name>', description: 'Print a key as encrypted V3 keystore JSON.' },
            { usage: 'qv key path <name>', description: 'Print the on-disk path of a local key.' },
          ]}
        />

        <h3 className={`${h3} mt-6`}>Policy fields</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-dark-300">
            <thead>
              <tr className="text-left text-dark-500 border-b border-dark-600">
                <th className="pb-2 pr-4 font-normal font-mono">Field</th>
                <th className="pb-2 font-normal">Constraint</th>
              </tr>
            </thead>
            <tbody className="align-top">
              {[
                ['max_value_per_approval_wei', 'Maximum native value approved in one operation'],
                ['max_approvals_per_hour', 'Rate limit for unattended approvals'],
                ['allow_to', 'Allowed recipients; an empty list permits any address'],
                ['deny_kinds', 'Transaction kinds that unattended signing refuses'],
                ['deny_delegatecall', 'Whether unattended DelegateCall is refused'],
                ['require_abi_source', 'Allowed decode provenance: builtin, heuristic, supplied, or none'],
                ['allow_recovery_actions', 'Allowed direct recovery operations'],
              ].map(([field, purpose]) => (
                <tr key={field} className="border-b border-dark-700/50">
                  <td className="py-2 pr-4 font-mono text-primary-400 whitespace-nowrap">{field}</td>
                  <td className="py-2">{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={panel}>
        <h2 className={h2}>Transaction actions</h2>
        <p className={`${prose} mb-3`}>
          Every command in this section signs. Before signing, it re-reads chain state and supports
          these fail-closed assertions:
        </p>
        <div className={block}>
          <pre>{`--expect-data-hash <hex>     fail unless calldata hashes to this value
--expect-to <address>        fail unless the target matches
--expect-value <wei>         fail unless native value matches exactly
--expect-abi-source <source> fail unless decode provenance matches`}</pre>
        </div>
        <div className="mt-4">
          <Commands
            entries={[
              {
                usage: 'qv tx approve <vault> <hash> [assertions] [--and-execute]',
                description: 'Approve a pending transaction. --and-execute executes in the same chain transaction if this approval reaches quorum.',
              },
              {
                usage: 'qv tx unapprove <vault> <hash> [assertions]',
                description: 'Withdraw your active approval. Also described as revoke in human output.',
              },
              {
                usage: 'qv tx execute <vault> <hash> [assertions]',
                description: 'Execute a transaction that has quorum and whose timelock has elapsed.',
                note: 'Exits 1 when the inner vault call fails, even if the outer chain transaction succeeded.',
              },
              {
                usage: 'qv tx cancel <vault> <hash> [assertions]',
                description: 'Cancel a transaction you proposed, only before it has ever reached quorum.',
              },
              {
                usage: 'qv tx expire <vault> <hash> [assertions]',
                description: 'Perform permissionless cleanup of an expired transaction.',
              },
            ]}
          />
        </div>
      </div>

      <div className={panel}>
        <h2 className={h2}>Proposals</h2>
        <p className={`${prose} mb-3`}>
          All proposal commands sign and accept the shared options below. Durations use forms such as
          <code className={code}>24h</code> and <code className={code}>7d</code>.
        </p>
        <div className={block}>
          <pre>{`--expiration <when>          duration or Unix seconds; default no expiry
--idempotency-key <key>      deduplicate a retry in the local operation journal
--execution-delay <duration> extra timelock beyond the vault minimum`}</pre>
        </div>

        <h3 className={`${h3} mt-5`}>Transfers and calls</h3>
        <Commands
          entries={[
            {
              usage: 'qv propose transfer <vault> --to <address> (--amount <quai> | --amount-wei <wei>) [proposal options]',
              description: 'Propose a native QUAI transfer.',
            },
            {
              usage: 'qv propose token <vault> --token <address> --to <address> (--amount <units> | --amount-wei <raw>) [options]',
              description: 'Propose an ERC-20 transfer.',
              options: ['--decimals <n> — decimals used with --amount; default 18'],
            },
            {
              usage: 'qv propose nft <vault> --token <address> --to <address> --token-id <id> [proposal options]',
              description: 'Propose an ERC-721 transfer.',
            },
            {
              usage: 'qv propose erc1155 <vault> --token <address> --to <address> --token-id <id> --amount <raw> [options]',
              description: 'Propose an ERC-1155 transfer.',
              options: ['--data <hex> — optional receiver data; default 0x'],
            },
            {
              usage: 'qv propose batch <vault> --request <path|-> [proposal options]',
              description: 'Propose an atomic MultiSend batch from a JSON array of {to, value?, data?}; - reads stdin.',
            },
            {
              usage: 'qv propose call <vault> --to <address> [--data <hex> | ABI options] [options]',
              description: 'Propose an arbitrary contract call from raw calldata or a local ABI.',
              options: [
                '--value <quai> — native QUAI sent with the call; default 0',
                '--abi <path> — local JSON ABI used to encode the call',
                '--function <name|signature> — function selected from --abi',
                '--args-json <json> — JSON array of function arguments; default []',
              ],
            },
          ]}
        />

        <h3 className={`${h3} mt-6`}>Vault administration and messages</h3>
        <Commands
          entries={[
            { usage: 'qv propose add-owner <vault> <owner> [proposal options]', description: 'Propose adding an owner.' },
            { usage: 'qv propose remove-owner <vault> <owner> [proposal options]', description: 'Propose removing an owner.' },
            { usage: 'qv propose threshold <vault> <threshold> [proposal options]', description: 'Propose changing the approval threshold.' },
            { usage: 'qv propose delay <vault> <delay> [proposal options]', description: 'Propose changing the vault minimum timelock.' },
            { usage: 'qv propose cancel-by-consensus <vault> <hash> [proposal options]', description: 'Propose cancellation after the original transaction reached quorum.' },
            {
              usage: 'qv propose module <vault> <enable|disable> <module> [proposal options]',
              description: 'Propose enabling or disabling a module.',
            },
            {
              usage: 'qv propose delegatecall <vault> <add|remove> <target> [proposal options]',
              description: 'Propose adding or removing a DelegateCall target.',
            },
            {
              usage: 'qv propose sign-message <vault> <message> [--unsign] [proposal options]',
              description: 'Propose signing an EIP-1271 message, or revoking it with --unsign.',
            },
            {
              usage: 'qv propose setup-recovery <vault> --guardian <address>... --threshold <n> --recovery-period <duration> [options]',
              description: 'Propose social recovery configuration. Repeat --guardian for every guardian.',
            },
          ]}
        />
      </div>

      <div className={panel}>
        <h2 className={h2}>Social recovery</h2>
        <p className={`${prose} mb-3`}>
          Recovery writes support exact assertions against the replacement configuration re-read from
          chain immediately before signing:
        </p>
        <div className={block}>
          <pre>{`--expect-new-owners <addresses> comma-separated exact replacement set
--expect-new-threshold <n>       exact replacement threshold
--expect-execution-time <unix>   exact execution timestamp`}</pre>
        </div>
        <div className="mt-4">
          <Commands
            entries={[
              { usage: 'qv recovery status [vault]', description: 'Show guardian configuration and any pending recovery. No key required.' },
              { usage: 'qv recovery history [vault]', description: 'Show past recoveries. No key required; requires the indexer.' },
              {
                usage: 'qv recovery initiate <vault> --owner <address>... --threshold <n>',
                description: 'Initiate recovery as a guardian. Repeat --owner for the complete replacement owner set.',
              },
              { usage: 'qv recovery approve <vault> <hash> [assertions]', description: 'Approve a pending recovery as a guardian.' },
              { usage: 'qv recovery unapprove <vault> <hash> [assertions]', description: 'Withdraw your guardian approval.' },
              { usage: 'qv recovery execute <vault> <hash> [assertions]', description: 'Execute recovery after quorum and delay, replacing every vault owner.' },
              { usage: 'qv recovery cancel <vault> <hash> [assertions]', description: 'Cancel a pending recovery as a current owner.' },
              { usage: 'qv recovery expire <vault> <hash> [assertions]', description: 'Perform permissionless cleanup of an expired recovery.' },
            ]}
          />
        </div>
      </div>

      <div className={panel}>
        <h2 className={h2}>Vault creation</h2>
        <Commands
          entries={[
            {
              usage: 'qv vault create (--owner <address>... | --from <path>) [options]',
              description: 'Mine a shard-valid CREATE2 salt and deploy a new vault.',
              options: [
                '--threshold <n> — approvals required; default all owners',
                '--min-delay <duration> — vault minimum timelock',
                '--salt-file <path> — use output previously produced by qv vault mine-salt',
                '--from <path> — read the vault definition from JSON',
              ],
            },
            {
              usage: 'qv vault mine-salt (--owner <address>... | --from <path>) [options]',
              description: 'Mine a shard-valid CREATE2 salt offline for later deployment.',
              options: [
                '--threshold <n> — approvals required',
                '--min-delay <duration> — vault minimum timelock',
                '--from <path> — read the vault definition from JSON',
                '--out <path> — write the salt and bound parameters to this file',
              ],
            },
          ]}
        />
      </div>

      <div className={panel}>
        <h2 className={h2}>Monitoring</h2>
        <Commands
          entries={[
            {
              usage: 'qv watch [vault] [--topics <list>]',
              description: 'Stream indexed vault events until interrupted.',
              options: ['--topics — comma-separated transactions, confirmations, owners, modules, deposits, tokenTransfers, recoveries, signedMessages'],
            },
            {
              usage: 'qv tui',
              description: 'Open the full-screen monitor for vaults associated with the active identity.',
              note: 'The TUI delegates signatures to short-lived one-shot qv processes and never retains a key.',
            },
          ]}
        />
      </div>

      <div className={panel}>
        <h2 className={h2}>JSON contract</h2>
        <div className={block}>
          <pre>{`{
  "schema": 1,
  "ok": true,
  "command": "tx show",
  "changed": false,
  "retryable": false,
  "data": {},
  "steps": [],
  "next": [],
  "untrusted": [],
  "warnings": []
}`}</pre>
        </div>
        <div className={`${prose} mt-3 space-y-2`}>
          <p>
            Failures use the same envelope with <code className={code}>ok: false</code> and an{' '}
            <code className={code}>error</code> object containing <code className={code}>code</code>,{' '}
            <code className={code}>message</code>, and optional remediation or next commands. Multi-step
            writes report every broadcast in <code className={code}>steps</code>.
          </p>
          <p>
            All bigint-valued fields are decimal strings in the smallest unit, never JavaScript
            numbers. <code className={code}>changed</code> is{' '}
            <code className={code}>true | false | &quot;unknown&quot;</code>; unknown means a write was
            broadcast but not confirmed. Text identified by JSON Pointers in{' '}
            <code className={code}>untrusted</code> originated from an attacker-controllable source.
          </p>
          <p className="text-sm text-dark-400">
            Stable error codes are <code className={code}>VALIDATION</code>,{' '}
            <code className={code}>CONFIG</code>, <code className={code}>PRECONDITION</code>,{' '}
            <code className={code}>NO_SIGNER</code>, <code className={code}>NO_INDEXER</code>,{' '}
            <code className={code}>INDEXER_QUERY</code>, <code className={code}>NOT_FOUND</code>,{' '}
            <code className={code}>REVERT</code>, <code className={code}>SALT_MINING</code>,{' '}
            <code className={code}>STALE_PROPOSAL</code>, <code className={code}>ABORTED</code>,{' '}
            <code className={code}>POLICY</code>, <code className={code}>DECLINED</code>, and{' '}
            <code className={code}>UNKNOWN</code>.
          </p>
        </div>

        <h3 className={`${h3} mt-6`}>Process exit codes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-dark-300">
            <tbody>
              {[
                ['0', 'Success'],
                ['1', 'Operational failure, including failed inner vault execution'],
                ['2', 'Usage or configuration error'],
                ['3', 'Precondition failure or policy refusal'],
                ['4', 'Not executed: approved_only or timelock_started'],
                ['5', 'Confirmation declined'],
                ['130', 'Interrupted'],
              ].map(([value, meaning]) => (
                <tr key={value} className="border-b border-dark-700/50">
                  <td className="py-2 pr-4 font-mono text-primary-400 w-16">{value}</td>
                  <td className="py-2">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={panel}>
        <h2 className={h2}>Related documentation</h2>
        <div className={`${prose} space-y-2`}>
          <p>
            Start with the <Link to="/docs/cli" className="text-primary-500 hover:text-primary-400 underline">CLI guide</Link>{' '}
            for installation, configuration, key handling, policy, and automation examples.
          </p>
          <p>
            The runtime-generated <code className={code}>qv --schema --schema-version 1</code> output
            is the authoritative machine-readable reference for the installed version.
          </p>
          <p>
            See the{' '}
            <a
              href="https://github.com/Quai-Vault/quaivault-cli/blob/main/SECURITY.md"
              target="_blank"
              rel="noreferrer"
              className="text-primary-500 hover:text-primary-400 underline"
            >
              CLI security model
            </a>{' '}
            for threat boundaries and irreversible operations.
          </p>
        </div>
      </div>
    </DocLayout>
  );
}
