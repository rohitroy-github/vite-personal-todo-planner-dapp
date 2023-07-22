import React, {useState, useEffect} from "react";
import {ethers} from "ethers";
import "./style.css";
import {abi} from "../../backend/artifacts/contracts/Todo_Contract.sol/Todo_Contract.json";
// import {abi} from "../../backend/artifacts/contracts/Todo_Owner_Contract.sol/Todo_Owner_Contract.json";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const [editIndex, setEditIndex] = useState(-1);
  const [editText, setEditText] = useState("");

  const CONTRACT_ADDRESS = "0x40f89Ed2b0bc1D6594f883c687D9d636494a501A";

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
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      if (editIndex !== -1) {
        handleUpdateTodo(editIndex, inputValue);
      } else {
        // Send transaction to add new todo
        const TX = await contract.addNewTodo(inputValue);
        await TX.wait();

        console.log("Todo created successfully :)");

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
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      // Call the deleteTodo function on the contract
      const TX = await contract.deleteTodo(index);
      await TX.wait();

      console.log("Todo deleted successfully :)");

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

      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      // Call the markTodoAsCompleted function in the contract
      const TX = await contract.markTodoAsCompleted(index);
      await TX.wait();

      console.log("Todo marked as finished :)");

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
      let provider = new ethers.providers.Web3Provider(window.ethereum);
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

    handleUpdateTodo(editIndex, editText);
  };

  // function : toEditATodo
  const handleUpdateTodo = async (index, newText = "") => {
    try {
      // Check if wallet is connected
      if (!isWalletConnected) {
        alert("Please connect your Metamask wallet to proceed :)");
        return;
      }

      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      // Send the transaction to update the todo text
      const TX = await contract.updateTodoText(index, newText);
      await TX.wait();

      console.log("Todo updated successfully :)");

      // updateStates
      updateTodoStates();

      // resetEditingStates
      setEditIndex(-1);
      setEditText("");
      setInputValue("");
    } catch (error) {
      console.error(error);
    }
  };

  // function : toSyncTodoListWithTheOneAvailableOnTheChain
  const updateTodoStates = async () => {
    try {
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

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

  // useEffect(() => {
  //   if (isWalletConnected) {
  //     connectMetamask();
  //   }
  // }, [isWalletConnected]);

  return (
    <>
      <div className="main_container">
        <h2>Let's plan your todos ...</h2>
        <button onClick={connectMetamask}>
          {isWalletConnected ? "Wallet Connected" : "Connect Metamask"}
        </button>

        <div className="edit_block">
          <input
            type="text"
            placeholder="Add a new todo here ..."
            value={editIndex !== -1 ? editText : inputValue}
            onChange={handleInputChange}
          />
          <button onClick={handleAddTodo}>
            {" "}
            {editIndex !== -1 ? "Update Todo" : "Add New Todo"}
          </button>
        </div>

        <div className="display_block">
          {todos.length === 0 ? (
            isWalletConnected ? (
              <p>Oops, you don't have any listed todos available :(</p>
            ) : (
              <p>Please connect your Metmask wallet to manage your todos :)</p>
            )
          ) : (
            <ol>
              {todos.map((todo, index) => (
                <li key={index}>
                  <div className="todo">
                    <div className="todo_view">{todo.text}</div>
                    <div className="todo_functions">
                      <button onClick={() => handleDeleteTodo(index)}>
                        Delete
                      </button>
                      <button onClick={() => handleEditTodo(index)}>
                        Edit
                      </button>
                      <button onClick={() => handleCompleteTodo(index)}>
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
    </>
  );
};

export default App;
