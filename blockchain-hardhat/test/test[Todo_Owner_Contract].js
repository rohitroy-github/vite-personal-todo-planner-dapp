// Import necessary modules
const {ethers} = require("hardhat");
const {assert, expect} = require("chai");

describe("Todo_Contract_Main", function () {
  let todoContract;
  let owner;
  const todoText = "Test Todo";

  beforeEach(async function () {
    // Deploy the contract before each test
    const Todo_Contract_Main = await ethers.getContractFactory(
      "Todo_Contract_Main"
    );
    todoContract = await Todo_Contract_Main.deploy();
    await todoContract.deployed();

    // Get the owner address
    [owner] = await ethers.getSigners();
  });

  it("should set contract name and owner correctly in the constructor", async function () {
    // Get the deployed contract's name and owner
    const deployedName = await todoContract.contractName();
    const deployedOwner = await todoContract.contractOwner();

    // Check if the contract name and owner are set correctly
    assert.equal(
      deployedName,
      "Todo_Contract_Main",
      "Contract name not set correctly"
    );
    assert.equal(
      deployedOwner,
      owner.address,
      "Contract owner not set correctly"
    );
  });

  it("should add a new todo", async function () {
    await todoContract.connect(owner).addNewTodo(todoText);
    const [todos, completed] = await todoContract.viewTodos();

    // Check if the added todo exists
    assert.equal(todos.length, 1, "Todo count not incremented");
    assert.equal(todos[0], todoText, "Todo text does not match");
    assert.equal(completed[0], false, "Todo should not be marked as completed");
  });

  it("should update todo text", async function () {
    await todoContract.connect(owner).addNewTodo(todoText);
    const newText = "Updated Todo Text";
    await todoContract.connect(owner).updateTodoText(0, newText);
    const [todos] = await todoContract.viewTodos();

    // Check if the todo text is updated
    assert.equal(todos[0], newText, "Todo text not updated");
  });

  it("should mark todo as completed", async function () {
    await todoContract.connect(owner).addNewTodo(todoText);
    await todoContract.connect(owner).markTodoAsCompleted(0);
    const [, completed] = await todoContract.viewTodos();

    // Check if the todo is marked as completed
    assert.equal(completed[0], true, "Todo not marked as completed");
  });

  it("should delete todo", async function () {
    await todoContract.connect(owner).addNewTodo(todoText);
    await todoContract.connect(owner).deleteTodo(0);
    const [todos] = await todoContract.viewTodos();

    // Check if the todo is deleted
    assert.equal(todos.length, 0, "Todo not deleted");
  });

  it("should revert when updating todo text with wrong index", async function () {
    // Try updating todo text with wrong index
    await expect(
      todoContract.connect(owner).updateTodoText(1, "Updated Text")
    ).to.be.revertedWith("Invalid index");
  });

  it("should revert when marking todo as completed with wrong index", async function () {
    // Try marking todo as completed with wrong index
    await expect(
      todoContract.connect(owner).markTodoAsCompleted(1)
    ).to.be.revertedWith("Invalid index");
  });

  it("should revert when deleting todo with wrong index", async function () {
    // Try deleting todo with wrong index
    await expect(todoContract.connect(owner).deleteTodo(1)).to.be.revertedWith(
      "Invalid index"
    );
  });
});
