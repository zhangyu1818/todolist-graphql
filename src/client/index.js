import { Client } from "../context";
import gql        from "graphql-tag";

const getList = async () => {
    return await Client.query({
        query: gql`
            {
                todoList {
                    _id
                    content
                    completed
                }
            }
        `
    });
};
const searchTodo = async content => {
    return await Client.query({
        variables: { content },
        query: gql`
            query search($content: String!) {
                todoList: todo(content: $content) {
                    _id
                    content
                    completed
                }
            }
        `
    });
};
const add = async content => {
    return await Client.mutate({
        variables: { content },
        mutation: gql`
            mutation add($content: String!) {
                addTodo(content: $content) {
                    success
                }
            }
        `
    }).then(async () => {
        await Client.resetStore();
        return await getList();
    });
};
const deleteTodo = async ids => {
    return await Client.mutate({
        variables: { ids },
        mutation: gql`
            mutation delete($ids: [ID]!) {
                deleteTodo(_id: $ids) {
                    success
                }
            }
        `
    }).then(async () => {
        await Client.resetStore();
        return await getList();
    });
};
const editTodo = async (id, content) => {
    return await Client.mutate({
        variables: { id, content },
        mutation: gql`
            mutation edit($id: ID!, $content: String!) {
                editTodo(_id: $id, content: $content) {
                    success
                }
            }
        `
    }).then(async () => {
        await Client.resetStore();
        return await getList();
    });
};
const setCompleted = async (id, completed) => {
    return await Client.mutate({
        variables: { id, completed },
        mutation: gql`
            mutation setCompleted($id: ID!, $completed: Boolean!) {
                setCompleted(_id: $id, completed: $completed) {
                    success
                }
            }
        `
    }).then(async () => {
        await Client.resetStore();
        return await getList();
    });
};
export { getList, add, deleteTodo, editTodo, searchTodo, setCompleted };
