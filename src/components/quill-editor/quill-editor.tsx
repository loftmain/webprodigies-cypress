"use client";
import { useAppState } from "@/lib/providers/state-provider";
import { File, Folder, workspace } from "@/lib/supabase/supabase.types";
import React, { useCallback, useMemo, useState } from "react";
import "quill/dist/quill.snow.css";
import { Button } from "../ui/button";
import {
  deleteFile,
  deleteFolder,
  updateFile,
  updateFolder,
  updateWorkspace,
} from "@/lib/supabase/queries";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import EmojiPicker from "../global/emoji-picker";
import BannerUpload from "../banner-upload/banner-upload";

interface QuillEditorProps {
  dirDetails: File | Folder | workspace;
  fileId: string;
  dirType: "workspace" | "folder" | "file";
}
var TOOLBAR_OPTIONS = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];

const dummyCollaborators: { id: string; email: string; avatarUrl: string }[] = [
  {
    id: "1",
    email: "johndoe@example.com",
    avatarUrl: "https://i.pravatar.cc/300?img=1",
  },
  {
    id: "2",
    email: "janedoe@example.com",
    avatarUrl: "https://i.pravatar.cc/300?img=2",
  },
  {
    id: "3",
    email: "peterparker@example.com",
    avatarUrl: "https://i.pravatar.cc/300?img=3",
  },
  {
    id: "4",
    email: "brucewayne@example.com",
    avatarUrl: "https://i.pravatar.cc/300?img=4",
  },
  {
    id: "5",
    email: "clarkkent@example.com",
    avatarUrl: "https://i.pravatar.cc/300?img=5",
  },
];

