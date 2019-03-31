import React       from "react";
import styles      from "./App.module.scss";
import ToDoList    from "./components/ToDoList";
import SearchInput from "./components/SearchInput";
import Provider    from "./context";

const App = () => {
    return (
        <Provider >
            <div className={ styles.todoList } >
                <SearchInput />
                <ToDoList />
            </div >
        </Provider >
    );
};
export default App;
