# Node.js related commands
.PHONY: install test dev clean build run-ts

# Default target
all: install

# Install dependencies
install:
	npm install

# Install dependencies for production only
install-prod:
	npm install --production

# Run tests
test:
	npm test

# Clean up
clean:
	rm -rf node_modules
	rm -rf dist
	rm -rf coverage

# Development mode
dev:
	npm run dev

# Build the project
build:
	npm run build

# Type checking with TypeScript
type-check:
	npx tsc --noEmit

# Run in production mode
start:
	npm start

# Install a new package
install-package:
	@read -p "Enter package name: " package; \
	npm install $$package

# Install a new development package
install-dev-package:
	@read -p "Enter package name: " package; \
	npm install --save-dev $$package

# Run TypeScript file with ts-node
run-ts:
	@if [ -z "$(file)" ]; then \
		echo "Please specify a file: make run-ts file=your-file.ts"; \
	else \
		npx ts-node $(file); \
	fi

# Help command
help:
	@echo "Available commands:"
	@echo "  make install          - Install all dependencies"
	@echo "  make install-prod     - Install production dependencies only"
	@echo "  make test            - Run tests"
	@echo "  make clean           - Remove node_modules, dist, and coverage directories"
	@echo "  make dev             - Run in development mode"
	@echo "  make build           - Build the project"
	@echo "  make type-check      - Run TypeScript type checking"
	@echo "  make start           - Start in production mode"
	@echo "  make install-package  - Install a new package (will prompt for name)"
	@echo "  make install-dev-package - Install a new dev package (will prompt for name)"
	@echo "  make run-ts file=<filename> - Run a TypeScript file using ts-node"