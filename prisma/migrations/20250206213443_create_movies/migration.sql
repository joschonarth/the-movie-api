-- CreateEnum
CREATE TYPE "MovieState" AS ENUM ('TO_WATCH', 'WATCHED', 'RATED', 'RECOMMENDED', 'NOT_RECOMMENDED');

-- CreateTable
CREATE TABLE "movies" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "synopsis" TEXT,
    "release_year" INTEGER NOT NULL,
    "genre" TEXT NOT NULL,
    "state" "MovieState" NOT NULL DEFAULT 'TO_WATCH',
    "rating" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);
