import { app, BrowserWindow, Notification, ipcMain } from "electron";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";

// MongoDB + models
import connectDb from "../lib/mongodb.js";
import Assignment from "../models/Assignment.js";
import Activity from "../models/Activity.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow: BrowserWindow | null = null;
let currentUser: string | null = null;

// ✅ Play sound helper
function playSound() {
  const soundPath = path.join(__dirname, "../assets/mixkit-digital-quick-tone-2866.wav"); 

  if (process.platform === "win32") {
    exec(`powershell -c (New-Object Media.SoundPlayer '${soundPath}').PlaySync();`);
  } else if (process.platform === "darwin") {
    exec(`afplay "${soundPath}"`);
  } else {
    exec(`aplay "${soundPath}"`);
  }
}

// ✅ Unified notification function
function showNotification(title: string, body: string) {
  new Notification({ title, body }).show();
  playSound();
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: join(__dirname, "../electron/preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (!app.isPackaged) {
    await mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    await mainWindow.loadURL("https://student-tracker-taupe.vercel.app");
  }
}

// ✅ Listen for user email from renderer
ipcMain.on("set-user", (_event, email: string) => {
  currentUser = email;
  console.log("🔐 User email set for notifications:", email);

  // Trigger immediate check when user logs in
  checkDeadlines();
});

// ✅ Listen for manual notifications from renderer
ipcMain.on("show-notification", (_event, { title, body }) => {
  console.log("📩 Notification request:", title, body);
  showNotification(title, body);
});

// ✅ Check both Assignments + Activities
async function checkDeadlines() {
  if (!currentUser) return;

  await connectDb();
  const now = new Date();
  const soon = new Date(now.getTime() + 1000 * 60 * 60 * 24); // next 24h

  console.log("⏰ Checking deadlines for:", currentUser);

  // --- Assignments ---
  const assignments = await Assignment.find({
    userEmail: currentUser,
    status: "Pending",
  }).lean();

  assignments.forEach((a) => {
    const due = new Date(a.dueDate);
    if (due >= now && due <= soon) {
      showNotification("📌 Assignment Due Soon", `${a.title} due on ${due.toLocaleString()}`);
    }
  });

  // --- Activities ---
  const activities = await Activity.find({
    userEmail: currentUser,
    status: "Pending",
  }).lean();

  activities.forEach((act) => {
    const due = new Date(act.dueDate);
    if (due >= now && due <= soon) {
      showNotification("📝 Activity Due Soon", `${act.title} (${act.course}) is pending - due ${due.toLocaleString()}`);
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  showNotification("Student Tracker Running", "Your Student Tracker app is running in the background 🚀");

  // Run check every 5 min
  setInterval(checkDeadlines, 1000 * 60 * 5);
});

if (process.platform === "win32") {
  app.setAppUserModelId("com.student-tracker.app");
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
