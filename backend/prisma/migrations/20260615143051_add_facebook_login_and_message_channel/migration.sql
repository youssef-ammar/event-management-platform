-- CreateEnum
CREATE TYPE "MessageChannel" AS ENUM ('whatsapp', 'sms', 'email', 'link', 'facebook');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "channel" "MessageChannel" NOT NULL DEFAULT 'link';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "facebookId" TEXT,
ALTER COLUMN "passwordHash" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_facebookId_key" ON "User"("facebookId");

