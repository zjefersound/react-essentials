# See https://aka.ms/vscode-remote/devcontainer-base for details
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-18

# Create a non-root user
RUN useradd -ms /bin/bash vscode

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /workspace

# Copy the application code into the container
COPY . .

# Change ownership of the workspace directory to the vscode user
RUN chown -R vscode:vscode /workspace

# Switch to the vscode user
USER vscode

# Install node modules
RUN npm install

# Expose ports for the app and Storybook
EXPOSE 3000
EXPOSE 6006