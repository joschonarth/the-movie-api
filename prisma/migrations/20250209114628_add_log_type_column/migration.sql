/*
  Warnings:

  - Added the required column `type` to the `logs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('REQUEST', 'ERROR', 'PERFORMANCE');

-- AlterTable
ALTER TABLE "logs" ADD COLUMN     "type" "LogType" NOT NULL;
