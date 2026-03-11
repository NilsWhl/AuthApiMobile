import express, { Request, Response, NextFunction } from "express";
import { Prisma } from './src/generated/prisma/client';
import { prisma } from './src/db';
import bcrypt from 'bcrypt';
import session from 'express-session';


const app = express();
const port = 8080;

// Pour parser le Json
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API d'authentification");
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,  // Protection XSS
    // secure: true,    // Protection HTTPS
    // sameSite: 'lax', // Protection CSRF
    // maxAge: 24 * 60 * 60 * 1000 // Expire après 24h
  }
}));

app.post("/register", async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // bcrypt car je connais pas le native de bun mais je sais que il existe
    // apparament un grand robot de token a dit : chiffre 10 est le "saltRounds" (compromis idéal entre sécurité et vitesse)
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "Utilisateur créé avec Bun !" });
  } catch (e) {
    next(e);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }

  // Comparaison sécurisée
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }
  else {
    req.session.userId = user.id;
    res.json({ message: "Connexion réussie !" });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid'); // Supprime le cookie
    res.json({ message: "Déconnecté" });
  });
});

app.get("/me", async (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Tu n'es pas connecté" });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.session.userId },
    select: { id: true, username: true, email: true }
  });

  res.json({ user });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(400).json({ 
        error: "Cet email ou ce nom d'utilisateur est déjà utilisé." 
      });
    }
  }

  // Erreur par défaut
  res.status(500).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Ecoute sur le port ${port}\nhttp://localhost:8080`);
});