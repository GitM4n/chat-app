import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL = import.meta.env.VITE_GLOBAL_PORT || "https://chat-srv.vercel.app/";


console.log(URL)
export const socket = io(URL, {
  autoConnect:false
});


