#!/bin/bash
echo "--- Starting Database Setup ---"

# Check if postgres is installed
if ! command -v psql &> /dev/null
then
    echo "❌ PostgreSQL is not installed. Attempting to install..."
    sudo apt-get update && sudo apt-get install -y postgresql
fi

# Attempt to start the service
echo "Starting PostgreSQL service..."
sudo service postgresql start || sudo /etc/init.d/postgresql start || pg_ctl start || {
    echo "❌ Failed to start PostgreSQL service."
    echo "Troubleshooting: If you are in CodeSandbox, ensure you are using a template with PostgreSQL or add it via .devcontainer/devcontainer.json"
    exit 1
}

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
RETRIES=10
until pg_isready &> /dev/null || [ $RETRIES -eq 0 ]; do
  echo "Wait... ($RETRIES retries left)"
  sleep 2
  RETRIES=$((RETRIES-1))
done

if [ $RETRIES -eq 0 ]; then
    echo "❌ PostgreSQL did not start in time."
    exit 1
fi

echo "✅ PostgreSQL is ready!"

# Run migrations/seed
echo "Applying database schema..."
pnpm --filter server seed

echo "--- Database Setup Completed ---"
