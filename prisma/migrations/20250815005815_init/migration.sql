-- CreateTable
CREATE TABLE "public"."OTP" (
    "email" VARCHAR(50) NOT NULL,
    "secret" VARCHAR(100) NOT NULL,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("email")
);
