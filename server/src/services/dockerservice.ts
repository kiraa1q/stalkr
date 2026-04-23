import Docker from "dockerode";
import os from "os";

// Prüfen, ob wir auf Windows oder Linux sind
const isWindows = os.platform() === "win32";

const docker = new Docker(
  isWindows
    ? { socketPath: "//./pipe/docker_engine" } // Pfad für Windows Docker Desktop
    : { socketPath: "/var/run/docker.sock" }, // Pfad für Linux/Raspberry Pi
);

// WICHTIG: Der Container-Name muss exakt so sein, wie er in Docker Desktop angezeigt wird
const CONTAINER_NAME = "Gibb-Server";

export const controlServer = async (action: "start" | "stop" | "restart") => {
  try {
    const container = docker.getContainer(CONTAINER_NAME);
    switch (action) {
      case "start":
        await container.start();
        return "Server wird gestartet...";
      case "stop":
        await container.stop();
        return "Server wird gestoppt...";
      case "restart":
        await container.restart();
        return "Server wird neu gestartet...";
    }
  } catch (err: any) {
    throw new Error(`Docker Fehler: ${err.message}`);
  }
};

export const getServerLogs = async () => {
  try {
    const container = docker.getContainer(CONTAINER_NAME);
    const logsBuffer = await container.logs({
      stdout: true,
      stderr: true,
      tail: 50,
      timestamps: false,
    });

    const rawContent = logsBuffer.toString("utf8");

    // Wir splitten jetzt nach:
    // \r\n (Windows), \n (Linux) oder \r (Mac)
    const logLines = rawContent
      .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, "") // Nur Steuerzeichen entfernen, NICHT \n oder \r
      .split(/\r?\n|\r/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    return logLines;
  } catch (err: any) {
    throw new Error(`Logs fehlgeschlagen: ${err.message}`);
  }
};

export const getContainerStats = async () => {
    try {
        const container = docker.getContainer(CONTAINER_NAME);
        // Wir holen die Stats einmalig (stream: false)
        const stats = await container.stats({ stream: false });

        // Docker gibt den Wert in Bytes an, wir rechnen in GB um
        const usedBytes = stats.memory_stats.usage || 0;
        const limitBytes = stats.memory_stats.limit || 0;

        const usedGB = (usedBytes / (1024 * 1024 * 1024)).toFixed(2);
        const maxGB = (limitBytes / (1024 * 1024 * 1024)).toFixed(2);

        return {
            used: usedGB,
            max: maxGB
        };
    } catch (err) {
        console.error("Docker Stats Fehler:", err);
        return { used: "0", max: "0" };
    }
};