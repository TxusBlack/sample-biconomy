// import './App.css';
import React, { useState, useEffect } from "react";
import { ethers } from 'ethers';

//LA LINEA DE CODIGO 7 ES LA QUE GENERA LOS PROBLEMAS///.
import { Biconomy } from '@biconomy/mexa';

function App()
{
  ////////////////////////////////////////////////////////////////////////////////////////
  //"stateVariables"//////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  const [userAddress, setUserAddress] = useState("noAddress");
  const [signer, setSigner] = useState(null);
  const [quote, setQuote] = useState("noQuote");
  const [trustedForwarder, setTrustedForwarder] = useState("noTrustedForwarder");
  //"inputValues stateVariables"///
  const [normalQuoteInputValue, setNormalQuoteInputValue] = useState('');
  const [metaQuoteInputValue, setMetaQuoteInputValue] = useState('');
  let provider;


  useEffect(() => {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    getScData()
  }, [getScData]);


  ////////////////////////////////////////////////////////////////////////////////////////
  //"ethersJs setUp"//////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  const tricketSmartContractAddress = "0x753c38D5ebFe0a07ED5b51467CF236700d99E459";
  const tricketSmartContractFullAbi =
    [
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "paramNewMetaQuote",
            "type": "string"
          }
        ],
        "name": "changeMetaQuote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "paramNewQuote",
            "type": "string"
          }
        ],
        "name": "changeQuote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "paramTrustedForwarder",
            "type": "address"
          }
        ],
        "name": "provisionalSetTrustedForwarder",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "string",
            "name": "msg",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "newQuote",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "quoteChangerAddress",
            "type": "address"
          }
        ],
        "name": "setQuote",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "getTrustedForwarder",
        "outputs": [
          {
            "internalType": "address",
            "name": "forwarder",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "forwarder",
            "type": "address"
          }
        ],
        "name": "isTrustedForwarder",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "quote",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "versionRecipient",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "pure",
        "type": "function"
      }
    ]

  //"Instance to intercat with the tricketSmartContract"///
  const tricketSmartContractInstance = new ethers.Contract(tricketSmartContractAddress, tricketSmartContractFullAbi, provider);





  ////////////////////////////////////////////////////////////////////////////////////////
  //"biconomyMetaTx setUp"////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////





  ////////////////////////////////////////////////////////////////////////////////////////
  //"jsFunctions"/////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  async function getScData()
  {
    let _quote = await tricketSmartContractInstance.quote();
    setQuote(_quote);

    let _trustedForwarder = await tricketSmartContractInstance.getTrustedForwarder();
    setTrustedForwarder(_trustedForwarder);
  }

  async function requestAccount() 
  {
    console.log("Este es un log de console.");

    if (window.ethereum) 
    {
      console.log("Si esta insatalado.");

      try 
      {
        let accounts = await window.ethereum.request({ method: "eth_requestAccounts",});

        const _signer = provider.getSigner();

        setUserAddress(accounts[0]);
        setSigner(_signer);
        console.log(accounts);
      }
      catch (error) 
      {
        console.log("ERROR ACCOUNTS.");
      }
    }
    else 
    {
      console.log("no esta instalado.");
    }
  }

  async function callChangeNormalQuote(paramNewNormalQuote)
  {
    console.log("This is a log from the changeNormalQuoteFunction.");
    console.log(paramNewNormalQuote);
    
    const changeNormalQuoteTx = await tricketSmartContractInstance.connect(signer).changeQuote(paramNewNormalQuote);
    const changeNormalQuoteReceipt = await changeNormalQuoteTx.wait();
    
    window.location.reload();
  }

  async function callChangeMetaQuote(paramNewMetaQuote)
  {
    console.log("This is a quote from the changeMetaQuoteFunction.");
  }





  ////////////////////////////////////////////////////////////////////////////////////////
  //"Call/Initialize functions and data"//////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  // getScData();





  return (
    <div>
      {/*tricketAppText and connectMetamaskButton*/}
      <div>
        TRICKET APP

        <a style={{ marginLeft: '16rem' }}>
          <button type="button" onClick={requestAccount}>
            connectMetamask
          </button>
        </a>
      </div>

      {/*signerAddressValueDisplay (below metamaskButton)*/}
      <div>
        <a style={{ marginLeft: '23rem' }}>
          Address: {userAddress}
        </a>
      </div>

      <div>
        -
      </div>

      {/*quoteValueDisplay*/}
      <div>
        <a style={{ marginLeft: '11rem' }}>
          Quote: {quote}
        </a>
      </div>

      <div>
        -
      </div>

      {/*normalAndMetaQuoteFields*/}
      <div>
        {/*normalQuoteInputAndButton*/}
        <div>
          <a style={{ marginLeft: '1rem' }}>
            writeNewNormalQuote:
            <input name="normalQuote" onChange={event => setNormalQuoteInputValue(event.target.value)}/>
            <button type="button" onClick={() => callChangeNormalQuote(normalQuoteInputValue)}>setNewNormalQuote</button>
          </a>
        </div>

        {/*metaQuoteInputAndButton*/}
        <div>
          <a style={{ marginLeft: '2rem' }}>
            writeNewMetaQuote:
            <input name="metaQuote" onChange={event => setMetaQuoteInputValue(event.target.value)}/>
            <button type="button" onClick={() => callChangeMetaQuote(metaQuoteInputValue)}>setNewMetaQuote</button>
          </a>
        </div>
      </div>

      <div>
        -
      </div>
      <div>
        -
      </div>

      {/*trustedForwarderValueDisplay*/}
      <div>
        <a style={{ marginLeft: '1rem' }}>
          Trusted Forwarder: {trustedForwarder}
        </a>
      </div>
    </div>
  );
}

export default App;
