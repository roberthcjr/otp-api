# One Time Password - RestAPI

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
- OTPProvider -> otplib
- PrismaOTPRepository
- IEnvConfig
- EnvConfig
- ILogger
- Logger

# Database Organization

There's no mistery here, one table with the follow columns:

- email: varchar(50) [https://stackoverflow.com/a/1199245]
- secret: varchar(100) (Didn't find much about a size, but the discussions said about 250bits block, more than suficient 100 chars) [https://security.stackexchange.com/a/33440]
