import React, { useContext, useState } from "react";
import {
    Checkbox,
    IconButton,
    Input,
    LinearProgress,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Paper
}                                      from "@material-ui/core";
import EditIcon                        from "@material-ui/icons/Edit";
import DoneIcon                        from "@material-ui/icons/Done";
import styles                          from "./index.module.scss";
import { Context }                     from "../../context";

const ToDoList = () => {
    const { state, dispatch } = useContext(Context);
    const [editId, setEditId] = useState("");
    const [editText, setEditText] = useState("");
    const onCheck = id => (_, checked) => {
        const checkedList = checked
            ? (state.checkedList = [...state.checkedList, id])
            : (state.checkedList = state.checkedList.filter(
                checkedId => checkedId !== id
            ));
        dispatch({
            type: "CHANGE_CHECKED_LIST",
            checkedList
        });
    };
    const onClickEdit = (id, text) => {
        setEditId(id);
        setEditText(text);
    };
    const onEditInput = ({ target }) => {
        const { value } = target;
        setEditText(value);
    };
    const onEditCommit = () => {
        dispatch({
            type: "EDIT",
            id: editId,
            content: editText
        }).then(() => {
            setEditId("");
            setEditText("");
        });
    };
    const onSetCompleted = (id, completed) => {
        if (editId || editText) return;
        dispatch({
            type: "SET_COMPLETED",
            id,
            completed
        });
    };
    return (
        <Paper className={ styles.listWrapper } elevation={ 1 } >
            { state.loading ? (
                <LinearProgress > </LinearProgress >
            ) : (
                <div style={ { height: 4 } } />
            ) }
            <List >
                { state.todoList.map(({ _id, content, completed }) => (
                    <ListItem key={ _id } >
                        <Checkbox
                            onChange={ onCheck(_id) }
                            checked={ state.checkedList.some(checkedId => checkedId === _id) }
                        />
                        <ListItemText
                            className={ styles.listText }
                            onClick={ () => onSetCompleted(_id, !completed) }
                        >
                            { editId === _id ? (
                                <Input value={ editText } onChange={ onEditInput } autoFocus />
                            ) : (
                                <span
                                    style={ completed ? { textDecoration: "line-through" } : null }
                                >
                  { content }
                </span >
                            ) }
                        </ListItemText >
                        <ListItemSecondaryAction >
                            { _id === editId ? (
                                <IconButton onClick={ onEditCommit } >
                                    <DoneIcon />
                                </IconButton >
                            ) : (
                                <IconButton onClick={ () => onClickEdit(_id, content) } >
                                    <EditIcon />
                                </IconButton >
                            ) }
                        </ListItemSecondaryAction >
                    </ListItem >
                )) }
            </List >
        </Paper >
    );
};
export default ToDoList;
