En local (développement)

Sans Docker — chaque service dans son propre terminal :

# Terminal 1 — API
cd server
npm install
npm run dev        # nodemon, port 8000

# Terminal 2 — Client vitrine
cd client
npm install
npm run dev        # Vite, port 5173

# Terminal 3 — Admin
cd admin
npm install
npm run dev        # Vite, port 5174

Assure-toi d'avoir un fichier server/.env (ou .env à la racine) avec les vraies valeurs.

---
Sur le VPS (production)

Prérequis : Docker + Docker Compose installés sur le VPS.

# 1. Cloner le repo
git clone <url-du-repo> suguba && cd suguba

# 2. Créer le .env avec tes vraies valeurs (IP VPS, JWT secrets forts, etc.)
nano .env

# 3. Builder et lancer
docker compose up -d --build

# 4. Vérifier que tout tourne
docker compose ps
docker compose logs -f server   # voir les logs de l'API

Ports exposés :

┌────────────────┬────────────────────────┐
│    Service     │          URL           │
├────────────────┼────────────────────────┤
│ Client vitrine │ http://TON_IP_VPS:3000 │
├────────────────┼────────────────────────┤
│ Admin          │ http://TON_IP_VPS:3001 │
├────────────────┼────────────────────────┤
│ API            │ http://TON_IP_VPS:8000 │
└────────────────┴────────────────────────┘

Commandes utiles sur le VPS :

docker compose down            # arrêter
docker compose up -d           # relancer sans rebuild
docker compose up -d --build   # relancer avec rebuild (après un git pull)
docker compose logs server     # logs de l'API

---

▎ Rappel avant le premier lancement sur le VPS : remplace tous les TON_IP_VPS dans .env et mets des JWT secrets forts (voir message précédent).

✻ Brewed for 16s

※ recap: Configuration Docker production terminée : docker-compose.yml, Dockerfiles, correction CORS, et .env mis à jour. Le commit est en attente — tu dois l'approuver pour finaliser. (disable recaps in /config)
