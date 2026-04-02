<h1>Personal Todo Planner (EVM Based)</h1>

<p><b>A decentralized, on-chain todo management application built with Vite, React, and Solidity.</b></p>

<p>This project demonstrates a complete Web3 stack implementation, featuring a smart contract backend for persistent task storage and a responsive frontend for managing daily todos. Each user's todos are stored securely on the blockchain, ensuring data ownership and transparency.</p>

<p><b>Currently supports:</b> Sepolia Testnet (and configurable for localhost testing via Hardhat)</p>

<h3><b>Snapshots from the project :</b></h3>

<img src="https://github.com/rohitroy-github/vite-personal-todo-planner-dapp/assets/68563695/04f556e2-505c-4d25-b278-ed1c56960803" width="750">

<h3><b>Features :</b></h3>

<ul>
    <li><b>Decentralized Storage:</b> All todos are stored on-chain in a Solidity smart contract</li>
    <li><b>User-Specific Data:</b> Each wallet address maintains its own independent todo list</li>
    <li><b>Full CRUD Operations:</b> Create, read, update, and delete todos with blockchain transactions</li>
    <li><b>Completion Tracking:</b> Mark todos as complete with immutable status tracking</li>
    <li><b>Metamask Integration:</b> Seamless wallet connection and transaction signing</li>
    <li><b>Real-Time Updates:</b> Instant reflection of blockchain state changes in the UI</li>
    <li><b>Responsive Design:</b> Mobile-friendly interface with Tailwind CSS</li>
</ul>

<h3><b>Tech Stack :</b></h3>

<b>Frontend :</b>

<ul>
    <li><b>Vite JS</b> - Lightning-fast build tool and dev server</li>
    <li><b>React 18</b> - Component-based UI framework</li>
    <li><b>Tailwind CSS</b> - Utility-first CSS framework for responsive design</li>
    <li><b>Ethers.js</b> - Lightweight Ethereum library for wallet interaction and contract calls</li>
</ul>

<b>Backend/Blockchain :</b>

<ul>
    <li><b>Solidity ^0.8.20</b> - Smart contract programming language</li>
    <li><b>Hardhat</b> - Ethereum development environment with testing and deployment tools</li>
    <li><b>Node JS</b> - JavaScript runtime for backend scripts and deployment</li>
    <li><b>Metamask</b> - Browser wallet for secure transaction signing</li>
    <li><b>Alchemy</b> - RPC endpoint provider for blockchain interaction</li>
    <li><b>Sepolia Testnet</b> - EVM-compatible test network for deployment and testing</li>
</ul>

<h3><b>Prerequisites :</b></h3>

<ul>
    <li>Node.js v16 or higher</li>
    <li>npm or yarn package manager</li>
    <li>MetaMask wallet extension installed in your browser</li>
    <li>Some Sepolia ETH test tokens (get from <a href="https://www.alchemy.com/faucets/sepolia">Alchemy Sepolia Faucet</a>)</li>
</ul>

<h3><b>Project Setup :</b></h3>

<b>Step 1: Clone and Install Dependencies</b>

<pre>
git clone https://github.com/rohitroy-github/vite-personal-todo-planner-dapp.git
cd vite-personal-todo-planner-dapp

# Install backend dependencies
cd blockchain-hardhat
npm install

# Install frontend dependencies (from root directory)
cd ../frontend-vite
npm install
</pre>

<b>Step 2: Environment Configuration</b>

Inside the <b>blockchain-hardhat</b> folder, create a <b>.env</b> file. Use the template from <b>.env.example</b>:

<pre>
ALCHEMY_API_KEY=your_alchemy_api_key_here
PRIVATE_KEY=your_metamask_private_key_here
</pre>

<h3><b>Guide for Testing on Local Hardhat Network :</b></h3>

<b>Terminal 1 - Start Local Hardhat Node:</b>

<pre>
cd blockchain-hardhat
npx hardhat node
</pre>

This will start a local Ethereum node at <b>http://localhost:8545</b> with pre-funded test accounts.

<b>Terminal 2 - Deploy Smart Contract:</b>

<pre>
cd blockchain-hardhat
npx hardhat run scripts/deploy[Todo_Contract_Main].js --network localhost
</pre>

Copy the deployed contract address from the output.

<b>Terminal 2 - Run Tests (Optional):</b>

<pre>
npx hardhat test
</pre>

<b>Update Configuration:</b>

After deployment, update <b>frontend-vite/src/backend-config.json</b> with the contract address under the <b>"31337"</b> network:

<pre>
{
  "31337": {
    "contract": {
      "address": "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    }
  }
}
</pre>

<b>Terminal 3 - Start Frontend Development Server:</b>

<pre>
cd frontend-vite
npm run dev
</pre>

Open your browser to <b>http://localhost:5173</b> and connect your MetaMask wallet to the localhost network.

<h3><b>Deploying to Sepolia Testnet :</b></h3>

<b>1. Update .env file in blockchain-hardhat:</b>

Ensure your Alchemy API key and Sepolia-funded wallet private key are configured.

<b>2. Deploy contract to Sepolia:</b>

<pre>
cd blockchain-hardhat
npx hardhat run scripts/deploy[Todo_Contract_Main].js --network sepolia
</pre>

<b>3. Update backend-config.json:</b>

Add the Sepolia deployment address under the <b>"11155111"</b> network (already configured in the file).

<b>4. Configure MetaMask:</b>

<ul>
    <li>Switch MetaMask network to Sepolia</li>
    <li>Ensure your wallet has Sepolia ETH for gas fees</li>
</ul>

<b>5. Run frontend:</b>

<pre>
cd frontend-vite
npm run dev
</pre>

<h3><b>Smart Contract Overview :</b></h3>

The <b>Todo_Contract_Main</b> smart contract provides the following functions:

<ul>
    <li><b>addNewTodo(string _text)</b> - Create a new todo item</li>
    <li><b>updateTodoText(uint _index, string _newText)</b> - Update existing todo text</li>
    <li><b>markTodoAsCompleted(uint _index)</b> - Mark a todo as completed (immutable)</li>
    <li><b>deleteTodo(uint _index)</b> - Remove a todo from the list</li>
    <li><b>viewTodos()</b> - Retrieve all todos for the connected wallet (read-only, no gas cost)</li>
</ul>

Each wallet address maintains its own independent todo list stored in the <b>todosByOwner</b> mapping, ensuring data privacy and ownership.

<h3><b>Available Scripts :</b></h3>

<b>Frontend:</b>

<pre>
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
</pre>

<b>Backend:</b>

<pre>
npx hardhat node                                                     # Start local Hardhat network
npx hardhat test                                                     # Run contract tests
npx hardhat run scripts/deploy[Todo_Contract_Main].js --network localhost  # Deploy to localhost
npx hardhat run scripts/deploy[Todo_Contract_Main].js --network sepolia    # Deploy to Sepolia
</pre>

<h3><b>Project Status :</b></h3>

✅ Core functionality complete  
✅ Smart contract deployed and tested  
✅ Frontend UI fully functional  
✅ Multi-network support (localhost & Sepolia)  
🚀 Ready for further enhancements and scaling

The project remains under active development with continuous improvements and optimizations.

<br>

⭐ <b>If you find this project helpful, please consider giving it a star!</b>
