#!/bin/sh

# Wait for MySQL
echo "Waiting for MySQL to be ready..."
/bin/sh ./scripts/wait-for-it.sh mysql

# Run migrations and seeds
echo "Running database migrations..."
npm run migrate

echo "Running database seeds..."
npm run seed

# Start the application
echo "Starting application..."
npm run dev