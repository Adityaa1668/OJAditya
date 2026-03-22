# HackathonHub - Interview Preparation Guide

This document contains everything you need to know and say during your interview about your MERN-stack Online Judge project.

---

## 1. The 5-7 Minute Interview Speech

**Part 1: The Hook (Opening)**
"Hi, I'm Aditya. Today I'd like to tell you about my project, **HackathonHub**. Essentially, it's an Online Judge platform—think of a mini LeetCode or Codeforces. I built it so developers can practice coding problems, run their solutions against test cases in real-time, and see their results instantly. The biggest challenge wasn't just showing problems on a screen; it was building a system that could securely take raw code from a stranger, compile it on my server, and run it safely without crashing or getting hacked."

**Part 2: The Tech Stack & Why Docker?**
"I built this using the MERN stack: MongoDB, Express, React, and Node.js. But what sets this project apart is the infrastructure. I containerized the entire backend using Docker. 
An Online Judge requires specific compilers like `g++`, `python3`, and `java` to be installed. By using a Dockerfile based on Alpine Linux, I bundled the Node.js API together with all those compilers. This means my code execution engine is 100% portable and isolated, protecting the host machine from any malicious code users might submit."

**Part 3: The "Magic" (How Code Execution Works)**
"Let me explain the core engine. When a user writes C++ code and clicks 'Run', here is the flow:
1. **File Generation:** My backend uses Node's `fs` module to dynamically create a `.cpp` source file and a `.txt` input file inside the container.
2. **Child Process:** Since Node.js shouldn't be busy doing heavy math, I use the `child_process.exec` module to spawn a separate, background terminal. This terminal runs the `g++` compiler and executes the user's code.
3. **The Safety Switch:** I specially engineered a strict **5-second timeout**. If a user submits an infinite loop (`while(true)`), Node.js automatically detects it, kills that background process via OS-level signals, and sends a 'Time Limit Exceeded' message to the user. This ensures my server never freezes and stays fast for everyone else."

**Part 4: Security & Authentication**
"For user data, I prioritized modern security standards. We use **JWT (JSON Web Tokens)** for stateless authentication. However, I don't store them in Local Storage where they can be stolen by malicious scripts. Instead, I store them in **HttpOnly, Secure cookies**. This makes the tokens invisible to JavaScript, protecting users from XSS (Cross-Site Scripting) attacks. For passwords, I use `bcryptjs` to hash them, ensuring even a database leak won't compromise user credentials."

**Part 5: Closing (Growth & Future)**
"Overall, HackathonHub was a journey into systems programming, process management, and DevOps. It taught me how to handle asynchronous operations at scale and how to build a sandbox environment for code. In the future, I plan to add a Message Queue like Redis to handle thousands of concurrent submissions efficiently. Thank you, and I’d be happy to walk you through any part of the code!"

---

## 2. Expected Cross-Questions & Punchy Answers

### **Segment A: Code Execution & Architecture**
**Q: How does Node.js actually run the C++ or Python code?**
A: I use Node’s built-in `child_process.exec()` function. The server generates a source file using the `fs` module, and `exec()` triggers the actual system compiler (like `g++` or `python3`) as a background terminal command inside the container and returns the printed output.

**Q: What happens if a user submits an infinite loop (`while(true)`)?**
A: I pass a strict 5000ms `timeout` limit into the `child_process.exec()` configuration. If execution takes longer than 5 seconds, Node.js forcibly sends a Kill Signal (`SIGTERM`) to that specific child process, and my server safely catches the error and returns a "Time Limit Exceeded" response.

**Q: How does the server handle multiple users running code at the exact same time?**
A: Because Node.js is heavily asynchronous and non-blocking, it delegates the slow `child_process` compilation to the underlying OS background workers. The main Express thread immediately becomes free to accept login or execution requests from other users while it waits for the OS to finish compiling.

### **Segment B: Docker & Containerization**
**Q: Why use Docker for this project?**
A: Because an Online Judge relies heavily on system-level compilers. By using a single `Dockerfile` based on ultra-lightweight Alpine Linux, I bundled the Node API and the native C++, Python, and Java compilers into one image. This makes deployment completely portable ("write once, run anywhere").

**Q: What does "Spinning up" a Docker Image mean?**
A: A Docker Image is the static, read-only set of instructions (like a blueprint). "Spinning it up" means placing a live, writable layer on top of it and executing it as a live **Container**.

### **Segment C: Security & Authentication**
**Q: Why use JSON Web Tokens (JWT) for login instead of Sessions?**
A: JWTs are stateless. The server doesn't need to manually store session IDs in a database and look them up on every single request. It just mathematically verifies the token's cryptographic signature, making the app much faster and more scalable.

**Q: Where is the JWT stored on the frontend, and why?**
A: I store it in an **HttpOnly cookie**, never in Local Storage. Local Storage can be easily read by malicious javascript. An `HttpOnly` cookie physically tells the browser to hide the token from all javascript, fully protecting users from Cross-Site Scripting (XSS) token-theft attacks.

**Q: How does `bcryptjs` protect passwords?**
A: It hashes the passwords by generating a random "salt" and mathematically scrambling the password before saving it. It protects against brute-force and rainbow table attacks so actual passwords are never exposed.

**Q: What is exactly inside a JWT?**
A: It has three Base64 encoded parts: the Header (the algorithm info), the Payload (non-sensitive user data like MongoDB `_id` and role), and the Signature (a mathematical hash created using the Header, Payload, and my `.env` Secret Key to ensure the data hasn't been tampered with).

### **Segment D: Frontend-Backend Connection**
**Q: How did you handle CORS (Cross-Origin Resource Sharing) when connecting React to Node.js?**
A: Browsers block requests between different origin ports (like React on 5173 and Node on 3000) for security. I used the `cors` middleware in Express to explicitly whitelist my specific React frontend URL to make requests to the API. I also set `credentials: true` to allow secure cookies to be transmitted back and forth.

### **Segment E: Big Picture & Setup Files**
**Q: What is the purpose of `.env`, `.gitignore`, and `.dockerignore`?**
A: 
- **`.env`**: Securely stores secrets like my MongoDB connection URI and JWT key as environment variables so they aren't hardcoded in the source code.
- **`.gitignore`**: Tells version control to never upload massive generated folders (like `node_modules/`) or secrets (`.env`) to GitHub.
- **`.dockerignore`**: Tells Docker to skip copying my local Mac's `node_modules` during the build process, so it can run a fresh `npm install` specifically for the Linux container environment.

**Q: Why MongoDB over SQL?**
A: I chose MongoDB for its flexible Document model (`NoSQL`). Problem descriptions, arrays of multiple test cases, and arrays of tags all fit naturally into nested JSON-like documents, whereas in SQL, it would require multiple separate tables and complex `JOIN` queries.

**Q: How would you scale this if you had 10,000 concurrent users compiling code?**
A: I would decouple the architecture by introducing a **Message Queue** (like RabbitMQ or Redis/BullMQ). The Express API would receive the code and offload it into the queue. Separate "Worker Servers" would do nothing but pull jobs from the queue, compile them, and update the database. This keeps the main web server lightning-fast.
