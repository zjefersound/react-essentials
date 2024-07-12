# See https://aka.ms/vscode-remote/devcontainer-base for details
FROM node:20.15.1

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /workspace

# Copy the application code into the container
COPY . .

# Expose ports for the app and Storybook
EXPOSE 3000
EXPOSE 6006