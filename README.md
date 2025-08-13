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

- Hexagonal Architecture
- NestJS with TypeScript
- Bcrypt
- PostgreSql
- PrisaORM
- Docker
- JestJS with Supertest
- Swagger

## Change of plans to techs used

- Hexagonal Architecture -> Clean Architecture
- NestJS with TypeScript -> Express with Typescript

### Why this happened

Familiarity with Clean Architecture. That was one of that cases that you have worked with something and didn't know you were working with it. After a quick search, I found out that I have worked with Clean Architecture for almost two years.

For the NestJS part, it was because of the architecture I am pursuing with this project. NestJS follows more a Domain Driven Design path, that is awesome, but not the goal of this project. So I decided to follow with pure Express, because it gives me more freedom to explore the architecture.
