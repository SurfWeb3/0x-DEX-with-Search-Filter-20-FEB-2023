//For using the api swap input, we set parameters, set token allowance, 
//fetch a swap quote, and sign the transaction.
const BigNumber = require('bignumber.js');
const qs = require('qs');
const web3 = require('web3');

let currentTrade = {};
let currentSelectSide;
let tokens;

//With this function we, can load the big token list from CoinGecko, 
//before the modal with tiken list is used 
//(so the user doesn't need to wait for it).
//ORIGINAL INIT FUNCTION, BEFORE ADDING SEARCH FEATURE
//async function init() {
//    await listAvailableTokens();
//    addSearchFeature();
//}

async function init() {
    await listAvailableTokens();
    addSearchFeature('from_token_search', 'from_token_list', 'from_token_text');
    addSearchFeature('to_token_search', 'to_token_list', 'to_token_text');
  }


  //Update DEXDisplay updates the display of a token when a new selction is made.
  async function updateDEXDisplay() {
    const fromToken = document.getElementById("from_token_text").textContent;
    const toToken = document.getElementById("to_token_text").textContent;
    const swapAmount = document.getElementById("swap_amount").value;
  
    const swapQuote = await getSwapQuote(fromToken, toToken, swapAmount);
    updateExchangeRate(swapQuote);
    updateGasFee(swapQuote);
  }

  //selectToken(token) function updated to work with updateDEXDisplay function  
  function selectToken(token) {
    if (currentSelectSide === "from") {
      currentTrade.fromToken = token;
    } else {
      currentTrade.toToken = token;
    }
    updateDEXDisplay();
  }
  
  
  function updateExchangeRate(swapQuote) {
    const exchangeRate = document.getElementById("exchange_rate");
    exchangeRate.textContent = swapQuote.exchangeRate.toString();
  }
  
  function updateGasFee(swapQuote) {
    const gasFee = document.getElementById("gas_fee");
    gasFee.textContent = swapQuote.gasFee.toString();
  }
  
  
  function addSearchFeature(searchId, listId, textId) {
    // Get the input field and the list element
    const search = document.getElementById(searchId);
    const list = document.getElementById(listId);
    const text = document.getElementById(textId);


  
    // Add event listener to the search input field to filter the options
    search.addEventListener('input', () => {
      // Get the search query
      const query = search.value.toLowerCase();
  
      // Loop through the options and hide those that don't match the search query
      for (let i = 0; i < list.options.length; i++) {
        const option = list.options[i];
        if (option.textContent.toLowerCase().includes(query)) {
          option.style.display = 'block';
        } else {
          option.style.display = 'none';
        }
      }
    });

    // Add event listeners to the options in the list to allow the user to select a token
for (let i = 0; i < list.options.length; i++) {
    const option = list.options[i];
    option.addEventListener('click', () => {
      // Update the token selection field with the selected token
      text.textContent = option.textContent;
      // Clear the search input field
      search.value = '';
      // Hide the list of options
      list.style.display = 'none';
      selectToken(tokens[i]);
    });
  }
  

//THIS IS THE OLDER VERSION, REPLACED BY THE ONE ABOVE
    // Add event listeners to the options in the list to allow the user to select a token
//    for (let i = 0; i < list.options.length; i++) {
//      const option = list.options[i];
//      option.addEventListener('click', () => {
//        // Update the token selection field with the selected token
//        text.textContent = option.textContent;
//        // Clear the search input field
//        search.value = '';
//        // Hide the list of options
//        list.style.display = 'none';
//      });
//    }
//  }
  



async function listAvailableTokens(){
    console.log("initializing");
    let response = await fetch('https://tokens.coingecko.com/uniswap/all.json');
    let tokenListJSON = await response.json();
    console.log("listing available tokens: ", tokenListJSON);
    tokens = tokenListJSON.tokens;
    console.log("tokens: ", tokens);

//ALTERNATIVE PLACE TO INSERT TOKEN SEARCH FEATURE





    // Create token list for modal
    let parent = document.getElementById("token_list");
    for (const i in tokens){
        // Token row in the modal token list
        let div = document.createElement("div");
        div.className = "token_row";
        let html = `
        <img class="token_list_img" src="${tokens[i].logoURI}">
          <span class="token_list_text">${tokens[i].symbol}</span>
          `;
        div.innerHTML = html;
        div.onclick = () => {
            selectToken(tokens[i]);
        };
        parent.appendChild(div);
    };
}

//ORIGINAL selectToken FUNCTION, REPLACED BY selectTRoken THAT
//WORKS WITH THE UPDATE FEATURE (WHEN ANOTHER TOKEN IS SELECTED)
//async function selectToken(token){
//    closeModal();
//    currentTrade[currentSelectSide] = token;
//    console.log("currentTrade: ", currentTrade);
//    renderInterface();
//}

function renderInterface(){
    if (currentTrade.from){
        console.log(currentTrade.from)
        document.getElementById("from_token_img").src = currentTrade.from.logoURI;
        document.getElementById("from_token_text").innerHTML = currentTrade.from.symbol;
    }
    if (currentTrade.to){
        console.log(currentTrade.to)
        document.getElementById("to_token_img").src = currentTrade.to.logoURI;
        document.getElementById("to_token_text").innerHTML = currentTrade.to.symbol;
    }
}

//This part is connected to the log-in button.
//First we want to check if window.ethereum is defined.
//window.ethereum is an object. 
//When MetaMask is installed, it puts the window.ethereum object into your browser,
//and we can use it to check if MetaMawsk is connected.
//If window.ethereum is defined, then were gonna we will use this method eth_requestAccounts
//to prompt connecting to the MetaMask account.
//eth_requestAccounts returns an array with an Ethereum address string.
//You should only request a user account in response to user action, for example a buttin click.
async function connect() {
    if (typeof window.ethereum !== "undefined") {
      //The try-catch instructions are for error handling.
        try {
            console.log("connecting");
            await ethereum.request({ method: "eth_requestAccounts" });
        } catch (error) {
            console.log(error);
        }
        //When the user's MetaMask is connected, the button shows that it is connected.
        document.getElementById("login_button").innerHTML = "Connected";
        // const accounts = await ethereum.request({ method: "eth_accounts" });
        document.getElementById("swap_button").disabled = false;
    } else {
        document.getElementById("login_button").innerHTML = "Please install MetaMask";
    }
}

//This function makes the modal appear.
function openModal(side){
    currentSelectSide = side;
    document.getElementById("token_modal").style.display = "block";
}
//This function get rid of the modal, 
//when the user clicks on the x in the upper right corner of the wondow.
function closeModal(){
    document.getElementById("token_modal").style.display = "none";
}
//
async function getPrice(){
    console.log("Getting Price");
  
    if (!currentTrade.from || !currentTrade.to || !document.getElementById("from_amount").value) return;
    let amount = Number(document.getElementById("from_amount").value * 10 ** currentTrade.from.decimals);

    
//parameters for token to buy, token to sell, with token address, and sell amount    
    const params = {
        sellToken: currentTrade.from.address,
        buyToken: currentTrade.to.address,
        sellAmount: amount,
    }
  
    // Fetch the swap price.
    const response = await fetch(`https://api.0x.org/swap/v1/price?${qs.stringify(params)}`);
    
    swapPriceJSON = await response.json();
    console.log("Price: ", swapPriceJSON);
    
    document.getElementById("to_amount").value = swapPriceJSON.buyAmount / (10 ** currentTrade.to.decimals);
    document.getElementById("gas_estimate").innerHTML = swapPriceJSON.estimatedGas;
}

async function getQuote(account){
    console.log("Getting Quote");
  
    if (!currentTrade.from || !currentTrade.to || !document.getElementById("from_amount").value) return;
    let amount = Number(document.getElementById("from_amount").value * 10 ** currentTrade.from.decimals);
  
    const params = {
        sellToken: currentTrade.from.address,
        buyToken: currentTrade.to.address,
        sellAmount: amount,
        takerAddress: account,
    }
  
    // Fetch the swap quote.
    //This uses an http URL, and the parameters (that we set above) are added.
    //in video "https .. v1/quote" is "htpps ... v1/price".
    const response = await fetch(`https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`);
    
    swapQuoteJSON = await response.json();
    console.log("Quote: ", swapQuoteJSON);
    
    document.getElementById("to_amount").value = swapQuoteJSON.buyAmount / (10 ** currentTrade.to.decimals);
    document.getElementById("gas_estimate").innerHTML = swapQuoteJSON.estimatedGas;
  
    return swapQuoteJSON;
}

async function trySwap(){
    const erc20abi= [{ "inputs": [ { "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }, { "internalType": "uint256", "name": "max_supply", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burnFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" } ], "name": "decreaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" } ], "name": "increaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }]
    console.log("trying swap");
  
    // Only work if MetaMask is connect
    // Connecting to Ethereum: Metamask
    const web3 = new Web3(Web3.givenProvider);
  
    // The address, if any, of the most recently used account that the caller is permitted to access
    let accounts = await ethereum.request({ method: "eth_accounts" });
    let takerAddress = accounts[0];
    console.log("takerAddress: ", takerAddress);
  
    const swapQuoteJSON = await getQuote(takerAddress);
  
    // Set Token Allowance, which allows a third party to move crypto for you,
    // and you give a particular amount of crypto that can be moved in the transaction
    // Set approval amount
    const fromTokenAddress = currentTrade.from.address;
    const maxApproval = new BigNumber(2).pow(256).minus(1);
    console.log("approval amount: ", maxApproval);
    const ERC20TokenContract = new web3.eth.Contract(erc20abi, fromTokenAddress);
    console.log("setup ERC20TokenContract: ", ERC20TokenContract);
  
    // Grant the allowance target an allowance to spend our tokens.
    const tx = await ERC20TokenContract.methods.approve(
        swapQuoteJSON.allowanceTarget,
        maxApproval,
    )
    .send({ from: takerAddress })
    .then(tx => {
        console.log("tx: ", tx)
    });

    // Perform the swap
    //We sign that transaction response, using the Web 3 library.
    //Here we use the web3.js library, but we can also use ethers.js
    const receipt = await web3.eth.sendTransaction(swapQuoteJSON);
    console.log("receipt: ", receipt);
}

init();

//When this is clicked, the connect function is called.
document.getElementById("login_button").onclick = connect;
document.getElementById("from_token_select").onclick = () => {
    openModal("from");
};
document.getElementById("to_token_select").onclick = () => {
    openModal("to");
};
document.getElementById("modal_close").onclick = closeModal;
document.getElementById("from_amount").onblur = getPrice;
document.getElementById("swap_button").onclick = trySwap;