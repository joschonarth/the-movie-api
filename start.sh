#!/bin/sh

# Wait for PostgreSQL to be ready
./wait-for-it.sh movie-api-pg:5432 --timeout=30 --strict -- echo "PostgreSQL is up"

# Run Prisma migrations
npx prisma migrate deploy

# Start the application
npm start
