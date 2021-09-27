"use strict";

/**
 * Example JavaScript code that interacts with the page and Web3 wallets
 */
document.querySelector('#goodbye').style.display = 'none';
// Unpkg imports
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;
const evmChains = window.evmChains;

// Web3modal instance
let web3Modal

// Chosen wallet provider given by the dialog window
let provider;


// Address of the selected account
let selectedAccount;


// Get contrract and ABI and address
let contractaddress = '0xE26FaB0FFA0748F88942567BCFE09E94199825A7';
// let contractaddress2 = '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82';
let abi = [{
            "anonymous": false,
            "inputs": [{
                    "indexed": true,
                    "internalType": "address",
                    "name": "previousOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [{
                    "indexed": true,
                    "internalType": "address",
                    "name": "purchaser",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "beneficiary",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "TokenPurchase",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "allowcollection",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{
                "internalType": "address",
                "name": "_beneficiary",
                "type": "address"
            }],
            "name": "buyTokens",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [{
                "internalType": "address",
                "name": "beneficiary",
                "type": "address"
            }],
            "name": "claimTokens",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "renounceOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{
                    "internalType": "uint256",
                    "name": "_contractBalance",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "addressToQuery",
                    "type": "address"
                }
            ],
            "name": "sendTokensBack",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{
                "internalType": "contract BEP20",
                "name": "contAdd",
                "type": "address"
            }],
            "name": "setRealContractAddress",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "stateMutability": "payable",
            "type": "receive"
        },
        {
            "stateMutability": "payable",
            "type": "fallback"
        },
        {
            "inputs": [{
                    "internalType": "uint256",
                    "name": "_rate",
                    "type": "uint256"
                },
                {
                    "internalType": "address payable",
                    "name": "_wallet",
                    "type": "address"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [],
            "name": "canClaim",
            "outputs": [{
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [{
                "internalType": "address",
                "name": "",
                "type": "address"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "presaletoken",
            "outputs": [{
                "internalType": "contract PRESALETOKEN",
                "name": "",
                "type": "address"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{
                    "internalType": "address",
                    "name": "_tokenAddress",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_addressToQuery",
                    "type": "address"
                }
            ],
            "name": "queryERC20Balance",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "rate",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "realtoken",
            "outputs": [{
                "internalType": "contract BEP20",
                "name": "",
                "type": "address"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "totalAmountAvailable",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "totalsold",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "wallet",
            "outputs": [{
                "internalType": "address payable",
                "name": "",
                "type": "address"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "weiRaised",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        }
    ]
    //console.log(contract);
console.log(abi);




/**
 * Setup the orchestra
 */
function init() {

    console.log("Initializing example");
    console.log("WalletConnectProvider is", WalletConnectProvider);
    console.log("Fortmatic is", Fortmatic);
    console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);

    // Check that the web page is run in a secure context,
    // // as otherwise MetaMask won't be available
    // if(location.protocol !== 'https:') {
    //   // https://ethereum.stackexchange.com/a/62217/620
    //   const alert = document.querySelector("#alert-error-https");
    //   alert.style.display = "block";
    //   document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
    //   return;
    // }

    // Tell Web3modal what providers we have available.
    // Built-in web browser provider (only one can exist as a time)
    // like MetaMask, Brave or Opera is added automatically by Web3modal
    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                // Mikko's test key - don't copy as your mileage may vary
                infuraId: "8043bb2cf99347b1bfadfb233c5325c0",
            }
        },

        fortmatic: {
            package: Fortmatic,
            options: {
                // Mikko's TESTNET api key
                key: "pk_test_391E26A3B43A3350"
            }
        },

    };

    web3Modal = new Web3Modal({
        cacheProvider: false, // optional
        providerOptions, // required
        disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
        theme: 'dark',
    });

    console.log("Web3Modal instance is", web3Modal);
}
const inserted = document.getElementById('myInputValue')
inserted.addEventListener('input', function(event) {
        let converted = event.target.value
        let answer = document.getElementById('ask')
        let derivative = document.getElementById('converted')
        document.getElementById('rwm').innerHTML = converted * 400000000000 + " Holdn1 Tokens"
        document.getElementById('bbnb').innerHTML = converted + " BNB"
        derivative.innerHTML = "you will get " + converted * 400000000000 + " Holdn1 tokens"
        document.getElementById('ans').innerHTML = converted * 400000000000


    })
    /**
     * Kick in the UI action after Web3modal dialog has chosen a provider
     */
async function fetchAccountData() {

    // Get a Web3 instance for the wallet
    const web3 = new Web3(provider);

    console.log("Web3 instance is", web3);

    // Get connected chain id from Ethereum node
    const chainId = await web3.eth.getChainId();
    // Load chain information over an HTTP API

    const chainData = evmChains.getChain(chainId);
    document.querySelector("#network-name").textContent = chainData.name;
    // Get list of accounts of the connected wallet
    const accounts = await web3.eth.getAccounts();
    // MetaMask does not give you all accounts, only the selected account
    console.log("Got accounts", accounts);
    selectedAccount = accounts[0];
    document.querySelector("#selected-account").textContent = selectedAccount;
    document.getElementById('wallet-add').innerHTML = selectedAccount;
    document.getElementById('con').style.display = "none";
    document.getElementById('success').style.display = "block";
    document.getElementById("connected").style.display = "block";
    // Get a handl
    // Purge UI elements any previously loaded accounts
    //accountContainer.innerHTML = '';
    // Go through all accounts and get their ETH balance
    const rowResolvers = accounts.map(async(address) => {
        //GET Ethereum/BNB  Balance
        const balance = await web3.eth.getBalance(address);
        //CWJ TOKEN 

        const contract = new web3.eth.Contract(abi, contractaddress);
        //Cake Token
        //const contract2 = new web3.eth.Contract(abi,contractaddress2);



        // ethBalance is a BigNumber instance  convert to humanreadable
        // https://github.com/indutny/bn.js/
        const ethBalance = web3.utils.fromWei(balance, "ether");
        const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
        document.getElementById("acc").innerHTML = humanFriendlyBalance + " BNB";


        var modallink = document.getElementById("myModal");
        document.getElementById("buy").addEventListener('click', buyToken);
        async function buyToken() {

            var fund = document.getElementById('myInputValue').value;
            console.log(fund);
            console.log("clicked");
            console.log(fund);
            let bnb = web3.utils.toWei("0.00001");
            console.log("sending Transaction");
            await contract.methods.buyTokens(selectedAccount).send({ value: web3.utils.toWei(fund), from: accounts[0] })
            modallink.style.display = "none";
            var modall = document.getElementById('pay-review');
            modall.style.display = "block";

        }
        // document.getElementById("unstakeButton").addEventListener('click', unstake);
        // async function unstake() {
        //     const unstakeAmountWei = document.getElementById('unstakeAmount').value;
        //     const unhexStake = web3.utils.toWei(unstakeAmountWei);



        //     // UnStake
        //     await contract.methods.unstake(unhexStake).send({ from: accounts[0] })
        //         .then((txHash) => console.log(txHash))
        //         .catch((error) => console.error);
        //     document.getElementById('unstakeAmount').value = '';

        // }

        //Withdraw
        // document.getElementById("collect").addEventListener('click', collect);
        // // async function collect() {
        //     await contract.methods.collect().send({ from: accounts[0] })
        //         .then((txHash) => console.log(txHash))
        //         .catch((error) => console.error);

        // }





    });




    // Because rendering account does its own RPC commucation
    // with Ethereum node, we do not want to display any results
    // until data for all accounts is loaded
    await Promise.all(rowResolvers);

    // Display fully loaded UI for wallet data
    document.querySelector("#prepare").style.display = "none";
    document.querySelector("#connected").style.display = "block";


}



/**
 * Fetch account data for UI when
 * - User switches accounts in wallet
 * - User switches networks in wallet
 * - User connects wallet initially
 */
async function refreshAccountData() {

    // If any current data is displayed when
    // the user is switching acounts in the wallet
    // immediate hide this data
    document.querySelector("#connected").style.display = "none";
    document.querySelector("#prepare").style.display = "none";
    //document.querySelector("#hide").style.display = "none";
    //Hide Splash screen
    document.querySelector('#goodbye').style.display = 'none';
    document.querySelector('#welcome').style.display = 'none'
        // Disable button while UI is loading.
        // fetchAccountData() will take a while as it communicates
        // with Ethereum node via JSON-RPC and loads chain data
        // over an API call.
    document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
    await fetchAccountData(provider);
    document.querySelector("#btn-connect").removeAttribute("disabled")
}


/**
 * Connect wallet button pressed.
 */
async function onConnect() {

    console.log("Opening a dialog", web3Modal);
    try {
        provider = await web3Modal.connect();
    } catch (e) {
        console.log("Could not get a wallet connection", e);
        return;
    }


    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts) => {
        fetchAccountData();
    });

    // Subscribe to chainId change
    provider.on("chainChanged", (chainId) => {
        fetchAccountData();
    });

    // Subscribe to networkId change
    provider.on("networkChanged", (networkId) => {
        fetchAccountData();
    });




    await refreshAccountData();
}

/**
 * Disconnect wallet button pressed.
 */
async function onDisconnect() {

    console.log("Killing the wallet connection", provider);
    document.getElementById("btn-connect").style.display = 'block';
    // TODO: Which providers have close method?
    if (provider.close) {
        await provider.close();

        // If the cached provider is not cleared,
        // WalletConnect will default to the existing session
        // and does not allow to re-scan the QR code with a new wallet.
        // Depending on your use case you may want or want not his behavir.
        await web3Modal.clearCachedProvider();
        provider = null;
    }

    selectedAccount = null;

    // Set the UI back to the initial state
    document.querySelector("#prepare").style.display = "block";
    document.querySelector("#connected").style.display = "none";
    document.querySelector('#welcome').style.display = 'none';
    document.querySelector('#goodbye').style.display = 'block'
}


/**
 * Main entry point.
 */
window.addEventListener('load', async() => {
    init();
    document.querySelector("#btn-connect").addEventListener("click", onConnect);
    document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);

});




// addToken.addEventListener('click', () => {
//     ethereum.request({
//         method: 'wallet_watchAsset',
//         params: {
//             type: 'ERC20',
//             options: {
//                 address: '0x49AD5Ae0b902360029b222CB6516521afA8e1141',
//                 symbol: 'CWJ',
//                 decimals: 18,
//                 image: 'https://token.codewithjoe.net/logo.png',
//             },
//         },
//     });
// });