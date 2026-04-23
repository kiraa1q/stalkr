import { getMcData } from './mcservice.js';

export const playerAction = async (action: string, playerName: string) => {
    // Validierung: Nur erlaubte Aktionen
    const allowedActions = ['whitelist add', 'whitelist remove', 'ban', 'pardon', 'op', 'deop'];
    
    // Wir mappen die Aktionen auf die richtigen MC-Befehle
    let command = "";
    switch(action) {
        case 'unban': command = `pardon ${playerName}`; break;
        default: command = `${action} ${playerName}`;
    }

    const response = await getMcData(command);
    return response;
};

export const getWhitelistArray = async () => {
    const response = await getMcData("whitelist list");
    console.log("RCON Raw Response:", response); // Schau in dein Terminal, was hier steht!

    // Falls die Whitelist leer ist oder eine Fehlermeldung kommt
    if (!response || response.toLowerCase().includes("no whitelisted players")) {
        return [];
    }

    // Wir suchen den Doppelpunkt. Falls keiner da ist, nehmen wir den ganzen Text
    const delimiter = response.includes(':') ? ':' : 'players ';
    const parts = response.split(delimiter);
    const namesString = parts.length > 1 ? parts[1] : parts[0];

    return namesString
        .split(',')
        .map(name => name.replace(/§[0-9a-fk-or]/gi, "").trim()) // Entfernt Minecraft Farb-Codes (§a, §b etc.)
        .filter(name => name.length > 0 && !name.includes("There are"));
};

export const getWhitelistWithStatus = async () => {
    // 1. Alle Daten parallel holen
    const [whitelistRaw, opsRaw, bansRaw] = await Promise.all([
        getMcData("whitelist list"),
        getMcData("ops"),
        getMcData("banlist players")
    ]);

    // Hilfsfunktion zum sauberen Extrahieren der Namen
    const parseNames = (raw: string) => {
        if (!raw || raw.toLowerCase().includes("no whitelisted") || raw.toLowerCase().includes("no entries")) return [];
        const parts = raw.split(':');
        const namesPart = parts.length > 1 ? parts[1] : parts[0];
        return namesPart.split(',').map(n => n.trim()).filter(n => n.length > 0);
    };

    const whitelistedNames = parseNames(whitelistRaw);
    const opNames = parseNames(opsRaw).map(n => n.toLowerCase());
    const bannedNames = parseNames(bansRaw).map(n => n.toLowerCase());

    // Wir geben ein Array von Objekten zurück
    return whitelistedNames.map(playerName => ({
        name: playerName, // <--- DAS ist der Schlüssel für das Frontend
        isOp: opNames.includes(playerName.toLowerCase()),
        isBanned: bannedNames.includes(playerName.toLowerCase())
    }));
};