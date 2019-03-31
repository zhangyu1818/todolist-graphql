import React, { useContext, useState } from "react";

import styles from "./index.module.scss";

import Paper       from "@material-ui/core/Paper/index";
import InputBase   from "@material-ui/core/InputBase/index";
import Divider     from "@material-ui/core/Divider/index";
import IconButton  from "@material-ui/core/IconButton/index";
import PlusIcon    from "@material-ui/icons/Add";
import SearchIcon  from "@material-ui/icons/Search";
import DeleteIcon  from "@material-ui/icons/Delete";
import { Context } from "../../context";

const SearchInput = () => {
    const { state, dispatch } = useContext(Context);
    const [inputValue, setInputValue] = useState("");
    const onInputChange = ({ target }) => {
        const { value } = target;
        setInputValue(value);
    };
    const onClickAdd = () => {
        if (!inputValue) return;
        dispatch({
            type: "ADD",
            content: inputValue
        }).then(() => {
            setInputValue("");
        });
    };
    const onClickDelete = () => {
        if (!state.checkedList.length) return;
        dispatch({
            type: "DELETE",
            ids: state.checkedList
        });
    };
    const onClickSearch = () => {
        dispatch({
            type: "SEARCH",
            content: inputValue
        });
    };
    return (
        <Paper className={ styles.wrapper } elevation={ 1 } >
            <InputBase
                value={ inputValue }
                onChange={ onInputChange }
                className={ styles.input }
                placeholder="To-Do List"
            />
            <IconButton
                className={ styles.iconButton }
                aria-label="Add"
                onClick={ onClickAdd }
            >
                <PlusIcon />
            </IconButton >
            <IconButton
                className={ styles.iconButton }
                aria-label="Search"
                onClick={ onClickSearch }
            >
                <SearchIcon />
            </IconButton >
            <Divider className={ styles.divider } />
            <IconButton
                color="secondary"
                className={ styles.iconButton }
                aria-label="Directions"
                onClick={ onClickDelete }
            >
                <DeleteIcon />
            </IconButton >
        </Paper >
    );
};

export default SearchInput;
