"use client";

import { useEffect, useState, useRef } from "react";
// Uvezi ikonice (proveri da li si uradio: npm install lucide-react)
import {
  MoveUp,
  MoveDown,
  MoveLeft,
  MoveRight,
  RotateCcw,
  RotateCw,
  Power,
  Activity,
  Terminal,
  ShieldCheck,
} from "lucide-react";

export default function YoloDashboard() {
  const [connected, setConnected] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  // 1. WebSocket Logika (Povezivanje na Raspberry Pi)
  useEffect(() => {
    const connect = () => {
      // IP adresa tvojeg Pi-a iz Mact.txt
      const ws = new WebSocket("ws://192.168.4.1:1606");
      socketRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        addLog("Sistem inicijalizovan. Veza uspostavljena.");
      };

      ws.onclose = () => {
        setConnected(false);
        addLog("Veza prekinuta. Ponovni pokušaj za 3s...");
        setTimeout(connect, 3000);
      };

      ws.onerror = () => addLog("Greška: Proveri IP adresu Pi-a.");
    };

    connect();
    return () => socketRef.current?.close();
  }, []);

  const sendCommand = (cmd: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(cmd);
      if (cmd !== "stop") addLog(`IZVRŠENO: ${cmd}`);
    }
  };

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString("sr-RS", { hour12: false });
    setLogs((prev) => [`[${time}] ${msg}`, ...prev].slice(0, 10));
  };

  // 2. Kontrole: WASD + Q/E (Tastatura)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (activeKey === key) return;

      let cmd = "";
      switch (key) {
        case "W":
          cmd = "napred";
          break;
        case "S":
          cmd = "nazad";
          break;
        case "A":
          cmd = "levo";
          break;
        case "D":
          cmd = "desno";
          break;
        case "Q":
          cmd = "rotiraj_levo";
          break;
        case "E":
          cmd = "rotiraj_desno";
          break;
      }

      if (cmd) {
        setActiveKey(key);
        sendCommand(cmd);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.toUpperCase() === activeKey) {
        setActiveKey(null);
        sendCommand("stop");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [activeKey]);

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-slate-200 font-sans selection:bg-cyan-500/30">
      {/* Background Blobs (Svelte dizajn) */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full"></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0f1a]/80 backdrop-blur-xl px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div
            className={`w-3 h-3 rounded-full ${connected ? "bg-cyan-400 animate-pulse" : "bg-red-500"}`}
          ></div>
          <span className="font-extrabold text-xl text-white tracking-tighter">
            YOLO{" "}
            <span className="text-cyan-400 text-sm tracking-widest uppercase ml-1">
              Control
            </span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] font-bold">
          <ShieldCheck size={14} className="text-cyan-400" /> SISTEM NOMINALAN
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Video & Logovi */}
        <div className="lg:col-span-8 space-y-6">
          <div className="relative aspect-video bg-slate-950 rounded-[40px] border border-white/10 shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <Activity size={48} className="animate-pulse" />
            </div>
            <div className="absolute top-6 left-6 flex gap-2">
              <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold">
                LIVE FEED
              </span>
            </div>
          </div>

          <div className="bg-[#111a2e]/50 backdrop-blur-md rounded-[30px] border border-white/5 p-6 shadow-inner">
            <div className="flex items-center gap-2 mb-3 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
              <Terminal size={14} /> Konzola
            </div>
            <div className="space-y-1 h-32 overflow-y-auto font-mono text-[13px]">
              {logs.map((log, i) => (
                <div
                  key={i}
                  className={
                    log.includes("IZVRŠENO")
                      ? "text-cyan-400"
                      : "text-slate-500"
                  }
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kontrole */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#111a2e]/50 backdrop-blur-xl rounded-[40px] p-8 border border-white/10 shadow-2xl text-center">
            <h3 className="text-white font-black text-sm uppercase tracking-widest mb-8">
              Upravljanje
            </h3>

            <div className="flex flex-col items-center gap-6">
              {/* WASD */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-start-2">
                  <ControlButton
                    icon={<MoveUp />}
                    active={activeKey === "W"}
                    onDown={() => sendCommand("napred")}
                    onUp={() => sendCommand("stop")}
                  />
                </div>
                <div className="col-start-1">
                  <ControlButton
                    icon={<MoveLeft />}
                    active={activeKey === "A"}
                    onDown={() => sendCommand("levo")}
                    onUp={() => sendCommand("stop")}
                  />
                </div>
                <div className="col-start-2">
                  <ControlButton
                    icon={<MoveDown />}
                    active={activeKey === "S"}
                    onDown={() => sendCommand("nazad")}
                    onUp={() => sendCommand("stop")}
                  />
                </div>
                <div className="col-start-3">
                  <ControlButton
                    icon={<MoveRight />}
                    active={activeKey === "D"}
                    onDown={() => sendCommand("desno")}
                    onUp={() => sendCommand("stop")}
                  />
                </div>
              </div>

              {/* Rotate (Q i E) */}
              <div className="flex gap-4 mt-2">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[9px] font-bold text-slate-500">
                    ROT L (Q)
                  </span>
                  <ControlButton
                    icon={<RotateCcw />}
                    active={activeKey === "Q"}
                    onDown={() => sendCommand("rotiraj_levo")}
                    onUp={() => sendCommand("stop")}
                    variant="cyan"
                  />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[9px] font-bold text-slate-500">
                    ROT R (E)
                  </span>
                  <ControlButton
                    icon={<RotateCw />}
                    active={activeKey === "E"}
                    onDown={() => sendCommand("rotiraj_desno")}
                    onUp={() => sendCommand("stop")}
                    variant="cyan"
                  />
                </div>
              </div>

              <button
                onMouseDown={() => sendCommand("emergency_stop")}
                className="w-full mt-4 py-4 rounded-[20px] bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black transition-all border border-red-500/20 active:scale-95"
              >
                STOP
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ControlButton({
  icon,
  active,
  onDown,
  onUp,
  variant = "default",
}: any) {
  const styles = active
    ? variant === "cyan"
      ? "bg-cyan-500 text-black border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
      : "bg-white text-black border-white shadow-xl"
    : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10";

  return (
    <button
      onMouseDown={onDown}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      onTouchStart={onDown}
      onTouchEnd={onUp}
      className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all border-2 active:scale-90 ${styles}`}
    >
      {icon}
    </button>
  );
}
