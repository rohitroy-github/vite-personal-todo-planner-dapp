import React, {useState, useEffect} from "react";
import {ethers} from "ethers";
// import "./style.css";
import {abi} from "../../blockchain-hardhat/artifacts/contracts/Todo_Contract.sol/Todo_Contract.json";

import config from "./backend-config.json";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");

  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const fetchContractDetails = async () => {
      try {
        const getProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(getProvider);

        const connectedNetwork = await getProvider.getNetwork();
        const getContractAddress =
          config[connectedNetwork.chainId].contract.address;

        const getSigner = getProvider.getSigner();
        const getContract = new ethers.Contract(
          getContractAddress,
          abi,
          getSigner
        );
        setContract(getContract);
      } catch (error) {
        console.error(error);
      }
    };

    fetchContractDetails();
  }, []);

  //  function : handleAnyChangeAnyInputFeild
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setEditText(event.target.value);
  };

  // function : addANewTodo
  const handleAddTodo = async () => {
    if (!isWalletConnected) {
      alert("Please connect your Metamask wallet to proceed :)");
      return;
    }

    if (inputValue === "") {
      alert("Please enter a valid todo item :)");
      return;
    }

    try {
      if (editIndex !== null) {
        handleUpdateTodo(editIndex, inputValue);
      } else {
        // Send transaction to add new todo
        const TX = await contract.addNewTodo(inputValue);
        await TX.wait();

        // console.log("Todo created successfully :)");

        updateTodoStates();

        setInputValue("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // fucntion : deleteATodo
  const handleDeleteTodo = async (index) => {
    try {
      // Call the deleteTodo function on the contract
      const TX = await contract.deleteTodo(index);
      await TX.wait();

      // console.log("Todo deleted successfully :)");

      updateTodoStates();
    } catch (error) {
      console.error(error);
    }
  };

  // function : toMarkTodoAsComplete
  const handleCompleteTodo = async (index) => {
    try {
      // checkIfTodoIsAlreadyMarkedAsFinished?
      if (todos[index].isCompleted) {
        alert(
          "This todo is already marked as finished, you can delete it if you want :)"
        );
        return;
      }

      // Check if MetaMask is installed
      if (typeof window.ethereum === "undefined") {
        alert("Please connect your Metamask wallet to proceed :)");
        return;
      }

      // Call the markTodoAsCompleted function in the contract
      const TX = await contract.markTodoAsCompleted(index);
      await TX.wait();

      // console.log("Todo marked as finished :)");

      updateTodoStates();
    } catch (error) {
      console.error(error);
    }
  };

  // function : toConnectToMetamaskWallet
  const connectMetamask = async () => {
    // Check if MetaMask is installed
    if (typeof window.ethereum === "undefined") {
      alert("Please connect your Metamask wallet to proceed :)");
      return;
    }

    try {
      // Connect to Ethereum network
      let signer = provider.getSigner();
      // MetaMask requires requesting permission to connect users accounts
      await provider.send("eth_requestAccounts", []);

      // Get signer address
      const address = await signer.getAddress();

      // stateUpdation
      setIsWalletConnected(true);

      updateTodoStates();
    } catch (error) {
      console.error(error);
    }
  };

  // function : toEditATodo
  const handleEditTodo = (index) => {
    const todo = todos[index];

    setEditIndex(index);
    setEditText(todo.text);
    setInputValue(todo.text);
  };

  // function : toEditATodo
  const handleUpdateTodo = async (index, newText = "") => {
    try {
      // Check if wallet is connected
      if (!isWalletConnected) {
        alert("Please connect your Metamask wallet to proceed :)");
        return;
      }

      if (editText === todos[editIndex].text) {
        alert("Please update the todo text to continue !");
        return;
      }

      // Send the transaction to update the todo text
      const TX = await contract.updateTodoText(index, newText);
      await TX.wait();

      // console.log("Todo updated successfully :)");

      // updateStates
      updateTodoStates();

      // resetEditingStates
      setEditIndex(null);
      setEditText("");
      setInputValue("");
    } catch (error) {
      console.error(error);
    }
  };

  // function : toSyncTodoListWithTheOneAvailableOnTheChain
  const updateTodoStates = async () => {
    try {
      // Update the list of todos by calling the viewTodos function on the contract
      const [todoTexts, todoCompleted] = await contract.viewTodos();

      const newTodos = todoTexts.map((text, i) => ({
        text,
        isCompleted: todoCompleted[i],
      }));

      // Set the newTodos state after the todo is deleted
      setTodos(newTodos);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col w-full md:w-[50%] items-center">
          <div className="pb-2 md:pb-1">
            <p className="md:text-3xl text-xl font-montserrat text-center text-white">
              Personal Todo Manager
            </p>
          </div>
          <div className="pb-5 md:pb-5">
            <p className="md:text-sm text-xs font-montserrat text-center text-white">
              Plan your todos with simplicity.
            </p>
          </div>

          <div className="md:w-2/5 text-sm md:text-base pb-5">
            <button
              type="button"
              className="bg-blue-500 text-white py-2 px-4 rounded-md w-full font-montserrat"
              onClick={connectMetamask}
            >
              {isWalletConnected ? "Wallet Connected" : "Connect Wallet"}
            </button>
          </div>

          <div className="md:pb-10 pb-5 flex gap-3 flex-col md:flex-row items-center w-full">
            <div className="md:w-3/4 w-full">
              <input
                type="text"
                placeholder="Add a new todo here ..."
                value={editIndex !== null ? editText : inputValue}
                onChange={handleInputChange}
                className="border rounded-md py-2 px-4 w-full font-montserrat text-sm md:text-base"
              />
            </div>
            <div className="md:w-1/4 w-full md:text-base text-xs">
              <button
                onClick={handleAddTodo}
                className="bg-blue-500 text-white py-2 px-4 rounded-md w-full font-montserrat text-sm md:text-base"
              >
                {editIndex !== null ? "Update Todo" : "Add New Todo"}
              </button>
            </div>
          </div>

          <div className="overflow-auto w-full font-montserrat">
            {todos.length === 0 ? (
              isWalletConnected ? (
                <p className="text-white text-center text-sm">
                  Oops, you don't have any listed todos available :(
                </p>
              ) : (
                <p className="text-white text-center text-sm">
                  Please connect your Metmask wallet to manage your todos :)
                </p>
              )
            ) : (
              <ol className="flex flex-col">
                {todos.map((todo, index) => (
                  <li
                    key={index}
                    className="mb-4 flex flex-row bg-white md:bg-opacity-0 bg-opacity-10 border border-gray-300 md:border-0 p-2 md:p-0 rounded-sm"
                  >
                    <div className="flex items-center font-semibold text-white font-montserrat w-[58%] md:text-sm text-xs">
                      {index + 1}. {todo.text}
                    </div>
                    <div className="flex md:flex-row flex-col md:gap-0 gap-1 justify-between w-[42%]">
                      <div className="min-w-[30%] md:text-sm text-xs">
                        <button
                          onClick={() => handleDeleteTodo(index)}
                          className="bg-blue-500 text-white py-2 px-4 rounded-md font-montserrat w-full"
                        >
                          Delete
                        </button>
                      </div>

                      <div className="min-w-[25%] md:text-sm text-xs">
                        <button
                          onClick={() => handleEditTodo(index)}
                          className="bg-blue-500 text-white py-2 px-4 rounded-md font-montserrat w-full"
                        >
                          Edit
                        </button>
                      </div>

                      <div className="min-w-[40%] md:text-sm text-xs">
                        <button
                          onClick={() => handleCompleteTodo(index)}
                          className="bg-blue-500 text-white py-2 px-4 rounded-md font-montserrat w-full"
                        >
                          {todo.isCompleted ? "Finished" : "Incomplete"}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
