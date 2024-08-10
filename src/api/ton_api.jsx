import { TonClient, WalletContractV5R1, internal } from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";

export async function transfer2User(userAddress) {

  const client = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: `${import.meta.env.VITE_TESTNET_API_KEY}`
  });

  // Convert mnemonics to private key
  let mnemonics = `${import.meta.env.VITE_WALLET_MNEMONICS}`.split(" ");
  let keyPair = await mnemonicToPrivateKey(mnemonics);

  // Create wallet contract
  let workchain = 0; // Usually you need a workchain 0
  let wallet = WalletContractV5R1.create({ workchain, publicKey: keyPair.publicKey });

  let walletContract = client.open(wallet);

  console.log("userAddress = " + userAddress);
  console.log("wallet address = " + wallet.address.toString());

  let balance = await walletContract.getBalance();
  console.log("balance = " + balance);

  const seqno = await walletContract.getSeqno();

  await walletContract.sendTransfer({
    secretKey: keyPair.secretKey,
    seqno: seqno,
    messages: [
      internal({
        to: userAddress,
        value: "0.01", // 0.05 TON
        body: "Flip Coin Win Reward", // optional comment
        bounce: false,
      })
    ]
  });

}