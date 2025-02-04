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
      dispatch({ type: "SET_FOLDERS", payload: workspaceFolders });
    }
  }, []);

  //state

  //add folder

  return <div>FolderDropdownList</div>;
};

export default FolderDropdownList;
