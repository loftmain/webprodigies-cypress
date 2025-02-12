import { Socket, Server as NetServer } from "net";
import { Server as SocketIOServer } from "socket.io";
import { NextApiResponse } from "next";
import { z } from "zod";

// Login, Sign Up 에서 사용하는 Form Schema 구현
export const FormSchema = z.object({
  email: z.string().describe("Email").email({ message: "Invalid Email" }),
  password: z.string().describe("Password").min(1, "Password is required"),
});

// Create A Workspace에서 사용하는 Form Schema 구현
export const CreateWorkspaceFormSchema = z.object({
  workspaceName: z
    .string()
    .describe("Workspace Name")
    .min(1, "Workspace name must be min of 1 character"),
  logo: z.any(), // z.file을 사용할 경우 서버사이드 문제가 일어날 수 있다고 함.
});

export const UploadBannerFormSchema = z.object({
  banner: z
    .instanceof(FileList)
    .refine((file) => file?.length == 1, "Banner is requrired."),
});

// socket.io provider에 사용되는 type
export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
