import React, { useEffect, useReducer } from "react";
import ApolloClient                     from "apollo-boost";
import { ApolloProvider }               from "react-apollo";
import {
    add,
    deleteTodo,
    editTodo,
    getList,
    searchTodo,
    setCompleted
}                                       from "../client";
import { InMemoryCache }                from "apollo-cache-inmemory";
import { HttpLink }                     from "apollo-link-http";

const initialState = {
    todoList: [],
    checkedList: [],
    searchStr: "",
    loading: false
};

const Context = React.createContext({
    state: initialState,
    dispatch: () => {
    }
});

const cache = new InMemoryCache();
const link = new HttpLink({
    uri: "http://localhost:4000/"
});
const Client = new ApolloClient({
    cache,
    link
});
const reducer = (state, action) => {
    switch (action.type) {
        case "GET_LIST": {
            const { todoList } = action;
            return {
                ...state,
                loading: false,
                todoList
            };
        }
        case "CHANGE_CHECKED_LIST": {
            const { checkedList } = action;
            return {
                ...state,
                checkedList
            };
        }
        case "SET_LOADING": {
            return {
                ...state,
                loading: true
            };
        }
        default:
            return state;
    }
};

const asyncDispatch = dispatch => async action => {
    const setList = (func = ({ data }) => data) => ({ data }) => {
        const { todoList } = func(data);
        dispatch({
            type: "GET_LIST",
            todoList
        });
    };
    switch (action.type) {
        case "GET_LIST": {
            dispatch({ type: "SET_LOADING" });
            return await getList().then(setList(data => data));
        }
        case "ADD": {
            dispatch({ type: "SET_LOADING" });
            const { content } = action;
            return await add(content).then(setList());
        }
        case "DELETE": {
            dispatch({ type: "SET_LOADING" });
            const { ids } = action;
            return await deleteTodo(ids).then(setList());
        }
        case "EDIT": {
            dispatch({ type: "SET_LOADING" });
            const { id, content } = action;
            return await editTodo(id, content).then(setList());
        }
        case "SEARCH": {
            dispatch({ type: "SET_LOADING" });
            const { content } = action;
            return await searchTodo(content).then(setList(data => data));
        }
        case "SET_COMPLETED": {
            dispatch({ type: "SET_LOADING" });
            const { id, completed } = action;
            return await setCompleted(id, completed).then(setList());
        }
        default:
            dispatch(action);
    }
};
const useAsyncReducer = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return [state, asyncDispatch(dispatch)];
};
const Provider = props => {
    const [state, dispatch] = useAsyncReducer();
    useEffect(() => {
        dispatch({
            type: "GET_LIST"
        });
    }, []);
    return (
        <ApolloProvider client={ Client } >
            <Context.Provider value={ { state, dispatch } } >
                { props.children }
            </Context.Provider >
        </ApolloProvider >
    );
};

export default Provider;
export { Context, Client };
