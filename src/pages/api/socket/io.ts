import { NextApiResponseServerIo } from "@/lib/types";
import { Server as NetServer } from "http";
import { Server as ServerIO } from "socket.io";
import { NextApiRequest } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  console.log("ioHandler");
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path,
      addTrailingSlash: false,
    });
    // listener and connection
    io.on("connection", (s) => {
      console.log("IO Connection");
      s.on("create-room", (fileId) => {
        console.log("CREATE ROOM : ");
        s.join(fileId);
      });

      s.on("send-change-text", (fileId) => {
        console.log("SEND-CHANGE-TEXT");
      });

      // deltas: 데이터?
      s.on("send-changes", (deltas, fileId) => {
        console.log("CHANGE!");
        //s.to(fileId).emit("receive-changes", deltas, fileId); // emit: emit에 해당하는 부분을 호출시킴?
      });

      //range: part of deltas, diffrent format
      s.on("send-cursor-move", (range, fileId, cursorId) => {
        s.to(fileId).emit("receive-cursor-move", range, fileId, cursorId);
      });
    });
    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
