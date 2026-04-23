import { useState } from "react";
import type { Player } from "../types";

interface Props {
  player: Player;
}

const ARMOR_SLOTS = ["helmet", "chestplate", "leggings", "boots"] as const;
const ARMOR_ICONS: Record<string, string> = {
  helmet: "https://minecraft.wiki/images/Invicon_Netherite_Helmet.png",
  chestplate: "https://minecraft.wiki/images/Invicon_Netherite_Chestplate.png",
  leggings: "https://minecraft.wiki/images/Invicon_Netherite_Leggings.png",
  boots: "https://minecraft.wiki/images/Invicon_Netherite_Boots.png",
};

export default function PlayerCard({ player }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`player-card ${open ? "open" : ""} ${!player.online ? "offline-card" : ""}`}
    >
      <div className="player-header" onClick={() => setOpen((o) => !o)}>
        <div className="player-avatar-sm">
          <img
            src={`https://mc-heads.net/avatar/${player.name}/36`}
            alt={player.name}
          />
        </div>
        <div className="player-info">
          <div
            className="player-name"
            style={!player.online ? { color: "var(--text-mid)" } : {}}
          >
            {player.name}
          </div>
          <div className="player-meta">
            <span
              className="gamemode-tag"
              style={!player.online ? { opacity: 0.5 } : {}}
            >
              {player.gamemode}
            </span>
            <span className="playtime-tag">{player.playtime} played</span>
          </div>
        </div>
        <div className="header-right">
          <div
            className={`online-badge ${player.online ? "online" : "offline"}`}
          >
            {player.online ? "ONLINE" : "OFFLINE"}
          </div>
          <div className="chevron">▼</div>
        </div>
      </div>

      <div className="player-body">
        <div className="player-body-inner">
          <div className="inv-panel">
            <div className="inv-left">
              <div className="armor-col">
                {ARMOR_SLOTS.map((slot) => {
                  const piece = player.armor.find((a) => a.slot === slot);
                  const isEmpty = !piece || piece.material === "none";

                  // Dynamische URL generieren: Wir nehmen das Material aus dem Backend
                  // Beispiel: minecraft:netherite_helmet -> Invicon_Netherite_Helmet.png
                  const materialName = !isEmpty
                    ? piece.material
                        .split(":")[1]
                        .split("_")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join("_")
                    : "";

                  const iconUrl = isEmpty
                    ? ARMOR_ICONS[slot] // Fallback auf deine Standard-Icons
                    : `https://minecraft.wiki/images/Invicon_${materialName}.png`;

                  return (
                    <div
                      key={slot}
                      className={`item-slot ${!isEmpty ? "has-item" : ""}`}
                      style={{
                        border: !isEmpty
                          ? "1px solid rgba(255,255,255,0.2)"
                          : "1px solid var(--border)",
                      }}
                    >
                      <img
                        src={iconUrl}
                        style={{
                          width: "32px",
                          height: "32px",
                          imageRendering: "pixelated",
                          opacity: isEmpty ? 0.2 : 1,
                        }}
                        alt={slot}
                      />
                    </div>
                  );
                })}
              </div>

              <div
                className="skin-3d"
                style={!player.online ? { opacity: 0.5 } : {}}
              >
                <img
                  src={`https://visage.surgeplay.com/full/256/${player.name}`}
                  alt={`${player.name} 3D`}
                />
              </div>
            </div>

            <div className="inv-right">
              <div className="vitals-grid">
                <div className="vital-box">
                  <div
                    className="vital-box-val"
                    style={{ color: "var(--red)" }}
                  >
                    {player.health}/20
                  </div>
                  <div className="vital-box-lbl">Health</div>
                </div>
                <div className="vital-box">
                  <div
                    className="vital-box-val"
                    style={{ color: "var(--yellow)" }}
                  >
                    {player.hunger}/20
                  </div>
                  <div className="vital-box-lbl">Hunger</div>
                </div>
                <div className="vital-box">
                  <div
                    className="vital-box-val"
                    style={{ color: "var(--green)" }}
                  >
                    Lv.{player.xp}
                  </div>
                  <div className="vital-box-lbl">XP</div>
                </div>
              </div>

              <div className="stats-row-mini">
                <div className="stat-mini">
                  <div className="stat-mini-val">{player.kills}</div>
                  <div className="stat-mini-lbl">Kills</div>
                </div>
                <div className="stat-mini">
                  <div className="stat-mini-val">{player.deaths}</div>
                  <div className="stat-mini-lbl">Deaths</div>
                </div>
                <div className="stat-mini">
                  <div className="stat-mini-val">
                    {player.distanceTraveled}km
                  </div>
                  <div className="stat-mini-lbl">Traveled</div>
                </div>
              </div>

              <div>
                <div className="inv-items-label">
                  {player.online ? "Inventory" : "Last Known Inventory"}
                </div>
                <div className="inv-items">
                  {player.inventory.map((item, i) => (
                    <div key={i} className="inv-item">
                      {item.name}
                      <span className="inv-count">×{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="coords-footer">
        <div className="coords-label">
          {player.position.dimension}
          {!player.online && player.lastSeen
            ? ` · Last seen ${player.lastSeen}`
            : ""}
        </div>
        <div className="coords-value">
          <div className="coord">
            <span className="coord-axis">X</span> {player.position.x}
          </div>
          <div className="coord">
            <span className="coord-axis">Y</span> {player.position.y}
          </div>
          <div className="coord">
            <span className="coord-axis">Z</span> {player.position.z}
          </div>
        </div>
      </div>
    </div>
  );
}
