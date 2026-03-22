
## 1. The Introduction (Your "Elevator Pitch")

*When they say: "Tell me about yourself and your recent experience."*

"Hi, I'm Aditya. I am a full-stack engineer passionate about building scalable and secure web applications. Recently, I've been focusing heavily on the MERN stack and modern backend architecture. 

In my most recent project, HackathonHub, I specifically challenged myself to go beyond a basic CRUD app. I built a containerized Online Judge platform that actually interfaces with the operating system to safely execute asynchronous subprocesses, handle memory timeouts, and manage stateless security. 

I focused on building **production-ready systems with clean architecture**, rather than just quick prototypes. I’m really excited about the opportunity to bring my strong foundation in Node.js, React, and system design to your team, and I feel my experience with complex backend systems makes me a great fit for this Full Stack role."

---

## 2. Explaining Your Project (Tailored to the JD)

*When they ask: "Walk me through a complex project you've built."*

"My most complex project so far is **HackathonHub**. It is a full-stack Online Judge platform where users can solve coding problems and compile their code instantly on the server. I built it using React, Node.js, Express, and MongoDB.

The hardest part was the backend. Letting random users run C++ or Python code on my server is very dangerous. So, I focused a lot on making it secure and fast. Here is how I built it:

**1. Using Docker for Safety**
To make sure the code runs exactly the same way everywhere and doesn't mess up my main computer, I put the backend inside Docker. I made a custom Docker setup that installs the necessary C++, Python, and Java compilers right next to my Node.js server. 

**2. Running Code in the Background**
When a user submits code, my Node.js server creates the code files. Then, it uses a built-in tool called `child_process` to open a hidden terminal in the background to compile and run the code. Because it runs in the background, my main server stays completely free to handle other users logging in or clicking around.

**3. Stopping Infinite Loops**
If a user writes a bad `while(true)` loop, it normally freezes the server. To fix this, I added a strict 5-second timer. If the code takes too long, my server automatically kills that specific background process and tells the user 'Time Limit Exceeded' without crashing anything else.

**4. Secure Logins**
For logging in, I used JWT tokens. But instead of putting them in Local Storage where hackers can steal them, I saved them inside secure, hidden cookies. This protects the users from common web attacks."
---

## 3. How to Scale It (Bonus Points)

*If they ask: "How would you handle 10,000 users at the same time?"*

"Right now, my Node.js server does everything, which would be too slow for 10,000 users. If I needed to handle that many people, I would split the work up using a **Message Queue**, like Redis. 

The main server would just take the code and drop it into the queue. Then, I would have separate, dedicated 'Worker' servers that only pull code from the queue and compile it. This keeps the main website super fast while the heavy work happens somewhere else."
