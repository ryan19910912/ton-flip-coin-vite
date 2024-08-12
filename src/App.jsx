import { useState } from 'react'
import './App.css';
import { TonConnectButton, useTonAddress, useTonConnectUI, CHAIN } from '@tonconnect/ui-react';
import { transferTon2User, transferUsdt2User, getJettonWalletAddress, getJettonMsgBody } from './api/ton_api';
import Swal from 'sweetalert2'

function App() {

  const [resultClassName, setResultClassName] = useState('heads');
  const userFriendlyAddress = useTonAddress();
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const [transferCoin, setTransferCoin] = useState('TON');

  function startTonGame(isHead){
    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
      // network: "https://testnet.toncenter.com/api/v2/jsonRPC",
      messages: [
        {
          address: `${import.meta.env.VITE_WALLET_ADDRESS}`,
          network: CHAIN.TESTNET,
          amount: "10000000"
        }
      ]
    }

    tonConnectUI.sendTransaction(transaction)
      .then(resp => {
        let randomNum = crypto.getRandomValues(new Uint32Array(1))[0];
        let result = Boolean(randomNum % 2);

        setTimeout(function () {
          if (result) {
            setResultClassName("tails");
          } else {
            setResultClassName("heads");
          }
        }, 1000);

        setTimeout(function () {
          if (result) {
            setResultClassName("heads");
          } else {
            setResultClassName("tails");
          }
        }, 2000);

        setTimeout(function () {
          if (isHead == result) {
            Swal.fire({
              title: "Congratulations, You Win !!",
              text: "0.02 Testnet TON coins will be transferred to you.",
              icon: "success"
            });
            // Double 轉回給 用戶
            transferTon2User(userFriendlyAddress);
          } else {
            Swal.fire({
              title: "Sorry, You Lose !!",
              text: "Try your luck again.",
              icon: "error"
            });
          }
        }, 4000);
      });
  }

  async function startUsdtGame(isHead){

    console.log("userFriendlyAddress = "+userFriendlyAddress);

    let jettonWalletAddress = await getJettonWalletAddress(userFriendlyAddress);

    console.log(jettonWalletAddress.toString());

    let messageBody = getJettonMsgBody(`${import.meta.env.VITE_WALLET_ADDRESS}`, '10000');

    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
      // network: "https://testnet.toncenter.com/api/v2/jsonRPC",
      messages: [
        {
          address: jettonWalletAddress.toString(),
          network: CHAIN.TESTNET,
          amount: "100000000",
          payload: messageBody.toBoc().toString("base64")
        }
      ]
    }

    tonConnectUI.sendTransaction(transaction)
      .then(resp => {
        console.log(resp);
        let randomNum = crypto.getRandomValues(new Uint32Array(1))[0];
        let result = Boolean(randomNum % 2);

        setTimeout(function () {
          if (result) {
            setResultClassName("tails");
          } else {
            setResultClassName("heads");
          }
        }, 1000);

        setTimeout(function () {
          if (result) {
            setResultClassName("heads");
          } else {
            setResultClassName("tails");
          }
        }, 2000);

        setTimeout(function () {
          if (isHead == result) {
            Swal.fire({
              title: "Congratulations, You Win !!",
              text: "0.02 Testnet USDT coins will be transferred to you.",
              icon: "success"
            });
            // Double 轉回給 用戶
            transferUsdt2User(userFriendlyAddress);
          } else {
            Swal.fire({
              title: "Sorry, You Lose !!",
              text: "Try your luck again.",
              icon: "error"
            });
          }
        }, 4000);
      });
  }

  function chooseTransferCoin(isHead){
    const inputOptions = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          "TON": "<img style='width: 100px;' src='https://res.coinpaper.com/coinpaper/toncoin_ton_logo_c5fb8b4302.png'></img><p><b>TON Coin</b></p>",
          "USDT": "<img style='width: 100px;' src='https://cache.tonapi.io/imgproxy/X1P3-t1CXlE276oI_YQQIeswr9zAZ6JfZl5WxOrGcSo/rs:fill:200:200:1/g:no/aHR0cHM6Ly9jYWNoZS50b25hcGkuaW8vaW1ncHJveHkvVDNQQjRzN29wck5WYUprd3FiR2c1NG5leEtFMHp6S2hjclB2OGpjV1l6VS9yczpmaWxsOjIwMDoyMDA6MS9nOm5vL2FIUjBjSE02THk5MFpYUm9aWEl1ZEc4dmFXMWhaMlZ6TDJ4dloyOURhWEpqYkdVdWNHNW4ud2VicA.webp'></img><p><b>USDT Coin</b></p>"
        });
      }, 1000);
    });
    Swal.fire({
      title: "Select Coin",
      input: "radio",
      confirmButtonText: "Confirm",
      inputOptions,
      inputValue: transferCoin,
      inputValidator: (value) => {
        if (!value) {
          return "You need to choose something!";
        } else {
          if (value === 'TON'){
            setTransferCoin("TON");
            startTonGame(isHead);
          } else {
            setTransferCoin("USDT");
            startUsdtGame(isHead);
          }
        }
      }
    });
  }

  return (
    <div>

      <h1 className='title'>Flip Coin</h1>
      <h3 className='desc'>One game costs 0.01 Testnet Ton Coin</h3>

      {
        userFriendlyAddress ?
          (
            <div>

              <div id="coin" className={resultClassName} key={+new Date()}>
                <div className="side-a">
                  <h2>TAIL</h2>
                </div>
                <div className="side-b">
                  <h2>HEAD</h2>
                </div>
              </div>

              <button className='button-left' onClick={() => chooseTransferCoin(true)}>
                <h3>Head</h3>
              </button>

              <button className='button-right' onClick={() => chooseTransferCoin(false)}>
                <h3>Tail</h3>
              </button>

              <div className='ton-button'>
                <TonConnectButton />
              </div>
            </div>
          )
          :
          (
            <div className='ton-button'>
              <TonConnectButton />
            </div>
          )
      }
    </div>
  )
}

export default App
