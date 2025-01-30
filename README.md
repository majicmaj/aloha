# Aloha

## Self-hosted AI Chat Application

This is a self-hosted chat application that connects to a local Ollama instance running the DeepSeek-R1 model. It provides a modern chat interface similar to ChatGPT but runs entirely on your own infrastructure.

## Prerequisites

- Node.js 18 or later
- Ubuntu 20.04 or later (for Ollama)

## Setting up Ollama

1. Install Ollama on Ubuntu:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

2. Pull the DeepSeek-R1 model:

```bash
ollama pull deepseek-coder:1.3b
```

3. Start the Ollama service:

```bash
systemctl start ollama
```

The Ollama API will be available at http://localhost:11434

## Setting up the Web Application

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Configuration

The application connects to Ollama at `http://localhost:11434` by default. If you need to change this, update the `OLLAMA_API_URL` in `src/lib/api.ts`.

## Security Considerations

- The Ollama API should not be exposed directly to the internet
- Use a reverse proxy with proper security headers if you need external access
- Consider implementing authentication for the web application

## License

MIT
