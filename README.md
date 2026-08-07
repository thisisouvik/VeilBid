<div align="center">
  <img src="app/icon.png" alt="VeilBid Logo" width="140" style="border-radius: 20px; margin-bottom: 20px; box-shadow: 0 4px 14px rgba(0,0,0,0.3);" />
  
  # VeilBid
  **The Next Generation of Private Reserve Auctions on the Midnight Network**
  
  <br />

  [![VeilBid CI](https://github.com/thisisouvik/VeilBid/actions/workflows/ci.yml/badge.svg)](https://github.com/thisisouvik/VeilBid/actions/workflows/ci.yml)
  
  ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
  ![Midnight](https://img.shields.io/badge/Midnight_Preview-8b5cf6?style=for-the-badge)
</div>

---

## 🔗 Quick Links

*   🌐 **Live Deployed App**: [zk-auction-dun.vercel.app](https://zk-auction-dun.vercel.app/)
*   📜 **Deployed Preview Contract**: [`fd6bdc97815...c5cb5`](https://explorer.1am.xyz/contract/fd6bdc97815e8c3a9de7c20e1bfae641409321761684f2dbeb1746f0f34c5cb5?network=preview)
*   🎥 **Demo Video**: [Watch on YouTube](https://youtu.be/SgigJdq82VI)

---

## 💡 The Core Philosophy

### ❌ The Problem with Transparent Blockchains
*   **Exposed Reserve Prices**: Sellers lose their leverage when bidders can see exactly what the minimum acceptable price is.
*   **Strategic Sniping**: Bidders often wait until the last possible block to bid exactly the reserve price, artificially suppressing market value.
*   **Identity Leaks**: Public wallet addresses expose bidder identities, bidding strategies, and total wealth.
*   **MEV Front-running**: Transparent networks allow bots to analyze pending transactions and maliciously outbid real users.

### ✅ The VeilBid Solution
VeilBid solves this by leveraging the **Midnight Network's Zero-Knowledge (ZK)** capabilities to build a truly private auction environment:
*   **Hidden Reserve Prices**: Sellers cryptographically hide their reserve price. Bidders bid blindly without knowing the threshold.
*   **Secure Settlements**: When the auction ends, the ZK smart contract mathematically proves if the highest bid met the hidden reserve—*without ever revealing what the reserve was*.
*   **Shielded Identities**: Bidder identities are kept strictly private and entirely decoupled from their real wallet addresses.

---

## 🔒 Privacy Model Breakdown

VeilBid utilizes Midnight's hybrid state model to protect users. Here is exactly what data is visible vs. hidden:

### 👁️ Visible On-chain (Public)
*   🟢 `reserve_commitment`: A cryptographic hash (not the actual price).
*   🟢 `highest_bid`: The current leading bid amount.
*   🟢 `highest_bidder`: A randomly derived ZK identity key.
*   🟢 `status`: Auction state (`OPEN`, `SETTLED`, `EXPIRED`).
*   🟢 `bid_count`: Total network participation.

### 🛡️ Strictly Hidden (Zero-Knowledge)
*   🔴 **The Actual Reserve Price**: Encrypted on the seller's local device.
*   🔴 **The Private Salt**: Used to lock the commitment; never broadcasted.
*   🔴 **Real Wallet Addresses**: Hidden behind ZK proofs to prevent identity tracking.
*   🔴 **Bid History Linkage**: Impossible to trace who placed which bid.

---


## 📜 Zero-Knowledge Smart Contracts

The VeilBid smart contract is written entirely in **Compact** (Midnight's specialized ZK DSL). 

### The 4 Core ZK Circuits:
1.  **`createAuction`**: The seller hashes their `reserve_price` + `salt` locally. Only the resulting `reserve_commitment` is sent to the blockchain.
2.  **`placeBid`**: Verifies the new bid is higher than the current `highest_bid` without exposing the bidder's real address.
3.  **`settle`**: The seller proves that `hash(secret_price, salt) == reserve_commitment`, and the contract evaluates if the highest bid won.
4.  **`withdrawExpired`**: Allows participants to safely reclaim locked funds if the reserve wasn't met.

### On-Chain Verifications (Midnight PREVIEW Network)

| Action | Transaction Hash / Address | Explorer Link |
| :--- | :--- | :--- |
| **Smart Contract Address** | `fd6bdc97815e8c3a9de7c20e1bfae641409321761684f2dbeb1746f0f34c5cb5` | [Verify Contract](https://explorer.1am.xyz/contract/fd6bdc97815e8c3a9de7c20e1bfae641409321761684f2dbeb1746f0f34c5cb5?network=preview) |
| **Contract Deployment Tx** | `0d9e33a01496840e13d00dedc1d360c8c68e7b12c1395b93a4cc58f1ad38753b` | [View Tx](https://explorer.1am.xyz/tx/0d9e33a01496840e13d00dedc1d360c8c68e7b12c1395b93a4cc58f1ad38753b?network=preview) |
| **Create Auction Tx** | `c6f356c5b4b4c3e410a7f17b487ae5e960d9ee914f1e5af661736dc0ccb75167` | [View Tx](https://explorer.1am.xyz/tx/c6f356c5b4b4c3e410a7f17b487ae5e960d9ee914f1e5af661736dc0ccb75167?network=preview) |
| **Place Bid Tx** | `694fa889dcb764d2b8e28c847c0fe16533924c56364520633c325f0cced33e24` | [View Tx](https://explorer.1am.xyz/tx/694fa889dcb764d2b8e28c847c0fe16533924c56364520633c325f0cced33e24?network=preview) |
| **Settle Tx** | `19d63f588c7774535a987d168ff7aa1ae27f25e356870f8109fb3ae30c7ba4bc` | [View Tx](https://explorer.1am.xyz/tx/19d63f588c7774535a987d168ff7aa1ae27f25e356870f8109fb3ae30c7ba4bc?network=preview) |

> *Images of the Compact Circuit code and Block Explorer receipts are available in the `/assets/SMART CONTRACTS/` directory.*

---

## 🏗 Architecture & Workflow

### Technical Architecture
```mermaid
graph TD
    A[Next.js Frontend] -->|API Routes| B(Prisma / Neon Postgres)
    A -->|window.midnight.1am| C{1AM Wallet}
    C -->|Sign Tx| D[Midnight Preview Network]
    A -->|Midnight JS SDK| D
    A -->|Local ZK Proofs| E[Midnight Proof Server]
    B -->|Store off-chain data| F[(Neon DB)]
    D -->|Read on-chain state| A
```

### Protocol Workflow
```mermaid
sequenceDiagram
    actor Seller
    actor Bidder
    participant VeilBid App
    participant Midnight Network

    Seller->>VeilBid App: Enter Item Name & Secret Reserve
    VeilBid App->>VeilBid App: Local Hash(Reserve, Salt)
    VeilBid App->>Midnight Network: deployContract(Commitment)
    Midnight Network-->>VeilBid App: Contract Deployed
    
    Bidder->>VeilBid App: Enter Bid Amount
    VeilBid App->>Midnight Network: placeBid()
    Midnight Network-->>VeilBid App: Highest Bid Updated
    
    Seller->>VeilBid App: Click "Reveal & Settle"
    VeilBid App->>Midnight Network: settle(Private Reserve, Salt)
    Midnight Network-->>VeilBid App: Auction Settled / Winner Declared
```

---

## 📁 Repository Structure

```text
VeilBid/
├── app/                    # Next.js App Router (Frontend UI)
├── components/             # Reusable React components
├── contract/
│   └── src/
│       ├── auction.compact # Core Midnight ZK Smart Contract
│       └── auction.test.ts # Smart Contract automated tests
├── hooks/                  # Custom React hooks (Wallet context)
├── lib/                    # Midnight SDK API integration & Providers
├── prisma/                 # Neon Postgres Database Schema
└── public/                 # Static assets and ZK compiled keys
```

---

## ✅ Security & Testing

The VeilBid smart contract is rigorously tested using Vitest inside the Midnight testing environment to guarantee zero-knowledge constraints hold true under edge cases.

*   **Total Test Cases**: 15 exhaustive ZK logic tests.
*   **Result**: `PASS` (See `assets/TEST/test screenshot.png`)

To run them yourself:
```bash
npm install
npm test
```

---

## 📚 Project Documentation

The complete documentation for VeilBid has been modularized for easy reading. Check out the following files:

*   📖 **[SETUP.md](./SETUP.md)**: A complete guide on installing the 1AM Wallet, acquiring testnet tokens, and running the project locally.
*   📖 **[USAGE.md](./USAGE.md)**: Step-by-step instructions for creating auctions, placing bids, and settling smart contracts.
*   📖 **[PROPOSAL.md](./PROPOSAL.md)**: Detailed technical specifications, original problem statements, and the builder proposal.

---

## 🚀 The Future of VeilBid

**Planned Enhancements:**
*   **Dynamic Auto-Bidding**: Set maximum limits without revealing your ceiling to the network.
*   **Native ZK-NFTs**: Seamlessly and privately transfer Midnight NFTs to the winner upon auction settlement.

**Real-World Use Cases:**
*   🎨 **High-Value Art**: Wealthy buyers demand anonymity. Sellers need hidden minimums to spark bidding wars.
*   🏢 **Corporate Procurements**: Government or B2B sealed-bid contracts where pricing must remain absolutely secret until final evaluation.
*   📉 **DeFi Liquidations**: Private collateral liquidation to avoid market panic and front-running bots.

---

<div align="center">
  <b>Done in Midnight! 🌙</b><br>
  <i>Built with ❤️ by the Midnight Builder Community.</i>
</div>