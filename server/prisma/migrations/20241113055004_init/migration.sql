/*
  Warnings:

  - You are about to drop the `app_user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_session` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_session" DROP CONSTRAINT "user_session_user_id_fkey";

-- DropTable
DROP TABLE "app_user";

-- DropTable
DROP TABLE "user_session";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
