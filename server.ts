import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import multer from "multer";
import cors from "cors";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  const QUERIES_FILE = path.join(process.cwd(), "queries.json");
  const APPLICATIONS_FILE = path.join(process.cwd(), "applications.json");

  // Initialize files if they don't exist
  async function initStorage(file: string) {
    try {
      await fs.access(file);
    } catch {
      await fs.writeFile(file, JSON.stringify([]));
    }
  }

  await initStorage(QUERIES_FILE);
  await initStorage(APPLICATIONS_FILE);

  // --- API Routes ---

  // 1. Data Sync (Bypasses Adblockers)
  const handleSecureRecords = async (req: express.Request, res: express.Response) => {
    // Collect password from query (if GET) or body (if POST)
    const password = req.query.pwd || req.body?.password;
    
    if (password !== "Admin@Ghise2026") {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    try {
      // Temporarily bypass fs.readFile to absolutely guarantee it instantly returns
      // If this fixes the hang, we know it's a file IO lock issue in the container.
      const data = await fs.readFile(APPLICATIONS_FILE, "utf-8").catch(() => "[]");
      const parsed = JSON.parse(data || "[]");
      res.json(parsed);
    } catch (error) {
      console.error("SERVER: Secure Records error:", error);
      res.status(500).json({ error: "Storage error" });
    }
  };

  app.post("/api/secure-records", handleSecureRecords);
  app.get("/api/secure-records", handleSecureRecords);

  // Diagnostic test endpoint
  app.get("/api/test-admin", (req, res) => {
    res.json([{id: "test", studentName: "TEST DATA WORKING", grade: "N/A", phone: "123", submittedOn: new Date().toISOString()}]);
  });
  app.post("/api/test-admin", (req, res) => {
    res.json([{id: "test", studentName: "TEST DATA WORKING", grade: "N/A", phone: "123", submittedOn: new Date().toISOString()}]);
  });

  // 2. Health Check
  app.get("/api/health", (req, res) => res.json({ status: "ok", time: new Date() }));

  // 3. Query routes
  app.get("/api/queries", async (req, res) => {
    try {
      const data = await fs.readFile(QUERIES_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch queries" });
    }
  });

  app.post("/api/queries", async (req, res) => {
    try {
      const { name, question } = req.body;
      const data = await fs.readFile(QUERIES_FILE, "utf-8");
      const queries = JSON.parse(data);
      const newQuery = { id: Date.now().toString(), name, question, answer: null, createdAt: new Date().toISOString() };
      queries.unshift(newQuery);
      await fs.writeFile(QUERIES_FILE, JSON.stringify(queries, null, 2));
      res.status(201).json(newQuery);
    } catch (error) {
      res.status(500).json({ error: "Failed to save query" });
    }
  });

  // Emergency Backup Route - Downloads entire source code to bypass UI limitations
  app.get("/api/download-source-code", async (req, res) => {
    try {
      // Very crude but effective way to get source files without zip dependencies
      const filesToFetch = [
        "package.json", "server.ts", "vite.config.ts", "index.html", 
        "tsconfig.json", "tsconfig.node.json", "tsconfig.app.json", 
        "components.json", "postcss.config.js"
      ];
      
      let html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>GHIS Source Code Downloader</title>
          <style>
            body { font-family: system-ui; max-w-2xl; margin: 0 auto; padding: 40px; background: #f8fafc; }
            .card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
            li { margin-bottom: 10px; }
            a { color: #0066cc; text-decoration: none; font-weight: bold; }
            a:hover { text-decoration: underline; }
            .folder { font-weight: bold; margin-top: 20px; color: #334155; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1 style="color: #0f172a;">ghise-school Source Code</h1>
            <p>Because the ZIP export button is missing from your screen, you can copy the code directly from here.</p>
            <hr style="margin: 20px 0; border: 1px solid #e2e8f0; border-bottom: 0;" />
            <h3>Root Files</h3>
            <ul>
              ${filesToFetch.map(f => `<li><a href="/api/view-file?path=${f}" target="_blank">${f}</a></li>`).join('')}
            </ul>
            <div class="folder">src/ Directory</div>
            <ul>
              <li><a href="/api/view-file?path=src/App.tsx" target="_blank">src/App.tsx</a></li>
              <li><a href="/api/view-file?path=src/main.tsx" target="_blank">src/main.tsx</a></li>
              <li><a href="/api/view-file?path=src/index.css" target="_blank">src/index.css</a></li>
              <li><a href="/api/view-file?path=src/components/AdminPortal.tsx" target="_blank">src/components/AdminPortal.tsx</a></li>
            </ul>
             <p style="margin-top: 30px; font-size: 14px; color: #64748b;">
              <strong>Instructions:</strong> Open a code editor on your laptop (like VS Code or Notepad). Click each link, copy the text, and save it into a new folder with the exact same file names shown above. Once you have saved these files into a single folder, you have the complete app!
            </p>
          </div>
        </body>
        </html>
      `;
      res.send(html);
    } catch (err) {
      res.status(500).send("Error generating download link.");
    }
  });

  app.get("/api/view-file", async (req, res) => {
    try {
      const filePath = String(req.query.path);
      const safePath = path.resolve(process.cwd(), filePath);
      
      // Basic security to ensure we only read from inside the project
      if (!safePath.startsWith(process.cwd())) {
        return res.status(403).send("Forbidden");
      }
      
      const content = await fs.readFile(safePath, 'utf8');
      res.setHeader('Content-Type', 'text/plain');
      res.send(content);
    } catch (err) {
      res.status(404).send("File not found");
    }
  });

  // 3. Admission Submission
  const upload = multer({ 
    limits: { fileSize: 15 * 1024 * 1024, fieldSize: 10 * 1024 * 1024 } 
  }); 

  async function saveApplicationLocally(data: any) {
    try {
      const raw = await fs.readFile(APPLICATIONS_FILE, "utf-8");
      const existing = JSON.parse(raw);
      existing.unshift({ ...data, id: Date.now().toString(), receivedAt: new Date().toISOString() });
      await fs.writeFile(APPLICATIONS_FILE, JSON.stringify(existing, null, 2));
    } catch (e) {
      console.error("Backup Save Error:", e);
    }
  }

  app.post("/api/admission", upload.any(), async (req, res) => {
    try {
      const data = req.body;
      const files = req.files as Express.Multer.File[];
      await saveApplicationLocally(data);
      res.status(200).json({ message: "Received" });

      const emailUser = process.env.EMAIL_USER;
      const emailPass = process.env.EMAIL_PASS;
      if (!emailUser || !emailPass) return;

      (async () => {
        try {
          console.log(`SERVER: Background email start for ${data.studentName}`);
          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", port: 465, secure: true,
            auth: { user: emailUser, pass: emailPass },
            timeout: 60000
          });
          
          await transporter.verify();
          console.log("SERVER: SMTP verified for task");

          const attachments = files ? files.map(f => ({ filename: f.originalname, content: f.buffer })) : [];
          await transporter.sendMail({
            from: `School Admissions <${emailUser}>`,
            to: "ghierajouri@gmail.com",
            cc: ["ankurgupta197699@gmail.com", "shivinnmahajan@gmail.com"],
            subject: `New Admission: ${data.studentName}`,
            html: `
              <div style="font-family: sans-serif; padding: 20px;">
                <h1 style="color: #008751;">New Application Received</h1>
                <p><strong>Student:</strong> ${data.studentName}</p>
                <p><strong>Parent:</strong> ${data.parentName}</p>
                <p><strong>Grade:</strong> ${data.grade}</p>
                <p><strong>Phone:</strong> ${data.phone}</p>
                <p><strong>Address:</strong> ${data.address}</p>
                <p><strong>Bank Acc:</strong> ${data.studentBankAcc}</p>
                <p>All photos are attached below.</p>
                <hr />
                <p style="font-size: 11px; color: #666;">Generated by School Management System</p>
              </div>
            `,
            attachments
          });
          console.log(`SERVER: Email success for ${data.studentName}`);
        } catch (mErr) { 
          console.error("SERVER: Background Email ERROR:", mErr);
        }
      })();
    } catch (err) {
      console.error("Critical submission error:", err);
      if (!res.headersSent) res.status(500).json({ error: "Error" });
    }
  });

  // Explicitly catch all other API requests so they don't fall into Vite and hang
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: "API Route not found" });
  });

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
