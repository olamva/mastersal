import { once } from "node:events";
import { createServer } from "node:net";

const server = createServer();
server.listen(Number(process.env.VITE_PORT ?? 5173), "127.0.0.1");
await once(server, "listening");
await new Promise<void>((resolve, reject) =>
  server.close((error) => (error ? reject(error) : resolve())),
);
