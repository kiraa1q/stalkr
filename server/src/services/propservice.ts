import fs from 'fs';
import path from 'path';

// Wir nutzen den Pfad aus der .env Datei. 
// Falls MC_VOLUME_PATH nicht gesetzt ist, nehmen wir einen Fallback-Pfad.
const MC_DIR = process.env.MC_VOLUME_PATH || '../../minecraft';
const PROPS_PATH = path.join(MC_DIR, 'server.properties');

export const readProperties = () => {
    // Kurzer Check, ob die Datei überhaupt existiert
    if (!fs.existsSync(PROPS_PATH)) {
        console.error(`Properties-Datei nicht gefunden unter: ${PROPS_PATH}`);
        return {};
    }

    const data = fs.readFileSync(PROPS_PATH, 'utf-8');
    const props: Record<string, string> = {};

    data.split('\n').forEach(line => {
        // Kommentare und leere Zeilen ignorieren
        if (line.startsWith('#') || line.trim() === '' || !line.includes('=')) return;
        
        const [key, ...valueParts] = line.split('=');
        props[key.trim()] = valueParts.join('=').trim();
    });

    return props;
};

export const writeProperties = (newProps: Record<string, string>) => {
    // Wir bauen den Dateiinhalt neu auf
    let content = "#Modified by stalkr Dashboard\n#" + new Date().toLocaleString() + "\n";
    
    for (const [key, value] of Object.entries(newProps)) {
        content += `${key}=${value}\n`;
    }

    fs.writeFileSync(PROPS_PATH, content, 'utf-8');
    console.log(`Erfolgreich gespeichert in: ${PROPS_PATH}`);
};