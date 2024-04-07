// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Todo_Owner_Contract {
    struct Todo {
        string text;
        bool isCompleted;
    }
    mapping(address => Todo[]) private todosByOwner;
    address public owner;

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can perform this action."
        );
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addNewTodo(string memory _text) public onlyOwner {
        Todo memory newTodo = Todo({text: _text, isCompleted: false});
        todosByOwner[owner].push(newTodo);
    }

    function updateTodoText(
        uint256 _index,
        string memory _newText
    ) public onlyOwner {
        require(_index < todosByOwner[owner].length, "Invalid index");
        todosByOwner[owner][_index].text = _newText;
    }

    function markTodoAsCompleted(uint256 _index) public onlyOwner {
        require(_index < todosByOwner[owner].length, "Invalid index");
        todosByOwner[owner][_index].isCompleted = true;
    }

    function deleteTodo(uint256 _index) public onlyOwner {
        require(_index < todosByOwner[owner].length, "Invalid index");
        todosByOwner[owner][_index] = todosByOwner[owner][
            todosByOwner[owner].length - 1
        ];
        todosByOwner[owner].pop();
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
