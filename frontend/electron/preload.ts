/**
 * Clara AI Browser — Electron preload script.
 *
 * Exposes a secure bridge between the renderer process and the main process.
 * Voice command and native file-system APIs can be added here in future.
 */

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("clara", {
  platform: process.platform,

  send: (channel: string, data: unknown) => {
    const allowedChannels = ["navigate", "ai-command", "voice-toggle"];
    if (allowedChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },

  receive: (channel: string, callback: (...args: unknown[]) => void) => {
    const allowedChannels = ["navigation-result", "ai-response", "voice-result"];
    if (allowedChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => callback(...args));
    }
  },
});
