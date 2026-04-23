import Docker from 'dockerode';
import os from 'os';

// Prüfen, ob wir auf Windows oder Linux sind
const isWindows = os.platform() === 'win32';

const docker = new Docker(
    isWindows 
        ? { socketPath: '//./pipe/docker_engine' } // Pfad für Windows Docker Desktop
        : { socketPath: '/var/run/docker.sock' }   // Pfad für Linux/Raspberry Pi
);

// WICHTIG: Der Container-Name muss exakt so sein, wie er in Docker Desktop angezeigt wird
const CONTAINER_NAME = 'Gibb-Server'; 

export const controlServer = async (action: 'start' | 'stop' | 'restart') => {
    try {
        const container = docker.getContainer(CONTAINER_NAME);
        switch (action) {
            case 'start':
                await container.start();
                return "Server wird gestartet...";
            case 'stop':
                await container.stop();
                return "Server wird gestoppt...";
            case 'restart':
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
            timestamps: false
        });

        // Bereinigt die Docker-Header-Daten
        return logsBuffer.toString('utf8').replace(/[\x00-\x1F\x7F-\x9F]/g, "").trim();
    } catch (err: any) {
        throw new Error(`Logs konnten nicht gelesen werden: ${err.message}`);
    }
};