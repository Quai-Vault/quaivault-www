import { Link } from 'react-router-dom';
import DocLayout from '../../components/DocLayout';
import config from '../../config';

export default function DeveloperGuide() {
  return (
    <DocLayout
      title="Developer Guide"
      description="Technical documentation for developers integrating with Quai Vault smart contracts."
    >
      {/* Architecture */}
      <div className="vault-panel p-6 mb-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">Architecture</h2>

        <div className="space-y-4 text-base text-dark-300">
          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Contract Architecture</h3>
            <p className="leading-relaxed mb-2">
              Quai Vault deploys immutable, non-upgradeable contracts with Zodiac IAvatar compliance for DAO governance integration:
            </p>
            <ul className="space-y-1 ml-4 list-disc">
              <li><strong className="text-dark-200">QuaiVault:</strong> Core implementation with Zodiac IAvatar interface (QuaiVault.sol)</li>
              <li><strong className="text-dark-200">QuaiVaultProxy:</strong> Minimal forwarding proxy per vault instance (no upgrade capability)</li>
              <li><strong className="text-dark-200">QuaiVaultFactory:</strong> CREATE2 factory for deterministic deployment</li>
            </ul>
            <p className="mt-2">
              Each vault is a lightweight proxy that delegates to the shared implementation contract. The proxy
              exposes no upgrade functions -- once deployed, vault logic is immutable.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Module System</h3>
            <p className="leading-relaxed">
              Modules are separate contracts that extend vault functionality. They interact with the vault
              through the <code className="bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-sm">onlyModule</code> modifier
              and Zodiac standard linked list storage for module management.
              Modules can be enabled/disabled dynamically without affecting the core vault.
            </p>
          </div>
        </div>
      </div>

      {/* Contract Addresses */}
      <div className="vault-panel p-6 mb-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">Contract Addresses</h2>
        <div className="space-y-4 text-base text-dark-300">
          <p>
            Contract addresses are configured via environment variables. Quai Vault is live on Quai mainnet and
            also remains deployed on Orchard Testnet for development and integration testing.
          </p>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Mainnet</h3>
            <div className="bg-vault-dark-4 rounded p-4 border border-dark-600 font-mono text-sm overflow-x-auto">
              <div className="space-y-2 text-dark-300">
                <div><span className="text-dark-500">QUAIVAULT_IMPLEMENTATION:</span> <span className="text-primary-400">0x0038E6d84412A10CdcE41b0f62A05350023f1fb6</span></div>
                <div><span className="text-dark-500">QUAIVAULT_FACTORY:</span> <span className="text-primary-400">0x003613aC5FFd45bFF7B2F0210DA2fF660908c488</span></div>
                <div><span className="text-dark-500">SOCIAL_RECOVERY_MODULE:</span> <span className="text-primary-400">0x000dbc29Bdd311C29a4008164052fc2E67c0D937</span></div>
                <div><span className="text-dark-500">MULTISEND_CALL_ONLY:</span> <span className="text-primary-400">0x003f62e6a7f2EB6b94345a9A41671888eC4A3ebA</span></div>
              </div>
            </div>
            <p className="text-sm text-dark-500 mt-2">
              Mainnet app:{' '}
              <a
                href={config.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 underline"
              >
                {config.appUrl.replace(/^https?:\/\//, '')}
              </a>
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Orchard Testnet</h3>
            <p className="text-sm text-dark-400 mb-2">
              The testnet implementation is still live for builders. Point your dev environment at{' '}
              <code className="bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-xs">VITE_TESTNET_APP_URL</code>{' '}
              (
              <a
                href={config.testnetAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 underline"
              >
                {config.testnetAppUrl.replace(/^https?:\/\//, '')}
              </a>
              ) and use the testnet contract addresses below.
            </p>
            <div className="bg-vault-dark-4 rounded p-4 border border-dark-600 font-mono text-sm overflow-x-auto">
              <div className="space-y-2 text-dark-300">
                <div><span className="text-dark-500">VITE_QUAIVAULT_IMPLEMENTATION:</span> <span className="text-primary-400">0x004E539Cf477A5Cb456A56023f083cD91Bc4934e</span></div>
                <div><span className="text-dark-500">VITE_QUAIVAULT_FACTORY:</span> <span className="text-primary-400">0x002d1305D597c157bB975967FA2e5337674b0E5F</span></div>
                <div><span className="text-dark-500">VITE_SOCIAL_RECOVERY_MODULE:</span> <span className="text-primary-400">0x003a465e661D0E44C1e78b7B256D8C37f699E61e</span></div>
                <div><span className="text-dark-500">VITE_MULTISEND_CALL_ONLY:</span> <span className="text-primary-400">0x002ae8A47C2da497fe569AfCF0486410aA1093E0</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Functions */}
      <div className="vault-panel p-6 mb-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">Core Functions</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2 font-mono">proposeTransaction(address to, uint256 value, bytes data, uint48 expiration, uint32 requestedDelay)</h3>
            <p className="text-base text-dark-300 leading-relaxed mb-2">
              Proposes a new transaction. Returns the transaction hash. Only callable by owners. Three overloads: basic (to, value, data), with expiration (to, value, data, expiration), and full (to, value, data, expiration, requestedDelay). Set expiration to 0 for no expiry and requestedDelay to 0 for no additional delay.
            </p>
            <div className="bg-vault-dark-4 rounded p-3 border border-dark-600 font-mono text-xs text-dark-400">
              Returns: bytes32 txHash
            </div>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2 font-mono">approveTransaction(bytes32 txHash)</h3>
            <p className="text-base text-dark-300 leading-relaxed mb-2">
              Approves a pending transaction. Only callable by owners who haven't already approved.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2 font-mono">executeTransaction(bytes32 txHash)</h3>
            <p className="text-base text-dark-300 leading-relaxed mb-2">
              Executes a transaction that has reached the threshold. Only callable by owners.
              Performs the actual on-chain action.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2 font-mono">cancelTransaction(bytes32 txHash)</h3>
            <p className="text-base text-dark-300 leading-relaxed mb-2">
              Cancels a pending transaction. Only callable by the proposer, and only before the approval threshold has been reached. Once quorum is met (approvedAt is set), the proposer can no longer cancel — use cancelByConsensus instead.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2 font-mono">cancelByConsensus(bytes32 txHash)</h3>
            <p className="text-base text-dark-300 leading-relaxed mb-2">
              Cancels an approved transaction via multisig consensus. Only callable as a self-call (through a multisig proposal targeting the vault itself).
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2 font-mono">expireTransaction(bytes32 txHash)</h3>
            <p className="text-base text-dark-300 leading-relaxed mb-2">
              Cleans up an expired transaction. Permissionless — callable by anyone after the transaction's expiration timestamp has passed.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2 font-mono">approveAndExecute(bytes32 txHash)</h3>
            <p className="text-base text-dark-300 leading-relaxed mb-2">
              Approve and execute a transaction in a single call. If the caller's approval meets the threshold,
              the transaction is executed immediately. Only callable by owners.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2 font-mono">revokeApproval(bytes32 txHash)</h3>
            <p className="text-base text-dark-300 leading-relaxed mb-2">
              Revoke a previous approval on a pending transaction. Only callable by owners who have already approved.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2 font-mono">setMinExecutionDelay(uint32 delay)</h3>
            <p className="text-base text-dark-300 leading-relaxed mb-2">
              Changes the vault-level minimum execution delay. Accepts values from 0 (no delay) up to 30 days (2,592,000 seconds). Reverts with <code className="bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-sm">ExecutionDelayTooLong()</code> if the value exceeds the maximum. Only callable as a self-call (through a multisig proposal).
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2 font-mono">addDelegatecallTarget(address target)</h3>
            <p className="text-base text-dark-300 leading-relaxed mb-2">
              Adds an address to the DelegateCall whitelist. Once whitelisted, modules can execute DelegateCall to this target. Only callable as a self-call (through a multisig proposal). Reverts with <code className="bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-sm">DelegatecallTargetAlreadyAllowed(target)</code> if the address is already on the whitelist.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2 font-mono">removeDelegatecallTarget(address target)</h3>
            <p className="text-base text-dark-300 leading-relaxed mb-2">
              Removes an address from the DelegateCall whitelist. Only callable as a self-call (through a multisig proposal). Reverts with <code className="bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-sm">DelegatecallTargetNotAllowed(target)</code> if the address is not on the whitelist.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2 font-mono">signMessage(bytes data)</h3>
            <p className="text-base text-dark-300 leading-relaxed mb-2">
              Pre-approves a message hash for EIP-1271 contract signatures. Only callable as a self-call. Returns the message hash.
            </p>
            <div className="bg-vault-dark-4 rounded p-3 border border-dark-600 font-mono text-xs text-dark-400">
              Returns: bytes32 msgHash
            </div>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2 font-mono">unsignMessage(bytes data)</h3>
            <p className="text-base text-dark-300 leading-relaxed mb-2">
              Revokes a previously signed message. Only callable as a self-call.
            </p>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2 font-mono">isValidSignature(bytes32 dataHash, bytes signature)</h3>
            <p className="text-base text-dark-300 leading-relaxed mb-2">
              EIP-1271 validation. Returns magic value 0x1626ba7e if the message was pre-approved via signMessage, 0xffffffff otherwise. The signature parameter is ignored.
            </p>
            <div className="bg-vault-dark-4 rounded p-3 border border-dark-600 font-mono text-xs text-dark-400">
              Returns: bytes4 magicValue
            </div>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-3">Zodiac Module Execution</h3>

            <div className="space-y-3">
              <div>
                <h3 className="text-base font-display font-bold text-dark-200 mb-2 font-mono">execTransactionFromModule(address to, uint256 value, bytes data, Enum.Operation operation)</h3>
                <p className="text-base text-dark-300 leading-relaxed mb-2">
                  Execute a transaction from an enabled module. Implements the Zodiac IAvatar interface.
                  Only callable by enabled modules.
                </p>
                <div className="bg-vault-dark-4 rounded p-3 border border-dark-600 font-mono text-xs text-dark-400">
                  Returns: bool success
                </div>
              </div>

              <div>
                <h3 className="text-base font-display font-bold text-dark-200 mb-2 font-mono">execTransactionFromModuleReturnData(address to, uint256 value, bytes data, Enum.Operation operation)</h3>
                <p className="text-base text-dark-300 leading-relaxed mb-2">
                  Execute a transaction from an enabled module and return the result data. Implements the Zodiac IAvatar interface.
                  Only callable by enabled modules.
                </p>
                <div className="bg-vault-dark-4 rounded p-3 border border-dark-600 font-mono text-xs text-dark-400">
                  Returns: bool success, bytes returnData
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-3">Module Management</h3>

            <div className="space-y-3">
              <div>
                <h3 className="text-base font-display font-bold text-dark-200 mb-2 font-mono">enableModule(address module)</h3>
                <p className="text-base text-dark-300 leading-relaxed mb-2">
                  Enable a module for the vault. Only callable via multisig transaction.
                </p>
              </div>

              <div>
                <h3 className="text-base font-display font-bold text-dark-200 mb-2 font-mono">disableModule(address prevModule, address module)</h3>
                <p className="text-base text-dark-300 leading-relaxed mb-2">
                  Disable an enabled module. Requires the previous module in the linked list. Only callable via multisig transaction.
                </p>
              </div>

              <div>
                <h3 className="text-base font-display font-bold text-dark-200 mb-2 font-mono">isModuleEnabled(address module)</h3>
                <p className="text-base text-dark-300 leading-relaxed mb-2">
                  Check if a module is enabled for this vault.
                </p>
                <div className="bg-vault-dark-4 rounded p-3 border border-dark-600 font-mono text-xs text-dark-400">
                  Returns: bool enabled
                </div>
              </div>

              <div>
                <h3 className="text-base font-display font-bold text-dark-200 mb-2 font-mono">getModulesPaginated(address start, uint256 pageSize)</h3>
                <p className="text-base text-dark-300 leading-relaxed mb-2">
                  Returns a paginated list of enabled modules using Zodiac linked list traversal.
                </p>
                <div className="bg-vault-dark-4 rounded p-3 border border-dark-600 font-mono text-xs text-dark-400">
                  Returns: address[] modules, address next
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Examples */}
      <div className="vault-panel p-6 mb-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">Integration Examples</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Using quais</h3>
            <div className="bg-vault-dark-4 rounded p-4 border border-dark-600 font-mono text-xs text-dark-300 overflow-x-auto">
              <pre>{`import { Contract, JsonRpcProvider, parseQuai } from 'quais';
import QuaiVaultABI from './abis/QuaiVault.json';

const walletAddress = '0x...'; // Your vault address
const provider = new JsonRpcProvider(RPC_URL);
const wallet = new Contract(walletAddress, QuaiVaultABI, provider);

// Propose a transaction with expiration and delay
const expiration = Math.floor(Date.now() / 1000) + 86400; // 24 hours from now
const executionDelay = 3600; // 1 hour delay after approval
const tx = await wallet.proposeTransaction(
  '0x...', // to
  parseQuai('1.0'), // value
  '0x', // data
  expiration,
  executionDelay
);

// Approve a transaction
await wallet.approveTransaction(txHash);

// Execute a transaction
await wallet.executeTransaction(txHash);`}</pre>
            </div>
          </div>

          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Creating a Vault via Factory</h3>
            <div className="bg-vault-dark-4 rounded p-4 border border-dark-600 font-mono text-xs text-dark-300 overflow-x-auto">
              <pre>{`import QuaiVaultFactoryABI from './abis/QuaiVaultFactory.json';

const factory = new Contract(
  QUAIVAULT_FACTORY_ADDRESS,
  QuaiVaultFactoryABI,
  signer
);

const owners = ['0x...', '0x...', '0x...'];
const threshold = 2;
const salt = '0x...'; // CREATE2 salt mined for valid shard prefix
const minExecutionDelay = 3600; // 1 hour minimum delay

// Factory overloads (simplest to most configurable):
// 3-param: createWallet(owners, threshold, salt)
// 4-param: createWallet(owners, threshold, salt, minExecutionDelay)
// 5-param: createWallet(owners, threshold, salt, minExecutionDelay, initialModules)
// 6-param: createWallet(owners, threshold, salt, minExecutionDelay, initialModules, initialDelegatecallTargets)

// Simple deployment (no modules, empty DelegateCall whitelist)
const tx = await factory.createWallet(
  owners, threshold, salt, minExecutionDelay
);

// Integrator deployment (e.g., DAO summoner pattern):
// Pre-enable modules and whitelist DelegateCall targets atomically
// const initialModules = ['0xBaalAddress...'];
// const initialDelegatecallTargets = ['0xMultiSendCallOnlyAddress...'];
// const tx = await factory.createWallet(
//   owners, threshold, salt, minExecutionDelay, initialModules, initialDelegatecallTargets
// );
const receipt = await tx.wait();

// Extract vault address from events
const event = receipt.logs.find(
  log => factory.interface.parseLog(log)?.name === 'WalletCreated'
);
const vaultAddress = event.args.wallet;`}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Events */}
      <div className="vault-panel p-6 mb-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">Events</h2>

        <div className="space-y-3 text-base text-dark-300">
          <div className="bg-vault-dark-4 rounded p-3 border border-dark-600">
            <p className="font-mono text-sm text-primary-400 mb-1">TransactionProposed(bytes32 indexed txHash, address indexed proposer, address indexed to, uint256 value, bytes data)</p>
            <p className="text-xs text-dark-400">Emitted when a transaction is proposed</p>
          </div>
          <div className="bg-vault-dark-4 rounded p-3 border border-dark-600">
            <p className="font-mono text-sm text-primary-400 mb-1">TransactionApproved(bytes32 indexed txHash, address indexed approver)</p>
            <p className="text-xs text-dark-400">Emitted when an owner approves a transaction</p>
          </div>
          <div className="bg-vault-dark-4 rounded p-3 border border-dark-600">
            <p className="font-mono text-sm text-primary-400 mb-1">TransactionExecuted(bytes32 indexed txHash, address indexed executor)</p>
            <p className="text-xs text-dark-400">Emitted when a transaction is executed</p>
          </div>
          <div className="bg-vault-dark-4 rounded p-3 border border-dark-600">
            <p className="font-mono text-sm text-primary-400 mb-1">TransactionFailed(bytes32 indexed txHash, address indexed executor, bytes returnData)</p>
            <p className="text-xs text-dark-400">Emitted when a transaction execution fails (external call reverts)</p>
          </div>
          <div className="bg-vault-dark-4 rounded p-3 border border-dark-600">
            <p className="font-mono text-sm text-primary-400 mb-1">TransactionCancelled(bytes32 indexed txHash, address indexed canceller)</p>
            <p className="text-xs text-dark-400">Emitted when a transaction is cancelled</p>
          </div>
          <div className="bg-vault-dark-4 rounded p-3 border border-dark-600">
            <p className="font-mono text-sm text-primary-400 mb-1">TransactionExpired(bytes32 indexed txHash)</p>
            <p className="text-xs text-dark-400">Emitted when an expired transaction is cleaned up</p>
          </div>
          <div className="bg-vault-dark-4 rounded p-3 border border-dark-600">
            <p className="font-mono text-sm text-primary-400 mb-1">ThresholdReached(bytes32 indexed txHash, uint48 approvedAt, uint48 executableAfter)</p>
            <p className="text-xs text-dark-400">Emitted when a transaction first reaches the approval threshold</p>
          </div>
          <div className="bg-vault-dark-4 rounded p-3 border border-dark-600">
            <p className="font-mono text-sm text-primary-400 mb-1">ApprovalRevoked(bytes32 indexed txHash, address indexed owner)</p>
            <p className="text-xs text-dark-400">Emitted when an owner revokes their approval</p>
          </div>
          <div className="bg-vault-dark-4 rounded p-3 border border-dark-600">
            <p className="font-mono text-sm text-primary-400 mb-1">MinExecutionDelayChanged(uint32 oldDelay, uint32 newDelay)</p>
            <p className="text-xs text-dark-400">Emitted when the vault minimum execution delay is changed</p>
          </div>
          <div className="bg-vault-dark-4 rounded p-3 border border-dark-600">
            <p className="font-mono text-sm text-primary-400 mb-1">MessageSigned(bytes32 indexed msgHash, bytes data)</p>
            <p className="text-xs text-dark-400">Emitted when a message is signed via EIP-1271</p>
          </div>
          <div className="bg-vault-dark-4 rounded p-3 border border-dark-600">
            <p className="font-mono text-sm text-primary-400 mb-1">MessageUnsigned(bytes32 indexed msgHash, bytes data)</p>
            <p className="text-xs text-dark-400">Emitted when a message signature is revoked</p>
          </div>
          <div className="bg-vault-dark-4 rounded p-3 border border-dark-600">
            <p className="font-mono text-sm text-primary-400 mb-1">ModuleEnabled(address indexed module)</p>
            <p className="text-xs text-dark-400">Emitted when a module is enabled on the vault</p>
          </div>
          <div className="bg-vault-dark-4 rounded p-3 border border-dark-600">
            <p className="font-mono text-sm text-primary-400 mb-1">ModuleDisabled(address indexed module)</p>
            <p className="text-xs text-dark-400">Emitted when a module is disabled on the vault</p>
          </div>
          <div className="bg-vault-dark-4 rounded p-3 border border-dark-600">
            <p className="font-mono text-sm text-primary-400 mb-1">ExecutionFromModuleSuccess(address indexed module)</p>
            <p className="text-xs text-dark-400">Emitted when a module executes a transaction successfully</p>
          </div>
          <div className="bg-vault-dark-4 rounded p-3 border border-dark-600">
            <p className="font-mono text-sm text-primary-400 mb-1">ExecutionFromModuleFailure(address indexed module)</p>
            <p className="text-xs text-dark-400">Emitted when a module transaction execution fails</p>
          </div>
          <div className="bg-vault-dark-4 rounded p-3 border border-dark-600">
            <p className="font-mono text-sm text-primary-400 mb-1">Received(address indexed sender, uint256 amount)</p>
            <p className="text-xs text-dark-400">Emitted when the vault receives native QUAI</p>
          </div>
          <div className="bg-vault-dark-4 rounded p-3 border border-dark-600">
            <p className="font-mono text-sm text-primary-400 mb-1">OwnerAdded(address indexed owner)</p>
            <p className="text-xs text-dark-400">Emitted when an owner is added to the vault</p>
          </div>
          <div className="bg-vault-dark-4 rounded p-3 border border-dark-600">
            <p className="font-mono text-sm text-primary-400 mb-1">OwnerRemoved(address indexed owner)</p>
            <p className="text-xs text-dark-400">Emitted when an owner is removed from the vault</p>
          </div>
          <div className="bg-vault-dark-4 rounded p-3 border border-dark-600">
            <p className="font-mono text-sm text-primary-400 mb-1">ThresholdChanged(uint256 oldThreshold, uint256 newThreshold)</p>
            <p className="text-xs text-dark-400">Emitted when the approval threshold is changed</p>
          </div>
          <div className="bg-vault-dark-4 rounded p-3 border border-dark-600">
            <p className="font-mono text-sm text-primary-400 mb-1">DelegatecallTargetAdded(address indexed target)</p>
            <p className="text-xs text-dark-400">Emitted when an address is added to the DelegateCall whitelist</p>
          </div>
          <div className="bg-vault-dark-4 rounded p-3 border border-dark-600">
            <p className="font-mono text-sm text-primary-400 mb-1">DelegatecallTargetRemoved(address indexed target)</p>
            <p className="text-xs text-dark-400">Emitted when an address is removed from the DelegateCall whitelist</p>
          </div>
        </div>
      </div>

      {/* Gas Considerations */}
      <div className="vault-panel p-6 mb-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">Gas Considerations</h2>
        <div className="space-y-3 text-base text-dark-300">
          <p>
            Gas costs for common operations (approximate):
          </p>
          <ul className="space-y-2 ml-4 list-disc">
            <li><strong className="text-dark-200">Propose Transaction:</strong> ~50,000 - 100,000 gas</li>
            <li><strong className="text-dark-200">Approve Transaction:</strong> ~45,000 - 80,000 gas</li>
            <li><strong className="text-dark-200">Execute Transaction:</strong> Variable (depends on target contract)</li>
            <li><strong className="text-dark-200">Cancel Transaction:</strong> ~30,000 - 50,000 gas</li>
          </ul>
          <p className="mt-2">
            The frontend automatically estimates gas and adds buffers. For programmatic integrations,
            always estimate gas before sending transactions.
          </p>
        </div>
      </div>

      {/* Error Handling */}
      <div className="vault-panel p-6 mb-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">Error Handling</h2>
        <div className="space-y-3 text-base text-dark-300">
          <p>
            Custom errors:
          </p>
          <ul className="space-y-2 ml-4 list-disc">
            <li><code className="bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-sm">NotOwner()</code> - Caller is not a vault owner</li>
            <li><code className="bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-sm">TransactionAlreadyExists()</code> - Transaction hash already proposed</li>
            <li><code className="bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-sm">AlreadyApproved()</code> - Owner already approved this transaction</li>
            <li><code className="bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-sm">ThresholdNotMet()</code> - Approval threshold not met</li>
            <li><code className="bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-sm">AlreadyExecuted()</code> - Transaction was already executed</li>
            <li><code className="bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-sm">AlreadyCancelled()</code> - Transaction was already cancelled</li>
            <li><code className="bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-sm">NotProposer()</code> - Only the proposer can cancel pre-approval</li>
            <li><code className="bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-sm">CannotCancelApprovedTransaction()</code> - Cannot proposer-cancel after threshold reached</li>
            <li><code className="bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-sm">TimelockNotElapsed()</code> - Execution delay has not passed yet</li>
            <li><code className="bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-sm">ExpirationTooSoon()</code> - Expiration doesn't allow enough execution window</li>
            <li><code className="bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-sm">NotExpired()</code> - Transaction has not expired yet</li>
            <li><code className="bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-sm">DelegateCallNotAllowed(address target)</code> - DelegateCall attempted to a non-whitelisted target</li>
            <li><code className="bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-sm">DelegatecallTargetAlreadyAllowed(address target)</code> - Target is already on the DelegateCall whitelist</li>
            <li><code className="bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-sm">DelegatecallTargetNotAllowed(address target)</code> - Target is not on the DelegateCall whitelist</li>
            <li><code className="bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-sm">ExecutionDelayTooLong()</code> - minExecutionDelay exceeds 30-day maximum</li>
            <li><code className="bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-sm">ExpirationTooSoon(uint256 minimumExpiration)</code> - Expiration does not allow enough time after timelock elapses</li>
          </ul>
        </div>
      </div>

      {/* Testing */}
      <div className="vault-panel p-6 mb-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">Testing</h2>
        <div className="space-y-3 text-base text-dark-300">
          <p>
            For testing your integration:
          </p>
          <ul className="space-y-2 ml-4 list-disc">
            <li>Use Orchard Testnet (testnet.quaivault.org) for development and integration testing before targeting mainnet</li>
            <li>Deploy test vaults using the factory</li>
            <li>Test all transaction states (pending, executed, cancelled, expired, failed)</li>
            <li>Test module interactions</li>
            <li>Verify event emissions</li>
          </ul>
        </div>
      </div>

      {/* Resources */}
      <div className="vault-panel p-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">Resources</h2>
        <div className="space-y-3 text-base text-dark-300">
          <div>
            <a href={config.githubUrl} target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-400 underline">
              Source Code Repository
            </a>
            <p className="text-sm text-dark-500 mt-1">
              View contract source code, tests, and deployment scripts
            </p>
          </div>
          <div>
            <Link to="/docs/security" className="text-primary-500 hover:text-primary-400 underline">
              Security Documentation
            </Link>
            <p className="text-sm text-dark-500 mt-1">
              Security considerations and audit information
            </p>
          </div>
        </div>
      </div>
    </DocLayout>
  );
}
