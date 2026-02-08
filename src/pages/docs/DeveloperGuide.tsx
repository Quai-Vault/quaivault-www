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
        <div className="space-y-3 text-base text-dark-300">
          <p>
            Contract addresses are configured via environment variables. On Orchard Testnet:
          </p>
          <div className="bg-vault-dark-4 rounded p-4 border border-dark-600 font-mono text-sm overflow-x-auto">
            <div className="space-y-2 text-dark-300">
              <div><span className="text-dark-500">QUAIVAULT_IMPLEMENTATION:</span> <span className="text-primary-400">0x001e1c40f1B96f530eC816A68f760E34673Ee7b8</span></div>
              <div><span className="text-dark-500">QUAIVAULT_FACTORY:</span> <span className="text-primary-400">0x00233Cb4F587287aFe5c7e88b971A3a36b3ba0d6</span></div>
              <div><span className="text-dark-500">SOCIAL_RECOVERY_MODULE:</span> <span className="text-primary-400">0x003dFf172a2633E12A31761CC8126867bfC63686</span></div>
              <div><span className="text-dark-500">DAILY_LIMIT_MODULE:</span> <span className="text-primary-400">0x005875F6D7CF819c50B2bdc8115466eD770670A8</span></div>
              <div><span className="text-dark-500">WHITELIST_MODULE:</span> <span className="text-primary-400">0x00540EfEb4dC0Cbb965830A678eC9e6699663325</span></div>
              <div><span className="text-dark-500">MULTISEND:</span> <span className="text-primary-400">0x0060a725Ef00CB737f24F7e00da94c1Ce03bf1Dc</span></div>
            </div>
          </div>
          <p className="text-sm text-dark-500">
            Note: These addresses are for Orchard Testnet. Mainnet addresses will differ.
          </p>
        </div>
      </div>

      {/* Core Functions */}
      <div className="vault-panel p-6 mb-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">Core Functions</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-base font-display font-bold text-dark-200 mb-2 font-mono">proposeTransaction(address to, uint256 value, bytes data)</h3>
            <p className="text-base text-dark-300 leading-relaxed mb-2">
              Proposes a new transaction. Returns the transaction hash. Only callable by owners.
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
              Cancels a pending transaction. Callable by proposer or any owner (if threshold met).
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
            <h3 className="text-base font-display font-bold text-dark-200 mb-2">Using ethers.js / quais</h3>
            <div className="bg-vault-dark-4 rounded p-4 border border-dark-600 font-mono text-xs text-dark-300 overflow-x-auto">
              <pre>{`import { Contract } from 'quais';
import QuaiVaultABI from './abis/QuaiVault.json';

const walletAddress = '0x...'; // Your vault address
const provider = new JsonRpcProvider(RPC_URL);
const wallet = new Contract(walletAddress, QuaiVaultABI, provider);

// Propose a transaction
const tx = await wallet.proposeTransaction(
  '0x...', // to
  ethers.parseEther('1.0'), // value
  '0x' // data
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

// Single transaction: deploys vault and initializes it
const tx = await factory.createWallet(owners, threshold, salt);
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
            <p className="font-mono text-sm text-primary-400 mb-1">TransactionCancelled(bytes32 indexed txHash, address indexed canceller)</p>
            <p className="text-xs text-dark-400">Emitted when a transaction is cancelled</p>
          </div>
          <div className="bg-vault-dark-4 rounded p-3 border border-dark-600">
            <p className="font-mono text-sm text-primary-400 mb-1">ApprovalRevoked(bytes32 indexed txHash, address indexed owner)</p>
            <p className="text-xs text-dark-400">Emitted when an owner revokes their approval</p>
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
            Common revert reasons:
          </p>
          <ul className="space-y-2 ml-4 list-disc">
            <li><code className="bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-sm">"Not an owner"</code> - Caller is not a vault owner</li>
            <li><code className="bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-sm">"Transaction already exists"</code> - Transaction hash already proposed</li>
            <li><code className="bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-sm">"Already approved"</code> - Owner already approved this transaction</li>
            <li><code className="bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-sm">"Not enough approvals"</code> - Threshold not met</li>
            <li><code className="bg-vault-dark-4 px-1 py-0.5 rounded text-primary-400 font-mono text-sm">"Transaction already executed"</code> - Transaction was already executed</li>
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
            <li>Use Orchard Testnet for development</li>
            <li>Deploy test vaults using the factory</li>
            <li>Test all transaction states (pending, approved, executed, cancelled)</li>
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
