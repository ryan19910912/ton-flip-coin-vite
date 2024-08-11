import { useState } from 'react'
import './App.css';
import { TonConnectButton, useTonAddress, useTonConnectUI, CHAIN } from '@tonconnect/ui-react';
import { transfer2User } from './api/ton_api';
import Swal from 'sweetalert2'

function App() {
  const [resultClassName, setResultClassName] = useState('heads');
  const userFriendlyAddress = useTonAddress();
  const [tonConnectUI, setOptions] = useTonConnectUI();

  function startGame(isHead) {

    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
      // network: "https://testnet.toncenter.com/api/v2/jsonRPC",
      messages: [
        {
          address: `${import.meta.env.VITE_WALLET_ADDRESS}`,
          network: CHAIN.TESTNET,
          amount: "10000000",
          payload: "Flip Coin Game"
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
            transfer2User(userFriendlyAddress);
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

  return (
    <div>
      {/* <img src="https://turquoise-smiling-halibut-906.mypinata.cloud/ipfs/QmNtf5zbi6CuhVaGZcUf5NUTw8TXZKtU2nh5duxGhYigHM"
        width="100%%" height="100%"></img> */}

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

              <button className='button-left' onClick={() => startGame(true)}>
                <h3>Head</h3>
              </button>

              <button className='button-right' onClick={() => startGame(false)}>
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
