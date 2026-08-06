# 🛠 Getting Started (Setup Guide)

If you are a judge or a new user wanting to run this project locally, follow these simple steps to set up your Midnight environment and start bidding!

## Step 1: Install the 1AM Wallet
VeilBid interacts with the Midnight Network via the 1AM Wallet browser extension.
1. Download the **1AM Wallet** extension from the Chrome Web Store (or compatible Chromium browser).
2. Create a new wallet and securely save your 24-word recovery phrase.
3. Once created, click on the network dropdown at the top of the wallet and ensure it is set to **Midnight Preview** (TestNet).

## Step 2: Get Free TestNet Tokens (Faucet)
You need test tokens (tNIGHT) to deploy contracts and place bids.
1. Copy your wallet address from the 1AM Wallet extension.
2. Go to the [Midnight Preview Faucet](https://faucet.testnet-01.midnight.network/).
3. Paste your address, request tokens, and wait a few seconds. Your wallet will be funded!

## Step 3: Run VeilBid Locally
Now that your wallet is ready, let's run the application.

```bash
# 1. Clone the repository
git clone https://github.com/thisisouvik/VeilBid.git
cd VeilBid

# 2. Install Node.js dependencies
npm install

# 3. Set up environment variables
# (You only need a Postgres database URL if you are testing the backend DB sync)
cp .env.example .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Click **"Connect Wallet"**, approve the connection in your 1AM extension, and you are ready to use the platform!