const QuillEditor: React.FC<QuillEditorProps> = ({
  dirDetails,
  fileId,
  dirType,
}) => {
  const supabase = createClient();
  const { state, workspaceId, folderId, dispatch } = useAppState();
  const pathname = usePathname();
  const [quill, setQuill] = useState<any>(null);
  const [collaborators, setCollaborators] =
    useState<{ id: string; email: string; avatarUrl: string }[]>(
      dummyCollaborators
    );
  const [saving, setSaving] = useState(false);

  const details = useMemo(() => {
    let selectedDir;
    if (dirType === "file") {
      selectedDir = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === folderId)
        ?.files.find((file) => file.id === fileId);
    }
    if (dirType === "folder") {
      selectedDir = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === fileId);
    }
    if (dirType === "workspace") {
      selectedDir = state.workspaces.find(
        (workspace) => workspace.id === fileId
      );
    }

    if (selectedDir) {
      return selectedDir;
    }

    return {
      title: dirDetails.title,
      iconId: dirDetails.iconId,
      createdAt: dirDetails.createdAt,
      data: dirDetails.data,
      inTrash: dirDetails.inTrash,
      bannerUrl: dirDetails.bannerUrl,
    } as workspace | Folder | File;
  }, [state, workspaceId, folderId]);

  const breadCrumbs = useMemo(() => {
    if (!pathname || !state.workspaces || !workspaceId) return;
    const segments = pathname
      .split("/")
      .filter((val) => val !== "dashboard" && val);
    const workspaceDetails = state.workspaces.find(
      (workspace) => workspace.id === workspaceId
    );
    const workspaceBreadCrumb = workspaceDetails
      ? `${workspaceDetails.iconId} ${workspaceDetails.title}`
      : "";
    if (segments.length === 1) {
      return workspaceBreadCrumb;
    }

    const folderSegment = segments[1];
    const folderDetails = workspaceDetails?.folders.find(
      (folder) => folder.id === folderSegment
    );
    const folderBreadCrumb = folderDetails
      ? `/ ${folderDetails.iconId} ${folderDetails.title}`
      : "";
    if (segments.length === 2) {
      return `${workspaceBreadCrumb} ${folderBreadCrumb}`;
    }

    const fileSegment = segments[2];
    const fileDetails = folderDetails?.files.find(
      (file) => file.id === fileSegment
    );
    const fileBreadCrumb = fileDetails
      ? `/ ${fileDetails.iconId} ${fileDetails.title}`
      : "";
    if (segments.length === 3) {
      return `${workspaceBreadCrumb} ${folderBreadCrumb} ${fileBreadCrumb}`;
    }
  }, [state, pathname, workspaceId]);

  //
  const wrapperRef = useCallback((wrapper: HTMLDivElement | null) => {
    if (typeof window !== "undefined") {
      if (wrapper === null) return;
      wrapper.innerHTML = "";
      const editor = document.createElement("div");
      wrapper.append(editor);

      // useCallback은  async/await 을 지원하지 않음..
      import("quill").then((Quill) => {
        const q = new Quill.default(editor, {
          theme: "snow",
          modules: {
            toolbar: TOOLBAR_OPTIONS,
            // WIP cursors
          },
        });
        setQuill(q);
      });
    }
  }, []);

  // TODO: 폴더의 하위 파일 restore 되도록 기능 개선해보기
  const restoreFileHandler = async () => {
    if (dirType === "file") {
      if (!workspaceId || !folderId) return;
      dispatch({
        type: "UPDATE_FILE",
        payload: { workspaceId, folderId, fileId, file: { inTrash: "" } },
      });
      await updateFile({ inTrash: "" }, fileId);
    }
    if (dirType === "folder") {
      if (!workspaceId) return;
      dispatch({
        type: "UPDATE_FOLDER",
        payload: { workspaceId, folderId: fileId, folder: { inTrash: "" } },
      });
      await updateFolder({ inTrash: "" }, fileId);
    }
  };

  // TODO: 폴더의 하위 파일도 같이 delete 되도록 기능 개선해보기
  const deleteFileHandler = async () => {
    if (dirType === "file") {
      if (!workspaceId || !folderId) return;
      dispatch({
        type: "DELETE_FILE",
        payload: { workspaceId, folderId, fileId },
      });
      await deleteFile(fileId);
    }
    if (dirType === "folder") {
      if (!workspaceId) return;
      dispatch({
        type: "DELETE_FOLDER",
        payload: { workspaceId, folderId: fileId },
      });
      await deleteFolder(fileId);
    }
  };

  const iconOnChange = async (icon: string) => {
    if (!fileId) return;
    if (dirType === "workspace") {
      dispatch({
        type: "UPDATE_WORKSPACE",
        payload: { workspace: { iconId: icon }, workspaceId: fileId },
      });
      await updateWorkspace({ iconId: icon }, fileId);
    }
    if (dirType === "folder") {
      if (!workspaceId) return;
      dispatch({
        type: "UPDATE_FOLDER",
        payload: {
          folder: { iconId: icon },
          workspaceId: workspaceId,
          folderId: fileId,
        },
      });
      await updateFolder({ iconId: icon }, fileId);
    }
    if (dirType === "file") {
      if (!workspaceId || !folderId) return;
      dispatch({
        type: "UPDATE_FILE",
        payload: {
          file: { iconId: icon },
          fileId,
          folderId: folderId,
          workspaceId: workspaceId,
        },
      });
      await updateFile({ iconId: icon }, fileId);
    }
  };

  return (
    <>
      <div className="relative">
        {details.inTrash && (
          <article
            className="
        py-2 z-40 bg-[#EB5757] flex md:flex-row flex-col justify-center items-center gap-4 flex-wrap"
          >
            <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
              <span className="text-white">
                This {dirType} is in the trash.
              </span>
              <Button
                size="sm"
                variant={"outline"}
                className="bg-transparent border-white text-white hover:bg-white hover:text-[#EB5757]"
                onClick={restoreFileHandler}
              >
                Restore
              </Button>
              <Button
                size="sm"
                variant={"outline"}
                className="bg-transparent border-white text-white hover:bg-white hover:text-[#EB5757]"
                onClick={deleteFileHandler}
              >
                Delete
              </Button>
            </div>
            <span className="text-sm text-white">{details.inTrash}</span>
          </article>
        )}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-between justify-center sm:items-center sm:p-2 p-8">
          <div>{breadCrumbs}</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center h-10">
              {collaborators?.map((collaborator) => (
                <TooltipProvider key={collaborator.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="-ml-3 bg-background border-2 flex items-center justify-center border-white h-8 w-8 rounded-full">
                        <AvatarImage
                          src={
                            collaborator.avatarUrl ? collaborator.avatarUrl : ""
                          }
                          className="rounded-full"
                        />
                        <AvatarFallback>
                          {collaborator.email.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>User name</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
            {saving ? (
              <Badge
                variant={"secondary"}
                className="bg-orange-600 top-4 text-white right-4 z-50"
              >
                Saving...
              </Badge>
            ) : (
              <Badge
                variant={"secondary"}
                className="bg-emerald-600 top-4 text-white right-4 z-50"
              >
                Saved
              </Badge>
            )}
          </div>
        </div>
      </div>
      {details.bannerUrl && (
        <>
          <div className="relative w-full h-[200px]">
            <Image
              src={
                supabase.storage
                  .from("file-banners")
                  .getPublicUrl(details.bannerUrl).data.publicUrl
                // "/BannerImage.png"
              }
              fill
              className="w-full md:h-48 h-20 object-cover"
              alt="Banner Image"
            />
          </div>
        </>
      )}

      <div className="flex justify-center items-center flex-col mt-2 relative">
        <div className="w-full self-center max-w-[800px] flex flex-col px-7 lg:my-8">
          <div className="text-[80px]">
            <EmojiPicker getValue={iconOnChange}>
              <div
                className="w-[100px] cursor-pointer transition-colors h-[100px] flex items-center
                justify-center hover:bg-muted rounded-xl"
              >
                {details.iconId}
              </div>
            </EmojiPicker>
          </div>
          <div className="flex">
            <BannerUpload
              details={details}
              id={fileId}
              dirType={dirType}
              className="mt-2 text-sm text-muted-foreground p-2 hover:text-card-foreground transition-all rounded-md"
            >
              {details.bannerUrl ? "Update Banner" : "Add Banner"}
            </BannerUpload>
            {details.bannerUrl && (
              <Button
                variant={"ghost"}
                className="gap-2 hover:bg-background flex items-center justify-center mt-2 text-sm text-muted-foreground w-36 p-2 rounded-md"
              >
                Remove Banner
              </Button>
            )}
          </div>
        </div>
        <div id="container" className="max-w-[800]" ref={wrapperRef}></div>
      </div>
    </>
  );
};

export default QuillEditor;
