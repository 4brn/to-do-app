import express from "express";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";

type Todo = {
    content: string;
    completed: boolean;
};

type User = {
    id: string;
    name: string;
    todos: Array<Todo>;
};

// Mock database
let users: Array<User> = [
    {
        // id: uuidv4(),
        id: "1",
        name: "John Doe",
        todos: [
            { content: "Go to gym", completed: false },
            { content: "Buy groceries", completed: false },
        ],
    },
    {
        id: uuidv4(),
        name: "Alice Smith",
        todos: [
            { content: "Go shopping", completed: false },
            { content: "Doctor's appointment", completed: false },
        ],
    },
];

function findUser(id: string) {
    const foundUser: User | undefined = users.find((user) => user.id === id);
    return foundUser;
}

const app = express();
const PORT: number = 3000;

// used to read the request's body as json
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Todo API root");
});

app.get("/users", (req, res) => {
    res.send(users);
});

app.get("/users/:id", (req, res) => {
    const { id } = req.params;

    const user = findUser(id);
    res.send(user);
});

app.post("/users", (req, res) => {
    const { name, todos } = req.body;

    const newUser = {
        id: uuidv4(),
        name: name || "",
        todos: todos
            ? todos.map((todo: string) => ({ content: todo, completed: false }))
            : [],
    };
    users.push(newUser);

    res.send(`${newUser.id} has been added to the Database`);
});

app.delete("/users/:id", (req, res) => {
    const { id } = req.params;

    users = users.filter((user: User) => user.id !== id);
    res.send(`${id} deleted succesfullly`);
});

app.patch("/users/:id", (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const patches = [];

    const user: User | undefined = findUser(id);

    if (user && name) {
        user.name = name;
        patches.push("first name");
    }
    res.send(`update to ${id}: ${patches.join(",")}`);
});

app.post("/users/:id/todos", (req, res) => {
    const { id } = req.params;
    const { todo } = req.body;

    try {
        const user: User | undefined = findUser(id);
        // console.log(user);
        if (user) {
            user.todos.push({ content: todo, completed: false });
        }
        res.send(`added \"${todo}\" to ${id}'s todos`);
    } catch (error) {
        console.log(error);
        // res.send(error);
    }
});

app.delete("/users/:id/todos", (req, res) => {
    const { id } = req.params;
    const { index } = req.body;

    try {
        const user = findUser(id);

        if (user) {
            const deleted: string = user.todos[index].content;
            user.todos.splice(index, 1);
            res.send(`Deleted \"${deleted}\" from ${id}'s todos`);
        }
    } catch (error) {
        console.log(error);
    }
});

/* app.patch("/users/:id/todos", (req, res) => {
    const { id } = req.params;
    const { index, patch, completed } = req.body;
    const contentPatchMessage = "";
    const completedPatchMessage = "";

    try {
        const user = findUser(id);
        if (patch) {
            const beforePatch = user.todos[index].content;
            user.todos[index].content = patch;
            contentPatchMessage = `Patched ${beforePatch} to ${patch} in ${id}'s todos`;
        }
        if (completed) {
            const beforeComplete = user.todos[index].completed;
            user.todos[index].completed = completed;
            completedPatchMessage = `Changed completion from ${beforeComplete} to ${completed}`;
        }

        res.send(
            `${"1." + contentPatchMessage}${"2." + completedPatchMessage}`,
        );
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}); */
app.listen(PORT, () =>
    console.log(`Server running on: http://localhost:${PORT}`),
);
