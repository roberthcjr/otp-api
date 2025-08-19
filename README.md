# OTP - RestAPI - \[ENGLISH VERSION DOWN BELOW\]

# COMO EXECUTAR

## Tecnologias necessárias

Você só precisará do Docker. Instalar o Node é opcional, apenas para facilitar sua vida usando scripts.

- Docker -> https://docs.docker.com/get-started/get-docker/
- [OPCIONAL] NodeJS -> Recomendo usar nvm(https://github.com/nvm-sh/nvm) ou nvm-windows(https://github.com/coreybutler/nvm-windows)

## Como executar o projeto

### Com Node instalado

- No diretório raiz do projeto execute:

  ```bash
    # Modo desenvolvimento, hot reload
    npm run services:watch
  ```

  ```bash
    # Modo produção, serviços disponíveis
    npm run services:up
  ```

### Sem Node instalado

- No diretório raiz do projeto execute:

  ```bash
    # Modo desenvolvimento, hot reload
    docker compose -f ./infra/compose.yml up --watch
  ```

  ```bash
    # Modo produção, serviços disponíveis
    docker compose -f ./infra/compose.yml up -d
  ```

### Testando

Com os serviços rodando, você pode:

```bash
  # Gerar um token
  curl -X POST http://localhost:3500/token/generate   -H "Content-Type: application/json"   -d '{
  "email": "yours@email.com"
  }'
```

```bash
  # Validar um token
  curl -X POST http://localhost:3500/token/validate   -H "Content-Type: application/json"   -d '{
  "email": "yours@email.com",
  "code": "code-generated"
}'
```

Ou você pode acessar o endpoint de documentação e testar pelos `try it out`:

http://localhost:3500/api-docs

## O que é uma Senha de Uso Único (OTP)

Um código de seis dígitos gerado automaticamente que pode ser usado apenas uma vez. Existem dois tipos de Senhas de Uso Único (OTP): Senha de Uso Único Baseada em Tempo (TOTP) e Senha de Uso Único Baseada em Contador (HOTP).

O **TOTP** gera um código de seis dígitos a cada `n` segundos.  
O **HOTP** gera um código de seis dígitos baseado em um contador, mudando toda vez que o usuário solicita um novo HOTP.

## O que este projeto propõe

**Ele irá construir uma solução HOTP e uma solução TOTP.**

Para a solução HOTP, a ideia inicial é gerar um código de seis dígitos e retorná-lo. Mas há um detalhe: toda vez que isso acontece, será gerado um hash no banco de dados com um _pepper_ cujo valor é baseado no contador de vezes que o usuário solicitou o HOTP.

Quando o código é fornecido, ele compara os hashes com o _pepper_. Se coincidirem, retorna a informação (para este projeto, retornará apenas sucesso, já que não há outra entidade para retornar). Caso contrário, retorna falha (erro).

Para a solução TOTP, a ideia inicial é gerar um código de seis dígitos e retorná-lo, armazenando seu hash no banco de dados. Diferente da solução HOTP, ele gera também a hora em que o código expira e a armazena.

A solução TOTP também verificará o hash no banco de dados, mas também verificará se a data de expiração é anterior à data atual, o que significa retorno de falha e geração de um novo código.

:warning: Este projeto não usa _cron job_, então não gerará um código TOTP a cada `n` segundos. Ele assumirá que o "app" chamará o endpoint a cada `n` segundos. Ou seja, só gerará um novo código quando o endpoint for chamado (com ou sem o código).

## Tecnologias planejadas

- Arquitetura Hexagonal -> Proposta por Eric Evans, também conhecida como Ports and Adapters. Isole seu código de código externo. Similar à Clean Architecture e Onion Architecture.
- NestJS com TypeScript -> Typescript é a escolha principal hoje para projetos JS, previne muitos erros futuros. A injeção de dependências do NestJS é ótima, parecia se encaixar no objetivo arquitetural (me enganei).
- Bcrypt -> Padrão da comunidade para hashing.
- PostgreSQL -> Escolha pessoal (embora NoSQL pudesse ser mais simples no início, PostgreSQL é mais seguro para escalar).
- PrismaORM -> Manter o código desacoplado do banco de dados.
- Docker -> Virtualização.
- JestJS com Supertest -> Testes unitários e integração.
- Swagger -> Documentação.

## Mudança de planos nas tecnologias

- Arquitetura Hexagonal -> Clean Architecture
- NestJS com TypeScript -> Express com TypeScript

### Por que isso aconteceu

Familiaridade com Clean Architecture. Descobri que já havia trabalhado com ela por quase dois anos.  
No caso do NestJS, a escolha do Express foi por dar mais liberdade para explorar a arquitetura, já que Nest segue mais DDD.

## Organização inicial dos arquivos

```txt
src/
├── domain/
│   ├── entities/
│   │   └── OtpToken.ts
│   ├── repositories/
│   │   └── OtpRepository.ts
│   └── services/
│       └── OtpGenerator.ts

├── application/
│   └── use-cases/
│       ├── CreateOtp/
│       │   ├── CreateOtpUseCase.ts
│       │   └── CreateOtpDTO.ts
│       └── ValidateOtp/
│           ├── ValidateOtpUseCase.ts
│           └── ValidateOtpDTO.ts

├── infrastructure/
│   ├── database/
│   │   └── prisma/
│   │       └── OtpPrismaRepository.ts
│   └── config/
│       ├── env.ts
│       └── logger.ts

├── interface/
│   └── http/
│       ├── controllers/
│       │   ├── CreateOtpController.ts
│       │   └── ValidateOtpController.ts
│       ├── routes/
│       │   └── otpRoutes.ts
│       └── middlewares/
│           └── errorHandler.ts
│   └── server.ts

├── shared/
│   ├── errors/
│   │   └── AppError.ts
│   └── utils/
│       ├── dateUtils.ts
│       └── randomUtils.ts

└── index.ts
```

## Mais estudos levaram a uma mudança de planos

Após estudar mais a fundo, simplifiquei a ideia:  
Usar um **SECRET criptografado** vinculado ao e-mail no banco.

- Se o e-mail existe, recupera o secret, descriptografa e gera o código.
- Se não existe, cria o secret, salva e continua o fluxo.
- Para validar: se não existir, falha; se existir, gera código e compara.

Assim elimina a necessidade de jobs de expiração e mantém o banco mais limpo.

A diferença entre TOTP e HOTP passa a ser apenas o uso de **contador**.

## Design

### Entidade

- OTPEntity

### Repositório

- IOTPRepository

### Casos de uso

- ICreate
- IValidate
- Create
- Validate

### Controladores

- IOTPController
- IHTTPController
- ExpressController

### Infraestrutura

- IEncryptProvider / EncryptProvider
- IOTPProvider / OTPProvider (usando otpauth)
- PrismaOTPRepository
- IEnvConfig / EnvConfig
- ILogger / Logger

## Organização do Banco de Dados

Uma tabela simples com colunas:

- email: varchar(50)
- secret: varchar(100)

## Testes

Os testes são extremamente importantes para manter o software funcionando como pretendido. Mas há outro tipo de teste que será feito, ou já foi feito dependendo de quando você estiver lendo, neste projeto: Testes de Conhecimento (Knowlagement Tests). A primeira vez que li sobre eles foi no livro Clean Code, que dizia que os testes podem realmente ajudar você a entender o comportamento de alguma biblioteca ou código de terceiros. Aqui eles foram usados para explorar o comportamento do otpauth.

Mais tarde vou explorar alguns testes de integração. É muito bom fazer TDD, mas desta vez vou escrever o código primeiro e criar os testes depois. Portanto, os testes virão novamente mais adiante.

## Erros

É muito importante ter erros personalizados em nossa aplicação. Eles podem ser muito úteis para depurar o código mais tarde ou para fornecer uma boa resposta ao lado do cliente. Mas não distribua todos os erros para o cliente, pois alguns usuários podem ter más intenções e usar a resposta para explorar o seu código. Portanto, tenha cuidado com quais erros você está enviando.

Neste projeto, os únicos erros que serão retornados ao cliente são InternalServerErrors e OTPInvalidError. Outros erros, como DatabaseError ou ServiceError, serão usados apenas internamente para indicar a causa de alguns erros. Estes últimos ajudam os desenvolvedores a saber a causa de erros genéricos que foram enviados ao lado do cliente.

## Limitador de Requisições

Um limitador de requisições é algo bom de se ter em seu projeto. Em um projeto que é totalmente sobre verificação, impor limites para o cliente fazer requisições em nossa API é indispensável. Estou usando o express-rate-limit, pois é a principal biblioteca do Express para limitar requisições.

---

# README (English)

# OTP - RestAPI

# HOW TO RUN

## Techonologies that you must have

You'll only need Docker. Installing any Node is optional just to make your life easier using scripts

- Docker -> https://docs.docker.com/get-started/get-docker/
- \[OPTIONAL\] NodeJS -> I recommend using nvm(https://github.com/nvm-sh/nvm) or nvm windows(https://github.com/coreybutler/nvm-windows)

## How to run the project

### With Node installed

- In the root directory of the project run:

  ```bash

    # Develop mode, hot reload
    npm run services:watch
  ```

  ```bash

    # Up mode, services available
    npm run services:up
  ```

### With Node not installed

- In the root directory of the project run:

  ```bash

    # Develop mode, hot reload
    docker compose -f ./infra/compose.yml up --watch
  ```

  ```bash

  # Up mode, services available
  docker compose -f ./infra/compose.yml up -d
  ```

### Giving a try

With the services running. You can:

```bash

  # Generate a token
  curl -X POST http://localhost:3500/token/generate \
  -H "Content-Type: application/json" \
  -d '{
  "email": "yours@email.com"
  }'
```

```bash

# Up mode, services available
curl -X POST http://localhost:3500/token/validate \
-H "Content-Type: application/json" \
-d '{
  "email": "yours@email.com",
  "code": "code-generated"
}'

```

Alternately you can try through the api interface, using the button `try it out`:

http://localhost:3500/api-docs

## What is a One Time Password

A six digit automatic generated code that can be used only once. There are two types of One-Time Password (OTP): Time-Based One-Time Password(TOTP) and Hash-Based One-Time Password(HOTP).

TOTP generate a six digit code every `n` seconds.
HOTP generate a six digit code based on a counter, changing every time the user request a new HOTP.

## What this project will propose

**It will build a HOTP and a TOTP solution.**

For the HOTP Solution the initial idea is to generate a six digit code and return it. But, there's a catch, every time this happens, it will generate a hash on the database with a pepper whose value is based on the counter of times the user requested the HOTP.

When the code is given, matches the hashes with the pepper. If they match, return the information (for this project, it will return a success, because there's no other entity to be returned). But if they don't match returns a fail (error).

For the TOTP solution the initial idea is to generate a six digit code and return it, storing its hash in the database. Different from the HOTP solution, it will generate the time when the code will expire and store in the database.

The TOTP solution will also check for the hash in the database but will also check if the expiration date is before than the current date, meaning a fail return and a new code generated.

:warning: This project don't use cron job, so it won't generate a code in TOTP every `n` seconds. It will assume that the "app" will call for it with the code every `n` second. Meaning it will only generate a new code when the endpoint is called (with or without the code).

## Technologies that was planned to be used

- Hexagonal Architecture -> Proposed by Eric Evans, it is also known as Ports and Adapters. Isolates your code from external code. Similar to Clean Architecture and Onion Architecture.
- NestJS with TypeScript -> Typescript is the main choice for JS projects nowadays, it prevents so much errors in the future, because the main source of errors in software is the developer itself D: (https://stackoverflow.com/questions/12694530/what-is-typescript-and-why-should-i-use-it-instead-of-javascript). NestJS dependency injection is amazing, I think would fit this project architectual goals (I was wrong).
- Bcrypt -> Is a community choice for hashing (https://security.stackexchange.com/questions/133239/what-is-the-specific-reason-to-prefer-bcrypt-or-pbkdf2-over-sha256-crypt-in-pass)
- PostgreSql -> Personal Choice (probably NoSql would be the smarter choice due to the simplicity of the initial idea, but if the project scalate to a more robust solution, relational database like PostgreSql would be the secure choice)
- PrisaORM -> A way to keep the code deacoplated from database.
- Docker -> Virtualization.
- JestJS with Supertest -> Jest is the main framework to do tests in JS. Supertest helps with the integration tests, that is a maybe, because Architectures like this helps a lot with unit tests
- Swagger -> The main framework for documentation

## Change of plans to techs used

- Hexagonal Architecture -> Clean Architecture
- NestJS with TypeScript -> Express with Typescript

### Why this happened

Familiarity with Clean Architecture. That was one of that cases that you have worked with something and didn't know you were working with it. After a quick search, I found out that I have worked with Clean Architecture for almost two years.

For the NestJS part, it was because of the architecture I am pursuing with this project. NestJS follows more a Domain Driven Design path, that is awesome, but not the goal of this project. So I decided to follow with pure Express, because it gives me more freedom to explore the architecture.

## Propose of initial organization of files

```
src/
├── domain/
│   ├── entities/
│   │   └── OtpToken.ts
│   ├── repositories/
│   │   └── OtpRepository.ts
│   └── services/
│       └── OtpGenerator.ts

├── application/
│   └── use-cases/
│       ├── CreateOtp/
│       │   ├── CreateOtpUseCase.ts
│       │   └── CreateOtpDTO.ts
│       └── ValidateOtp/
│           ├── ValidateOtpUseCase.ts
│           └── ValidateOtpDTO.ts

├── infrastructure/
│   ├── database/
│   │   └── prisma/
│   │       └── OtpPrismaRepository.ts
│   └── config/
│       ├── env.ts
│       └── logger.ts

├── interface/
│   └── http/
│       ├── controllers/
│       │   ├── CreateOtpController.ts
│       │   └── ValidateOtpController.ts
│       ├── routes/
│       │   └── otpRoutes.ts
│       └── middlewares/
│           └── errorHandler.ts
│   └── server.ts

├── shared/
│   ├── errors/
│   │   └── AppError.ts
│   └── utils/
│       ├── dateUtils.ts
│       └── randomUtils.ts

└── index.ts
```

## More study lead to a change of plans

Getting a little deeper in how OTP works, I got to the final -- I don't promise I won't change something -- idead. The idea simplier than previous one but more aligned with how OTP, works.

For both OTPs approach, I gonna use a SECRET that is crypted in database and has an email linked to it (identification purpose), the database organization will be clear in the next sections. It will be two endpoints -- create and validate -- in create, we check if the email is present in the database, if so, we get the SECRET and uncrypt it, generate a code based on the secret and the current time, using a lib for it, and return the code generated, if the email is not present, we create a secret, store in the database and continue the flux as if there was an email. For the validate we check if the email is present, if not fails, if it is, get the SECRET and generate the code to see if matches the code sent, fails if not and successed if yes.

So, the idea of hashing and expire date in database is gonne, removing the necessity of cron jobs and getting the database cleaner and smaller.

The only difference between the TOTP and HOTP will be the column counter, that will exist and make part of the secret when making the code instead of the time.

# Design

It's explicit that the file organization will change, the initial idea was only a north.

## Entity

- OTPEntity

## Repository

- IOTPRepository

## Use-cases

- ICreate
- IValidate
- Create
- Validate

## Controllers

- IOTPController
- IHTTPController
- ExpressController

## Infrastructure

- IEncryptProvider
- EncryptProvider
- IOTPProvider
- OTPProvider -> otplib -> due to lack of support on this package, decided to move with otpauth
- PrismaOTPRepository
- IEnvConfig
- EnvConfig
- ILogger
- Logger

# Database Organization

There's no mistery here, one table with the follow columns:

- email: varchar(50) [https://stackoverflow.com/a/1199245]
- secret: varchar(100) (Didn't find much about a size, but the discussions said about 250bits block, more than suficient 100 chars) [https://security.stackexchange.com/a/33440]

# Tests

Tests are extremelly important to keep the software running as inteded. But there is another type of tests the will be done, or it is done depeding on when you're reading, in this project: Knowlagement Tests. First time a read about them was in Clean Code book, saying that tests can really help you understand the behavior of some library or third party code. Here it was used to explore the behavior of otpauth.

Later I'll explore some integration tests. It is very nice to do TDD, but this time I'll do the code and do tests later. So Tests will come again later on.

# Errors

It is very important to have custom errors in our application. It can be very handy to debug your code later or to give a good response to your client side. But don't distribute every error to the client side, some users can have bad intentions and use the response to exploit your code. So keep in mind what Errors you are sending.

In this project, the only errors that will be returned to the client side are InternalServerErrors and OTPInvalidError. Other errors like DatabaseError or ServiceError will only be used internally to give a cause to some errors. This last one helps developers know the cause of some generic errors that was sent to the client-side.

# Request Limiter

A request limiter is good thing to have on your project. In a project that is all about verifing, giving limits to the client to request in our API is a must have. I'm using express-rate-limit because is the main library for express in request limits.
