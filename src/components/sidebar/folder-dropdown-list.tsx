"use client";
import { appFoldersType, useAppState } from "@/lib/providers/state-provider";
import { Folder } from "@/lib/supabase/supabase.types";
import React, { useEffect, useState } from "react";
import ToolTipComponent from "../global/tooltip-component";
import { PlusIcon } from "lucide-react";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { v4 } from "uuid";
import { createFolder } from "@/lib/supabase/queries";
import { useToast } from "@/hooks/use-toast";
import { Accordion } from "../ui/accordion";
import Dropdown from "./Dropdown";

interface FolderDropdownListProps {
  workspaceFolders: Folder[];
  workspaceId: string;
}

const FolderDropdownList: React.FC<FolderDropdownListProps> = ({
  workspaceFolders,
  workspaceId,
}) => {
  //WIP local state folders
  //WIP Set real time updates
  const { state, dispatch, folderId } = useAppState();
  const { toast } = useToast();
  const [folders, setFolders] = useState(workspaceFolders);
  const { subscription } = useSupabaseUser();

  //effect set inital state server app state
  useEffect(() => {
    if (workspaceFolders.length > 0) {
      const mappedFolders: appFoldersType[] = workspaceFolders.map(
        (folder) => ({
          ...folder,
          files:
            state.workspaces
              .find((workspace) => workspace.id === workspaceId)
              ?.folders.find((f) => f.id === folder.id)?.files || [],
        })
      );
      dispatch({
        type: "SET_FOLDERS",
        payload: {
          workspaceId,
          folders: mappedFolders,
        },
      });
    }
  }, [workspaceFolders, workspaceId]);

  //state
  useEffect(() => {
    setFolders(
      state.workspaces.find((workspace) => workspace.id === workspaceId)
        ?.folders || []
    );
  }, [state, workspaceId]);

  //add folder
  const addFolderHandler = async () => {
    //if (folders.length >= 3 && !subscription) {
    //}

    const newFolder: Folder = {
      data: null,
      id: v4(),
      createdAt: new Date().toISOString(),
      workspaceId,
      title: "Untitled",
      iconId: "📄",
      inTrash: null,
      bannerUrl: "",
    };
    dispatch({
      type: "ADD_FOLDER",
      payload: { workspaceId, folder: { ...newFolder, files: [] } },
    });
    const { data, error } = await createFolder(newFolder);
    if (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Could not create the folder",
      });
    } else {
      toast({
        title: "Success",
        description: "Created folder.",
      });
    }
  };
  return (
    <>
      <div
        className="flex 
        sticky 
        z-20 
        top-0 
        bg-background 
        w-full 
        h-10 
        group/title 
        justify-between 
        items-cetner 
        pr-4 
        text-Neutrals/neutrals-8"
      >
        <span className="text-Neutrals/neutrals-8 font-blod text-sm">
          FOLDERS
        </span>
        <ToolTipComponent message="Create Folder">
          <PlusIcon
            onClick={addFolderHandler}
            size={16}
            className="group-hover/title:inline-block hidden cursor-pointer hover:dark:text-white"
          />
        </ToolTipComponent>
      </div>
      <Accordion
        type="multiple"
        defaultValue={[folderId || ""]}
        className="pb-20"
      >
        {folders
          .filter((folder) => !folder.inTrash)
          .map((folder) => (
            <Dropdown
              key={folder.id}
              title={folder.title}
              listType="folder"
              id={folder.id}
              iconId={folder.iconId}
            />
          ))}
      </Accordion>
    </>
  );
};

export default FolderDropdownList;
