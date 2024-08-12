import {
  TonClient, JettonMaster, JettonWallet, WalletContractV5R1, internal
  , Address, beginCell, storeMessageRelaxed, toNano
} from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";
// import { Address, beginCell, internal, storeMessageRelaxed, toNano } from '@ton/core';
import Swal from 'sweetalert2'


const client = new TonClient({
  endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
  apiKey: `${import.meta.env.VITE_TESTNET_API_KEY}`
});

const mnemonics = `${import.meta.env.VITE_WALLET_MNEMONICS}`.split(" ");

export async function transferTon2User(userAddress) {

  // Convert mnemonics to private key
  let keyPair = await mnemonicToPrivateKey(mnemonics);

  // Create wallet contract
  let workchain = 0; // Usually you need a workchain 0
  let wallet = WalletContractV5R1.create({ workchain, publicKey: keyPair.publicKey });

  let walletContract = client.open(wallet);

  const seqno = await walletContract.getSeqno();

  await walletContract.sendTransfer({
    secretKey: keyPair.secretKey,
    seqno: seqno,
    messages: [
      internal({
        to: userAddress,
        value: "0.02", // 0.02 TON
        body: "Flip Coin Win Reward", // optional comment
        bounce: false,
      })
    ]
  });

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  Swal.fire({
    title: "Reward Transfer Successful !!",
    text: "Please Check Your TON Wallet.",
    icon: "success"
  });
}

export async function transferUsdt2User(userAddress) {

  // Convert mnemonics to private key
  let keyPair = await mnemonicToPrivateKey(mnemonics);

  // Create wallet contract
  let workchain = 0; // Usually you need a workchain 0
  let wallet = WalletContractV5R1.create({ workchain, publicKey: keyPair.publicKey });

  let walletContract = client.open(wallet);

  let mainJettonWallet = await getJettonWalletAddress(`${import.meta.env.VITE_WALLET_ADDRESS}`);

  const internalMessage = internal({
    to: mainJettonWallet,
    value: toNano('0.1'),
    bounce: true,
    body: getJettonMsgBody(userAddress, '20000')
  });

  const seqno = await walletContract.getSeqno();

  await walletContract.sendTransfer({
    secretKey: keyPair.secretKey,
    seqno: seqno,
    messages: [
      internalMessage
    ]
  });

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  Swal.fire({
    title: "Reward Transfer Successful !!",
    text: "Please Check Your TON Wallet.",
    icon: "success"
  });
}

export async function getJettonWalletAddress(address) {
  const jettonMasterAddress = Address.parse(`${import.meta.env.VITE_USDT_MASTER_ADDRESS}`);
  const jettonMasterContract = client.open(JettonMaster.create(jettonMasterAddress));
  console.log(jettonMasterContract.address.toString());
  let mainJettonWallet = await jettonMasterContract.getWalletAddress(Address.parse(address));
  return mainJettonWallet;
}

export function getJettonMsgBody(address, amount) {
  let forwardPayload = beginCell()
    .storeBit(0) // whether you want to store the forward payload in the same cell or not. 0 means no, 1 means yes.
    .storeUint(0, 32)
    .storeBuffer(Buffer.from("Flip Coin", "utf-8"))
    .endCell();

  let messageBody = beginCell()
    .storeUint(0x0f8a7ea5, 32) // opcode for jetton transfer
    .storeUint(0, 64) // query id
    .storeCoins(amount) // jetton amount, amount * 10^6, 0.01
    .storeAddress(Address.parse(address))
    .storeAddress(Address.parse(address)) // response destination
    .storeBit(0) // no custom payload
    .storeCoins(toNano('0.02')) // forward amount - if >0, will send notification message
    .storeBit(1) // we store forwardPayload as a reference
    .storeRef(forwardPayload)
    .endCell();
  return messageBody;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}