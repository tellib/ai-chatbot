/*
  Warnings:

  - You are about to drop the column `userId` on the `user_session` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `user_session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_session" DROP CONSTRAINT "user_session_userId_fkey";

-- AlterTable
ALTER TABLE "user_session" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "user_session" ADD CONSTRAINT "user_session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
