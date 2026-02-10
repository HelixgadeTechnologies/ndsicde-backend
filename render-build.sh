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

echo "Step 2: TypeScript compilation skipped (using pre-compiled dist folder)"

echo "Build completed successfully!"
