import express from "express";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

type Todo = {
    content: string;
    completed: boolean;
};

type User = {
    id: string;
    name: string;
};

const users: User[] = [
    {
        id: "1",
        name: "John Pork",
        // todos: [{ content: "Eat Pork", completed: false }],
    },
];

function findUser(id: string): User | null {
    if (id) {
        const user = users.find((user: User) => user.id === id);
        if (user) return user;
    }

    return null;
}

const app = express();
const PORT: number = 3000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
    console.log("GET /");
    res.send("Root");
});

app.get("/users", (req, res) => {
    // debug
    console.log("GET /users");
    try {
        res.send(users);
    } catch (error) {
        console.log(error);
    }
});

app.get("/users/:id", (req, res) => {
    const { id } = req.params;
    // debug
    console.log(`/users/${id}`);
    try {
        const user = findUser(id);

        if (user) res.send(user);
        else res.sendStatus(404);
    } catch (error) {
        console.log(error);
    }
});

app.post("/users", (req, res) => {
    const { name } = req.body;

    try {
        const user = {
            id: uuidv4(),
            name: name || "",
            todos: [],
        };
        users.push(user);

        res.send(`${user.id} added to db`);
    } catch (error) {
        console.log(error);
    }
});

app.delete("/users/:id", (req, res) => {
    const { id } = req.params;

    try {
        const user = findUser(id);
        if (user) {
            const index: number = users.indexOf(user);
            users.splice(index, 1);
            res.send(`Deleted ${id} from db`);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.log(error);
    }
});

app.patch("/users/:id", (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        res.status(404).send(
            "No viable request body parameters, no patch made:)",
        );
        return;
    }

    const user = findUser(id);
    if (user) {
        if (name && typeof name === "string") {
            user.name = name;
        }

        res.send(`${id} had a patch`);
    } else {
        res.sendStatus(404);
    }
});

app.listen(PORT, () => {
    console.log(`Listening on port http://localhost:${PORT}`);
});
