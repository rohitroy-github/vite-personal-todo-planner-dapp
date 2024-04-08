<h2>Personal Todo Planner (EVM Based)</h2>

<b>This is a decentralized day-to-day personal todo planning application made using ViteJS and deployed completely on-chain.</b>

Currently, the app is working on localhost using <b>Sepolia</b> test network and Alchemy endpoint.

<h3><b>Snapshots from the project :</b></h3>

<img src="https://github.com/rohitroy-github/vite-personal-todo-planner-dapp/assets/68563695/04f556e2-505c-4d25-b278-ed1c56960803" width="750">

<h3><b>Tech Stack :</b></h3>

<b>Frontend :</b>

<ul>
    <li>Vite JS</li>
    <li>Tailwind CSS</li>
</ul>

<b>Backend :</b>

<ul>
    <li>Node JS</li>
    <li>Hardhat Development Environment</li>
    <li>Metamask Wallet</li>
    <li>Ethers JS</li>
    <li>Alchemy</li>
</ul>

<h3><b>Guide for testing on local hardhat network :</b></h3>

<b>Environment variables :</b>

Create a new .env file inside [blockchain-hardhat] folder taking reference from .env.example file inside the same.

<b>Backend :</b>

Terminal 1:

<ul>
    <li>Run (Running Hardhat node locally) : <b>npx hardhat node</b></li>
</ul>

Terminal 2:

<ul>
    <li>Run (Running tests) : <b>npx hardhat test</b></li>
    <li>Run (Running deployment script) : <b>npx hardhat run scripts/deploy[Todo_Contract_Main].js --network localhost</b></li>
</ul>

<b>Frontend :</b>

Terminal 1:

<ul>
    <li>Run (Running frontend on browser): <b>npm run dev</b></li>
</ul>

The project is complete but I'm making constant modifications to the project.
