import express from "express";
import prisma from './db.js';

const app = express();
const PORT = 5003;

app.use(express.json());

app.get("/posts", async(req, res) => {
    const posts = await prisma.post.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
    res.json(posts);
});

app.post('/posts', async (req, res) =>{
    const {title, content} = req.body;

    try {
        const newPost = await prisma.post.create({
            data: {
                title: title,
                content: content,
            },
        });
        res.status(201).json(newPost);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
})

app.get("/", (req, res) => {
    console.log("Someone just visited the homepage!");
    res.send("<h1>Hello World<h1>");
});

app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`));