// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Todo_Contract {
    struct Todo {
        string text;
        bool isCompleted; // changed from completed to isCompleted
    }

    Todo[] public todos;

    // function : add new todo
    function addNewTodo(string memory _text) public {
        Todo memory newTodo = Todo({text: _text, isCompleted: false}); // updated field name
        todos.push(newTodo);
    }

    // function : update a todo
    function updateTodoText(uint256 _index, string memory _newText) public {
        require(_index < todos.length, "Invalid index");
        todos[_index].text = _newText;
    }

    // function : mark a todo as complete
    function markTodoAsCompleted(uint256 _index) public {
        require(_index < todos.length, "Invalid index");
        todos[_index].isCompleted = true; // updated field name
    }

    // function : delete a todo
    function deleteTodo(uint256 _index) public {
        require(_index < todos.length, "Invalid index");
        todos[_index] = todos[todos.length - 1];
        todos.pop();
    }

    // function : view list of todos
    function viewTodos() public view returns (string[] memory, bool[] memory) {
        string[] memory todoTexts = new string[](todos.length);
        bool[] memory todoCompleted = new bool[](todos.length);

        for (uint i = 0; i < todos.length; i++) {
            todoTexts[i] = todos[i].text;
            todoCompleted[i] = todos[i].isCompleted; // updated field name
        }

        return (todoTexts, todoCompleted);
    }
}
