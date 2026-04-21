import { Rcon } from "rcon-client";

export const getMcData = async (command: string) => {
  const rcon = await Rcon.connect({
    host: process.env.MC_HOST || "localhost",
    port: parseInt(process.env.MC_RCON_PORT || "25575"),
    password: process.env.MC_RCON_PASSWORD || "pass",
  });

  const response = await rcon.send(command);
  await rcon.end();
  return response;
};

export const getOnlinePlayers = async () => {
  const rawStatus = await getMcData("list");
  // Logik: Alles nach dem Doppelpunkt nehmen und bei Kommas trennen
  const playerString = rawStatus.split(":")[1] || "";
  return playerString.split(",").map(name => name.trim()).filter(name => name !== "");
};