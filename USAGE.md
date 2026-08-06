# 📖 Usage Guide

Once the application is running, follow these steps to interact with the ZK smart contracts:

## 1. Connecting Your Wallet
1. Navigate to the web interface (e.g., `http://localhost:3000`).
2. Click the **Connect 1AM Wallet** button.
3. The 1AM Wallet extension will prompt you to approve the connection to the Midnight Preview Network. Once approved, your shielded identity is active.

## 2. Creating an Auction (Seller)
1. Go to the **Auctions** page and click **Create Private Auction**.
2. Enter the item details and your **Secret Reserve Price**.
3. Submit the transaction. Your wallet will generate a zero-knowledge proof locally to hide the reserve price and a random salt. Only the public commitment will be deployed to the blockchain.
4. Your auction is now live! You can track it in your **Command Center** dashboard.

## 3. Placing a Bid (Bidder)
1. Ensure you are connected with a *different* wallet address than the seller (you can easily create multiple accounts in the 1AM Wallet for testing).
2. Browse the active auctions on the Auctions page.
3. Click **Place Sealed Bid**, enter your bid amount (must be higher than the current highest bid), and submit.
4. Your bid is verified via a ZK proof without revealing your real wallet address.

## 4. Settling the Auction (Seller)
1. Once you are ready to conclude the auction, navigate to your **Command Center**.
2. Click **Reveal & Settle Auction** on your deployed auction card.
3. Your wallet will generate a final ZK proof using your original secret reserve price and salt to cryptographically prove whether the highest bid met the threshold.
4. The auction state will update to **SOLD** (if the reserve was met) or **EXPIRED** (if the reserve was not met).

## 5. Withdrawing Funds
- If an auction expires without meeting the reserve price, the highest bidder can click **Withdraw Funds** to safely reclaim their locked test tokens.
