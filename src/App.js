import React, { Component } from 'react';
import web3 from './web3';
import ipfs from './ipfs';
import storehash from './storehash';
import { Button } from 'reactstrap';
import BetAbi from "./Bet";



class App extends Component {

  state = {      ipfsHash:null,      buffer:'',      ethAddress:'',      transactionHash:'',      txReceipt: ''    };
  //Take file input from user
  captureFile =(event) => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => this.convertToBuffer(reader);
  };

  async loadWeb3() {
      if (window.ethereum) {
          window.web3 = new web3(window.ethereum);
          await window.ethereum.enable();
      } else if (window.web3) {
          window.web3 = new web3(window.web3.currentProvider);
      } else {
          alert("Please install MetaMask!");
      }
  }

  async loadAccount() {
      const web3 = window.web3;
      // Load Account
      const accounts = await web3.eth.getAccounts();
      this.setState({ account: accounts[0] });
      // console.log(this.state.account);
  }

  async loadContract() {
      const web3 = window.web3;
      // Load Meme Smart Contract
      // Use web3.eth.Contract to fetch the contract. It requires the abi and contractAddress as parameters
      // abi and contractAddress can be fetched from the abi json. It is imported as MemeAbi from "../abis/Meme"
      // abi and contractAddress need to be fetched from the correct network where the contract is deployed
      // network id is fetched using web3.eth.net.getId()
      console.log("Fetching smart contract..");
      const networkId = await web3.eth.net.getId();
      const networkData = BetAbi.networks[networkId];
      if (networkData) {
          const abi = BetAbi.abi;
          const contractAddress = networkData.address;
          console.log("Meme Contract address: ", contractAddress);
          const betContract = await web3.eth.Contract(abi, contractAddress);
          console.log("Smart Contract fetched.");
          this.setState({ betContract});
          // console.log(this.state.betContract);
      } else {
          alert("Smart Contract not deployed to the detected network!");
      }
  }

  betFor = event => {
      event.preventDefault();
      const playerEthId = "0x660E69E9379B1e11404999654AC142A091Bc00Ef";
      const betContract = this.state.betContract;
      betContract.methods.betFor(playerEthId, 200).send({ from: this.state.account }, r => {
          console.log("Done");
          this.setState({ playerEthId });
      });
  }

  //Convert the file to buffer to store on IPFS
  convertToBuffer = async(reader) => {      //file is converted to a buffer for upload to IPFS
     const buffer = await Buffer.from(reader.result);      //set this buffer-using es6 syntax
      this.setState({buffer});
    };
  //ES6 async function
  onClick = async () => {try{        this.setState({blockNumber:"waiting.."});        this.setState({gasUsed:"waiting..."});
  await web3.eth.getTransactionReceipt(this.state.transactionHash, (err, txReceipt)=>{          console.log(err,txReceipt);          this.setState({txReceipt});        });      }catch(error){      console.log(error);    }}
  onSubmit = async (event) => {      event.preventDefault();
    //bring in user's metamask account address
  const accounts = await web3.eth.getAccounts();
  const address = '0x0136CacC19E41e9bc090074Dd6B83a84c030a078';    //obtain contract address from storehash.js
  const ethAddress= address;
  this.setState({ethAddress});    //save document to IPFS,return its hash#, and set hash# to state
  await ipfs.add(this.state.buffer, (err, ipfsHash) => {        console.log(err,ipfsHash);
  //setState by setting ipfsHash to ipfsHash[0].hash

  this.setState({ ipfsHash:ipfsHash[0].hash });
  ipfsHash = "0xc499064dd10ef76733047da84d4e2fc9dcb2b9a3903870bd1d0c4fbf40cf125e";
        // call Ethereum contract method "sendHash" and .send IPFS hash to etheruem contract        //return the transaction hash from the ethereum contract
  //storehash.methods.sendHash(ipfsHash).send({          from: accounts[0]        }, (error, transactionHash) => {          console.log(transactionHash);          this.setState({transactionHash});       });
 })    };
render() {
  return (        <div className="App">          <header className="App-header">            <h1>Ethereum and IPFS using Infura</h1>          </header> <hr/><grid>          <h3> Choose file to send to IPFS </h3>          <form onSubmit={this.onSubmit}>            <input              type = "file"              onChange = {this.captureFile}            />             <Button             bsStyle="primary"             type="submit">             Send it             </Button>          </form><hr/> <Button onClick = {this.onClick}> Get Transaction Receipt </Button> <hr/><Button onClick = {this.betFor}> Get Payment </Button> <hr/>  <table bordered responsive>                <thead>                  <tr>                    <th>Tx Receipt Category</th>                    <th> </th>                    <th>Values</th>                  </tr>                </thead> <tbody>                  <tr>                    <td>IPFS Hash stored on Ethereum</td>                    <td> : </td>                    <td>https://gateway.ipfs.io/ipfs/{this.state.ipfsHash}</td>                  </tr>                  <tr>                    <td>Ethereum Contract Address</td>                    <td> : </td>                    <td>{this.state.ethAddress}</td>                  </tr>                  <tr>                    <td>Tx # </td>                    <td> : </td>                    <td>{this.state.transactionHash}</td>                  </tr>                </tbody>            </table>        </grid>     </div>      );    }}

  export default App;
