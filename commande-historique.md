Installation de Bun

-> curl -fsSL https://bun.com/install | bash

Verifier la version de Bun

-> bun --version
|-> 1.3.10

Mettre a jour Bun 

-> bun upgrade

Installer Express

-> bun add express

Installer les type pour le bro Vscode

-> bun add -d @types/express

-------------------------------------------------------

Vu que je n'ai pas d'idee de quoi integret j'ai direct demmander a gemini de m'inspirer pour les different fonctionalite du systheme d'auth a realister

Gemini à dit :

- Page de connexion (Login)
- Page d'inscription (Register)
- Fonction de déconnexion (Logout)
- Réinitialisation du mot de passe (Mot de passe oublié)
- Profil utilisateur / Paramètres du compte
- Gestion des sessions (Cookies)
- Validation des e-mails / Vérification de compte
- Authentification à deux facteurs (2FA)

-------------------------------------------------------

On va installer Prisma

-> bun install -D prisma

Ensuite initialiser un nouveau Projet Prisma 

-> bunx prisma init --datasource-provider sqlite

Une fois le model défini, synchroniser ce modèle avec la base de données en exécutant la commande suivante :

-> bunx prisma db push

Genere client prisma :

-> bun install @prisma/client
-> bun install @prisma/adapter-libsql

Il faut également générer le code et les types spécifiques à notre modèle de données décrit dans le fichier prisma/schema.prisma :

-> bunx prisma generate

-------------------------------------------------------

On va installer bcrypt pour hache le mot de passe

-> bun install bcrypt

le type :

bun add -d @types/bcrypt

-------------------------------------------------------

On Va commencer par Register et login 

requetes pour tester sur register sur postman (POST):
localhost:8080/register:
{
    "username": "Nils",
    "email": "nwilhelm1@proton.me",
    "password": "monSuperMotDePasse123"
}
