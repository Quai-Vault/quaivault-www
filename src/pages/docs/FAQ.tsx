import { Link } from 'react-router-dom';
import DocLayout from '../../components/DocLayout';
import config from '../../config';

export default function FAQ() {
  const faqs = [
    {
      question: "What is a multisig wallet?",
      answer: "A multisig (multi-signature) wallet requires multiple approvals before executing transactions. Instead of one key controlling everything, control is distributed among multiple owners with a configurable threshold (e.g., 2 of 3 owners must approve)."
    },
    {
      question: "How do I create a multisig vault?",
      answer: "Connect your wallet, click 'Create' in the sidebar, add owner addresses, set a threshold, and deploy. The app mines a CREATE2 salt to find a valid shard-prefixed address, then calls the factory to deploy your vault in a single transaction."
    },
    {
      question: "What's the difference between proposing, approving, and executing?",
      answer: "Proposing creates a transaction that needs approvals. Approving adds your signature to a proposal. Executing actually performs the on-chain action once enough approvals are collected."
    },
    {
      question: "Can I change the owners or threshold after deployment?",
      answer: "Yes! You can add/remove owners and change the threshold through multisig transactions. These are self-calls to the vault contract and require threshold approvals."
    },
    {
      question: "What happens if I lose access to my owner key?",
      answer: "If you have Social Recovery configured, guardians can help recover access. Otherwise, the remaining owners can remove you and add a new owner. If you're the only owner or lose all keys, the vault may become inaccessible."
    },
    {
      question: "How does Social Recovery work?",
      answer: "Guardians can initiate recovery to replace owners. After threshold guardian approvals and a time delay, the recovery can be executed. Current owners can cancel recoveries during the delay period."
    },
    {
      question: "What are modules and why should I use them?",
      answer: "Modules are smart contracts that extend vault functionality. The Social Recovery module enables guardian-based wallet recovery if you lose access to your owner keys. Quai Vault also implements the Zodiac IAvatar standard, so any Zodiac-compatible module can be enabled via multisig consensus."
    },
    {
      question: "Can transactions be cancelled?",
      answer: "Yes. The proposer can cancel a transaction before the approval threshold has been reached. After the threshold is reached, cancellation requires a consensus cancel — a separate multisig self-call transaction. Once executed, expired, or failed, transactions cannot be cancelled."
    },
    {
      question: "How much gas do transactions cost?",
      answer: "Gas costs vary: proposing (~50-100k), approving (~45-80k), executing (variable based on target contract), cancelling (~30-50k). The frontend estimates gas and adds buffers automatically."
    },
    {
      question: "Is Quai Vault audited?",
      answer: "The contracts have undergone 5 rounds of AI-assisted security audits using Claude Opus 4.6. The final audit round produced 0 Critical, 0 High, and 0 Medium findings (3 Low, 7 Informational). All code is open source for review. A formal third-party audit is planned before mainnet deployment."
    },
    {
      question: "Can I use this on mainnet?",
      answer: "Currently, Quai Vault is deployed on Orchard Testnet only. Do not store significant funds. Mainnet deployment will follow a formal third-party audit."
    },
    {
      question: "What happens if a recovery doesn't execute automatically?",
      answer: "Recoveries require manual execution - they don't happen automatically. Once conditions are met (threshold approvals + time delay), anyone can call executeRecovery(). The frontend shows an 'Execute Recovery' button when ready."
    },
    {
      question: "Can I have multiple modules enabled at once?",
      answer: "Yes! A vault can have up to 50 modules enabled simultaneously. Social Recovery is the built-in module provided by Quai Vault. Since the vault implements the Zodiac IAvatar standard, any Zodiac-compatible module (Delay, Roles, Scope, etc.) can also be enabled via multisig consensus. All modules operate independently."
    },
    {
      question: "How do I verify a transaction on-chain?",
      answer: "Use the transaction lookup feature or check the transaction hash on a block explorer. All transactions emit events that can be queried on-chain."
    },
    {
      question: "What if I approve a transaction by mistake?",
      answer: "You can revoke your approval at any time before the transaction is executed. For regular multisig transactions, use the 'Revoke' button next to your approval. For social recovery approvals, guardians can also revoke their approval from the recovery management panel."
    },
    {
      question: "What are timelocks?",
      answer: "Timelocks add a mandatory waiting period between reaching the approval threshold and executing a transaction. There are two types: a vault-level minimum execution delay (applies to all transactions) and a per-transaction execution delay (requested by the proposer). The timer starts when the approval threshold is first reached and cannot be reset. Self-calls (vault administration) bypass timelocks to allow incident response."
    },
    {
      question: "What happens when a transaction expires?",
      answer: "A transaction with an expiration cannot be executed after the expiry timestamp passes. Anyone can call expireTransaction() to clean up expired transactions — this is permissionless. The transaction moves to the 'expired' state and must be re-proposed if still needed."
    },
    {
      question: "What tokens can the vault hold?",
      answer: "Quai Vault natively supports ERC-20 tokens, ERC-721 NFTs, and ERC-1155 multi-tokens. The vault contract includes the required receiver interfaces (onERC721Received, onERC1155Received, onERC1155BatchReceived) so tokens can be safely sent to your vault address."
    },
    {
      question: "What does a 'failed' transaction mean?",
      answer: "A failed transaction means the external call was attempted but reverted on-chain. Failed transactions are terminal — they cannot be retried or re-executed. You must propose a new transaction if you want to try again. This design prevents attackers from keeping transactions permanently stuck in a retryable state."
    },
    {
      question: "What is DelegateCall and why is it disabled by default?",
      answer: "DelegateCall allows a module to execute code in the context of your vault, with full access to storage and funds. This is a powerful but dangerous capability — it's the same attack vector used in the Bybit hack. Quai Vault disables DelegateCall by default (delegatecallDisabled = true) to protect against storage corruption attacks from malicious modules. You can enable it via a multisig self-call if you need MultiSend batching, but only do so with trusted, audited modules."
    },
    {
      question: "How do I enable MultiSend batching?",
      answer: "MultiSend uses DelegateCall to execute batched transactions. Since DelegateCall is disabled by default, you need to first propose a multisig self-call to setDelegatecallDisabled(false), gather threshold approvals, and execute it. After that, modules can use DelegateCall for batched operations. Only enable this if you trust all enabled modules on your vault."
    }
  ];

  return (
    <DocLayout
      title="Frequently Asked Questions"
      description="Common questions and answers about Quai Vault multisig wallets."
    >
      {/* FAQ List */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="vault-panel p-6">
            <h2 className="text-lg font-display font-bold text-dark-200 mb-3 flex items-start gap-3">
              <span className="doc-step-badge doc-step-badge-sm mt-0.5">
                Q
              </span>
              <span>{faq.question}</span>
            </h2>
            <div className="ml-9">
              <div className="flex items-start gap-3">
                <span className="doc-step-badge doc-step-badge-sm mt-0.5">
                  A
                </span>
                <p className="text-base text-dark-300 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Still Have Questions */}
      <div className="vault-panel p-6 mt-6">
        <h2 className="text-lg font-display font-bold text-dark-200 mb-4">Still Have Questions?</h2>
        <div className="space-y-3 text-base text-dark-300">
          <p>
            Can't find what you're looking for? Here are additional resources:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Link
              to="/docs/getting-started"
              className="vault-panel p-4 hover:border-primary-500/50 transition-all group"
            >
              <h3 className="text-base font-display font-bold text-dark-200 mb-2 group-hover:text-primary-400 transition-colors">
                Getting Started Guide
              </h3>
              <p className="text-sm text-dark-400">
                Step-by-step instructions for creating your first vault
              </p>
            </Link>
            <a
              href={config.githubIssuesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="vault-panel p-4 hover:border-primary-500/50 transition-all group"
            >
              <h3 className="text-base font-display font-bold text-dark-200 mb-2 group-hover:text-primary-400 transition-colors">
                GitHub Issues
              </h3>
              <p className="text-sm text-dark-400">
                Report bugs or ask questions on GitHub
              </p>
            </a>
          </div>
        </div>
      </div>
    </DocLayout>
  );
}
