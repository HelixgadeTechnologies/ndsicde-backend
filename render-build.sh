#!/bin/bash
# Render build script with memory optimization

echo "Starting Render build process..."

# Set Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=2048"

echo "Step 1: Generating Prisma Client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "Prisma generation failed!"
    exit 1
fi

echo "Step 2: Compiling TypeScript..."
npx tsc -p tsconfig.build.json

if [ $? -ne 0 ]; then
    echo "TypeScript compilation failed!"
    exit 1
fi

echo "Build completed successfully!"
