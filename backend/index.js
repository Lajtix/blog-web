import express from "express";
import prisma from './db.js';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 5003;


const JWT_SECRET = 'your-secret-key';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cors());

app.use(express.json());

app.get("/posts", async(req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const posts = await prisma.post.findMany({
        take: limit,
        skip: offset,
        include: {
            author: {
                select: {
                    username: true,
                }
            },
            like: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    const totalPosts = await prisma.post.count();
    console.log(totalPosts);
    res.json({posts, totalPosts});
});

app.post('/posts', async (req, res) =>{
    const {title, content, authorId, image} = req.body;

    try {
        const newPost = await prisma.post.create({
            data: {
                title: title,
                content: content,
                authorId: authorId,
                image: image,
            },
        });
        res.status(201).json(newPost);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
})

app.delete('/posts/:id', async (req, res) => {
    const {id} = req.params;
    const {userId} = req.body;
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: parseInt(id)
            }
        })

        if(post.authorId !== userId) {
            return res.status(403).json({error: "You are not authorized to delete this post"})
        }
        await prisma.post.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.json({message: "Post deleted successfully"});
    } catch (error) {
        res.status(500).json({error: "Couldnt delete post"})
    }
});

app.post('/registration', async (req, res) => {
    try{
        const {username, email, password, confirmPassword} = req.body;

        console.log(username, email, password);


        if (!email || !username || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match!" });
        }
        console.log(1);
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    {username: username || ""},
                    {email: email || ""},
                ]
            }
        })
        console.log(2);
        if(existingUser) {
            return res.status(400).json({message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        console.log(3);
        await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: hashedPassword,
        }}
        );
        console.log(4);
        res.status(201).json({message: "User created successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }

})

app.post('/login', async (req, res) => {
    try {

        const {email, password} = req.body;
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            }
        });

        if(!user) {
            return res.status(400).json({message: "User not found"})
        }

        const hashedPasswordFromDB = user.password;
        const isMatch = await bcrypt.compare(password, hashedPasswordFromDB);

        if(!isMatch) {
            return res.status(400).json({message: "Invalid credentials"})
        } else {
            const token = jwt.sign(
                {userId: user.id, username: user.username},
                JWT_SECRET,
                {expiresIn: '24h'}
            );
            return res.status(200).json({
                    message: "Login successful",
                    token: token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email
                    }
                }
            );
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.get('/verify', async (req, res) => {
    const token = req.headers.authorization;

    if(!token) {
        return res.status(401).json({message: "No token provided"})
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: {id: decoded.userId}
        });
        if(!user) {
            return res.status(401).json({message: "User not found"})
        }

        res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            }
        });
    } catch (error) {
        res.status(401).json({message: "Invalid or expired token"})
    }
})

app.get("/", (req, res) => {
    console.log("Someone just visited the homepage!");
    res.send("<h1>Hello World<h1>");
});

app.post('/posts/:id/like', async (req, res) => {
    const {id} = req.params;
    const {userId} = req.body;

    try {
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId: Number(userId),
                    postId: Number(id),
                }
            }
        });

        if(existingLike) {
            await prisma.like.delete({
                where: {
                    id: existingLike.id
                }
            });
            const updatedPost = await prisma.post.findUnique({
                where: {
                    id: Number(id)
                },
                include: {
                    author: true,
                    like: true }
            })
            console.log(updatedPost);
            return res.json({
                message: "Like removed",
                post: updatedPost
            });
        } else {
            await prisma.like.create({
                data: {
                    userId: Number(userId),
                    postId: Number(id),
                }
            });
            const updatedPost = await prisma.post.findUnique({
                where: {
                    id: Number(id)
                },
                include: {
                    author: true,
                    like: true }
            })
            return res.json({
                message: "Like added",
                post: updatedPost
            });
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`));