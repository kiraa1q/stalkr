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