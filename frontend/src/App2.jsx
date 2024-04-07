import React, {useState, useEffect} from "react";
import {ethers} from "ethers";
import {abi} from "../../blockchain-hardhat/artifacts/contracts/Todo_Owner_Contract.sol/Todo_Owner_Contract.json";
import config from "./backend-config.json";

const App2 = () => {
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
        if (typeof window.ethereum === "undefined") {
          throw new Error("MetaMask is not installed.");
        }
        const getProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(getProvider);

        const connectedNetwork = await getProvider.getNetwork();
        const networkConfig = config[connectedNetwork.chainId];
        if (!networkConfig) {
          throw new Error("Network not supported.");
        }
        const getContractAddress = networkConfig.contract.address;

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

  const connectMetamask = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask is not installed.");
      }
      await window.ethereum.request({method: "eth_requestAccounts"});
      setIsWalletConnected(true);
      updateTodoStates();
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setEditText(event.target.value);
  };

  const handleAddTodo = async () => {
    try {
      if (!isWalletConnected) {
        throw new Error("Please connect your Metamask wallet to proceed.");
      }
      if (inputValue === "") {
        throw new Error("Please enter a valid todo item.");
      }
      if (editIndex !== null) {
        await handleUpdateTodo(editIndex, inputValue);
      } else {
        const TX = await contract
          .connect(provider.getSigner())
          .addNewTodo(inputValue);
        await TX.wait();

        updateTodoStates();
        setInputValue("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTodo = async (index) => {
    try {
      if (!isWalletConnected) {
        throw new Error("Please connect your Metamask wallet to proceed.");
      }
      const TX = await contract.connect(provider.getSigner()).deleteTodo(index);
      await TX.wait();
      updateTodoStates();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCompleteTodo = async (index) => {
    try {
      if (!isWalletConnected) {
        throw new Error("Please connect your Metamask wallet to proceed.");
      }
      if (todos[index].isCompleted) {
        throw new Error("This todo is already marked as finished.");
      }
      const TX = await contract
        .connect(provider.getSigner())
        .markTodoAsCompleted(index);
      await TX.wait();
      updateTodoStates();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditTodo = (index) => {
    const todo = todos[index];
    setEditIndex(index);
    setEditText(todo.text);
    setInputValue(todo.text);
  };

  const handleUpdateTodo = async (index, newText = "") => {
    try {
      if (!isWalletConnected) {
        throw new Error("Please connect your Metamask wallet to proceed.");
      }
      if (editText === todos[editIndex].text) {
        throw new Error("Please update the todo to continue.");
      }
      const TX = await contract
        .connect(provider.getSigner())
        .updateTodoText(index, newText);
      await TX.wait();
      updateTodoStates();
      setEditIndex(null);
      setEditText("");
      setInputValue("");
    } catch (error) {
      console.error(error);
    }
  };

  const updateTodoStates = async () => {
    try {
      if (!contract || !provider) {
        throw new Error("Contract or provider not available.");
      }
      const [todoTexts, todoCompleted] = await contract.viewTodos();
      const newTodos = todoTexts.map((text, i) => ({
        text,
        isCompleted: todoCompleted[i],
      }));
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
              className={`bg-blue-500 text-white py-2 px-4 rounded-md w-full font-montserrat ${
                isWalletConnected ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={connectMetamask}
              disabled={isWalletConnected}
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
                disabled={!isWalletConnected}
              />
            </div>
            <div className="md:w-1/4 w-full md:text-base text-xs">
              <button
                onClick={handleAddTodo}
                className={`bg-blue-500 text-white py-2 px-4 rounded-md w-full font-montserrat text-sm md:text-base ${
                  !isWalletConnected ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!isWalletConnected}
              >
                {editIndex !== null ? "Update Todo" : "Add New Todo"}
              </button>
            </div>
          </div>

          <div className="overflow-auto w-full font-montserrat">
            {todos.length === 0 ? (
              <p className="text-white text-center text-sm">
                {isWalletConnected
                  ? "Oops, you don't have any listed todos available."
                  : "Please connect your Metamask wallet to manage your todos."}
              </p>
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

export default App2;
