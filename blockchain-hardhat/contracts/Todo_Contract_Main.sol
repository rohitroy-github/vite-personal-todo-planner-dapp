// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

contract Todo_Contract_Main {
    address public contractOwner;
    string public contractName;

    struct Todo {
        string text;
        bool isCompleted;
    }

    mapping(address => Todo[]) private todosByOwner;

    constructor() {
        contractName = "Todo_Contract_Main";
        contractOwner = msg.sender;
    }

    modifier onlyOwner(address _owner, uint256 _index) {
        require(_index < todosByOwner[_owner].length, "Invalid index");
        _;
    }

    function addNewTodo(string memory _text) public {
        Todo memory newTodo = Todo({text: _text, isCompleted: false});
        todosByOwner[msg.sender].push(newTodo);
    }

    function updateTodoText(
        uint256 _index,
        string memory _newText
    ) public onlyOwner(msg.sender, _index) {
        todosByOwner[msg.sender][_index].text = _newText;
    }

    function markTodoAsCompleted(
        uint256 _index
    ) public onlyOwner(msg.sender, _index) {
        todosByOwner[msg.sender][_index].isCompleted = true;
    }

    function deleteTodo(uint256 _index) public onlyOwner(msg.sender, _index) {
        uint256 lastIndex = todosByOwner[msg.sender].length - 1;
        todosByOwner[msg.sender][_index] = todosByOwner[msg.sender][lastIndex];
        todosByOwner[msg.sender].pop();
    }

    function viewTodos() public view returns (string[] memory, bool[] memory) {
        Todo[] memory todos = todosByOwner[msg.sender];

        string[] memory todoTexts = new string[](todos.length);
        bool[] memory todoCompleted = new bool[](todos.length);

        for (uint i = 0; i < todos.length; i++) {
            todoTexts[i] = todos[i].text;
            todoCompleted[i] = todos[i].isCompleted;
        }

        return (todoTexts, todoCompleted);
    }
}
