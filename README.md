<div align="center">

<h1>node-express-mongo-api</h1>

<p>
  <img src="https://img.shields.io/badge/Node.js-20.x-339933.svg?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-4.x-000000.svg?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-7.x-47A248.svg?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED.svg?logo=docker&logoColor=white" alt="Docker Compose" />
</p>

<p>API REST minimaliste en Node.js (Express) connectée à MongoDB via le driver natif, orchestrée avec Docker Compose.</p>

<!-- Mini animation SVG (peut être statique si la plateforme désactive l'animation) -->
<svg width="120" height="20" viewBox="0 0 120 20" xmlns="http://www.w3.org/2000/svg">
  <circle cx="20" cy="10" r="6" fill="#47A248">
    <animate attributeName="r" values="6;3;6" dur="1.2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="60" cy="10" r="6" fill="#2496ED">
    <animate attributeName="r" values="6;3;6" dur="1.2s" begin="0.2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="100" cy="10" r="6" fill="#339933">
    <animate attributeName="r" values="6;3;6" dur="1.2s" begin="0.4s" repeatCount="indefinite"/>
  </circle>
</svg>

</div>

## Aperçu
- Express expose 3 routes : `GET /`, `GET /items`, `POST /items`.
- Connexion MongoDB via `MONGO_URL` (driver natif `mongodb`).
- Orchestration avec Docker Compose : services `api` et `mongo`, ports 3000/27017, volume persistant.

## Démarrage rapide
1. Construire et lancer
   - `docker compose up -d --build`
2. Vérifier les services
   - `docker compose ps`
3. Consulter les logs
   - `docker compose logs -f api`
4. Tester
   - `curl http://localhost:3000/`

## Endpoints
- `GET /`  
  Renvoie l’état de l’API et l’URL Mongo.

- `GET /items`  
  Liste les documents de la collection `items` (triés par `createdAt` desc).

- `POST /items`  
  Crée un document. Corps JSON attendu (ex. `{ "name": "exemple", "value": 42 }`).

## Variables d’environnement
- `MONGO_URL` : URI MongoDB (ex : `mongodb://mongo:27017/appdb`).
- `PORT` : port HTTP de l’API (par défaut : `3000`).

## Exemples cURL
- Santé :  
  `curl http://localhost:3000/`

- Création :  
  `curl -H "Content-Type: application/json" -d "{\"name\":\"exemple\",\"value\":42}" -X POST http://localhost:3000/items`

- Liste :  
  `curl http://localhost:3000/items`

## Architecture (Compose)
```mermaid
flowchart LR
  C[Client] -->|HTTP:3000| A[API (Express)]
  A -- MONGO_URL --> M[(MongoDB)]
  M --- V[(Volume: mongo-data)]
```

## Dépannage
- Assurez-vous que Docker Desktop est démarré.
- Si `GET /items` renvoie une liste vide, créez un item avec `POST /items`.
- En cas d’échec réseau, vérifiez que les ports `3000` et `27017` ne sont pas occupés.

---

<sub>Icônes SVG via shields.io (SVG), petite animation en SVG pour l’illustration.</sub>

