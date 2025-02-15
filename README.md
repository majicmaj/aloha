# Aloha

[![GitHub stars](https://img.shields.io/github/stars/majicmaj/aloha?style=social)](https://github.com/majicmaj/aloha/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/majicmaj/aloha?style=social)](https://github.com/majicmaj/aloha/network)

## Self-Hosted AI Chat Application

Aloha is a self-hosted chat application that connects to a local **Ollama** instance. It provides a modern chat interface similar to ChatGPT but runs entirely on your own infrastructure.

---

## Preview

![ALOHA](https://github.com/user-attachments/assets/2ed4fa62-a026-4812-8c35-f76674420b44)

---

## Setting Up Ollama

1. **Install Ollama on Ubuntu:**

   ```bash
   curl -fsSL https://ollama.com/install.sh | sh
   ```

2. **Pull the DeepSeek-R1 model:**

   ```bash
   ollama pull deepseek-coder:1.3b
   ```

3. **Start the Ollama service:**

   ```bash
   systemctl start ollama
   ```

4. **(Optional) Configure Ollama for Network Access:**  
   If running Ollama on a separate server, update its environment variables to allow network access. Refer to the [Ollama FAQ](https://github.com/ollama/ollama/blob/main/docs/faq.md#how-do-i-configure-ollama-server) for details.

   - By default, the **Ollama API** is available at:
     ```
     http://localhost:11434
     ```

---

## Setting Up the Web Application

1. **Clone the repository:**

   ```bash
   git clone <repo-url>
   cd <repo-name>
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Edit the `.env` file:

   ```bash
   vim .env
   ```

   Set the **Ollama API URL** (replace `192.168.x.x` with the appropriate IP if running remotely):

   ```bash
   VITE_URL=http://192.168.x.x:11434
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

5. **Build for production:**

   ```bash
   npm run build
   ```

---

## Configuration

By default, the application connects to **Ollama** at:

```
http://localhost:11434
```

To change this, update `OLLAMA_API_URL` in:

```
src/lib/api.ts
```

---

## Security Considerations

- **Do not expose the Ollama API directly to the internet.**
- **Use a reverse proxy** with proper security headers if external access is needed.
- **Implement authentication** for the web application if hosting publicly.

---

## License

This project is licensed under the **MIT License**.
