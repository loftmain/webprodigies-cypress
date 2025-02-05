"use client";
import { useAppState } from "@/lib/providers/state-provider";
import { Folder } from "@/lib/supabase/supabase.types";
import React, { useEffect, useState } from "react";

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
  const { state, dispatch } = useAppState();
  const [folders, setFolders] = useState();

  //effect set inital state server app state
  useEffect(() => {
    if (workspaceFolders.length > 0) {
      dispatch({
        type: "SET_FOLDERS",
        payload: {
          workspaceId,
          folders: workspaceFolders.map((folder) => ({
            ...folder,
            files:
              state.workspaces
                .find((workspace) => workspace.id === workspaceId)
                ?.folders.find((f) => f.id === folder.id)?.files || [],
          })),
        },
      });
    }
  }, [workspaceFolders, workspaceId]);

  //state

  //add folder

  return <div>FolderDropdownList</div>;
};

export default FolderDropdownList;
