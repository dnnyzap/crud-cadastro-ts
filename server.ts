import express from 'express';
import multer from 'multer';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import path from 'path';
import cors from 'cors';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'chave_padrao_de_seguranca';


if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));


const db = new sqlite3.Database(':memory:'); // Em memória para facilitar testes (reinicia ao parar o servidor)

db.serialize(async () => {
    db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        dob TEXT NOT NULL,
        photo TEXT NOT NULL,
        address TEXT NOT NULL,
        gender TEXT NOT NULL,
        password TEXT NOT NULL
    )`);

    
    const hash = await bcrypt.hash('123456', 10);
    db.run(`INSERT INTO users (name, email, dob, photo, address, gender, password) 
            VALUES ('Administrador', 'admin@teste.com', '1990-01-01', 'default.png', 'Rua Admin, 123', 'M', ?)`, [hash]);
});


const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        next();
    });
};


app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user: any) => {
        if (err || !user) return res.status(401).json({ error: 'Usuário não encontrado' });
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: 'Senha incorreta' });

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY);
        res.json({ token });
    });
});


app.get('/api/users', authenticateToken, (req, res) => {
    db.all(`SELECT id, name, email, dob, photo, address, gender FROM users`, [], (err, rows) => {
        res.json(rows);
    });
});

app.post('/api/users', authenticateToken, upload.single('photo'), async (req, res) => {
    const { name, email, dob, address, gender, password } = req.body;
    if (!req.file || !name || !email || !dob || !address || !gender || !password) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    const hash = await bcrypt.hash(password, 10);
    const photoUrl = req.file.filename;

    db.run(`INSERT INTO users (name, email, dob, photo, address, gender, password) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, email, dob, photoUrl, address, gender, hash], function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ id: this.lastID });
        });
});

app.delete('/api/users/:id', authenticateToken, (req, res) => {
    db.run(`DELETE FROM users WHERE id = ?`, [req.params.id], function (err) {
        res.json({ deleted: this.changes });
    });
});

app.listen(PORT, () => console.log(` Servidor rodando em http://localhost:${PORT}`));