# OTP Rest API

[![Docker](https://img.shields.io/badge/Docker-ready-blue.svg)](https://docs.docker.com/get-started/get-docker/)  
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)  
[![Tests](https://img.shields.io/badge/tests-jest%20%2B%20supertest-success)](#tests)

A REST API for generating and validating **One-Time Passwords (OTP)** using both **TOTP** (time-based) and **HOTP** (counter-based) standards.

---

## ✨ Features

- ✅ TOTP implementation
- 🚧 HOTP implementation (in progress)
- 🔒 Secure secrets storage (encrypted per email)
- 🧩 Clean Architecture with Express + TypeScript
- 📦 Docker-ready environment
- 📜 Swagger API documentation

---

## 📦 Installation & Setup

### Requirements

- [Docker](https://docs.docker.com/get-started/get-docker/) (required)
- [Node.js](https://nodejs.org/) (optional, for local scripts)

### Environment Variables

Configure `.env` or `.env.docker`:

| Variable      | Description                             |
| ------------- | --------------------------------------- |
| `ALGORITHM`   | Hash algorithm (`SHA1`, `SHA256`, etc.) |
| `DIGITS`      | Number of OTP digits                    |
| `SECRET_SIZE` | Size of generated secret                |
| `PERIOD`      | OTP lifetime (seconds)                  |
| `WINDOW`      | Accepted time window (sync tolerance)   |

---

### Run with Node

```bash
# Development (hot reload)
npm run services:watch

# Production
npm run services:up
```

### Run with Docker only

```bash
# Development
docker compose -f ./infra/compose.yml up --watch

# Production
docker compose -f ./infra/compose.yml up -d
```

### Build for Production

```bash
npm run build && npm start
```

---

## 🚀 Usage

With the service running:

```bash
# Generate OTP
curl -X POST http://localhost:3500/token/generate   -H "Content-Type: application/json"   -d '{"email": "user@email.com"}'
```

```bash
# Validate OTP
curl -X POST http://localhost:3500/token/validate   -H "Content-Type: application/json"   -d '{"email": "user@email.com", "code": "123456"}'
```

Or use the Swagger docs:  
👉 http://localhost:3500/api-docs

---

## 🧪 Tests

Run unit and integration tests with:

```bash
npm run test
```

---

## 📂 Project Structure

```txt
src/
├── domain/          # Entities, repositories, services
├── application/     # Use-cases
├── infrastructure/  # DB, config, providers
├── interface/       # Controllers, routes, middlewares
├── shared/          # Errors, utils
└── index.ts         # Entrypoint
```

---

## 🛠️ Tech Stack

- **TypeScript + Express** (REST API)
- **Clean Architecture**
- **Prisma ORM + PostgreSQL**
- **Docker** (containerization)
- **Jest** (testing)
- **Swagger** (API docs)

---

## 🤝 Contributing

Contributions are welcome!  
Please open an [issue](../../issues) or submit a [pull request](../../pulls).
To know how the project was thinked, good choices and mistakes. Please, consult README-diary.md.

---

## 📄 License

This project is licensed under the MIT License.  
See [LICENSE](./LICENSE) for details.
