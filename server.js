// server.js
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

app.use(bodyParser.json());
app.use(cors());

let users = [];

// Регистрация
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'Пользователь уже существует' });
    }
    const newUser = { id: users.length + 1, username, password };
    users.push(newUser);
    res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
});

// Вход
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ message: ' Недействительные учетные данные' });
    }
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Middleware проверки JWT
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// Защищенный маршрут
app.get('/protected', authenticateJWT, (req, res) => {
    res.json({ message: 'Это защищенный маршрут.', user: req.user });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
