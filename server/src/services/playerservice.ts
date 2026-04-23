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

export const getWhitelist = async () => {
    // Über RCON die Whitelist abfragen
    const response = await getMcData("whitelist list");
    // Die Antwort sieht oft so aus: "There are 2 whitelisted players: player1, player2"
    return response;
};