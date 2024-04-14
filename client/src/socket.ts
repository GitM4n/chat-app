import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.GLOBAL_PORT || "http://localhost:5000";

export const socket = io(URL, {
  autoConnect:false
});


