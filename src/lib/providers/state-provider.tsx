"use client";

import {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { File, Folder, workspace } from "../supabase/supabase.types";
import { usePathname } from "next/navigation";

export type appFoldersType = Folder & { files: File[] | [] };
export type appWorkspacesType = workspace & {
  folders: appFoldersType[] | [];
};

interface AppState {
  workspaces: appWorkspacesType[] | [];
}

type Action =
  | { type: "ADD_WORKSPACE"; payload: appWorkspacesType }
  | { type: "DELETE_WORKSPACE"; payload: string };

const initalState: AppState = { workspaces: [] };

const appReducer = (
  state: AppState = initalState,
  action: Action
): AppState => {
  switch (action.type) {
    case "ADD_WORKSPACE":
      return {
        ...state,
        workspaces: [...state.workspaces, action.payload],
      };
    case "DELETE_WORKSPACE":
      return {
        ...state,
        workspaces: state.workspaces.filter(
          (workspace) => workspace.id !== action.payload
        ),
      };
    default:
      return initalState;
  }
};

const AppStateContext =
  createContext<
    | {
        state: AppState;
        dispatch: Dispatch<Action>;
        workspaceId: string | undefined;
        folderId: string | undefined;
        fileId: string | undefined;
      }
    | undefined
  >(undefined);

interface AppStateProviderProps {
  children: React.ReactNode;
}

const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initalState);
  const pathname = usePathname();

  const workspaceId = useMemo(() => {
    const urlSegments = pathname?.split("/").filter(Boolean);
    if (urlSegments) {
      if (urlSegments.length > 1) {
        return urlSegments[1];
      }
    }
  }, [pathname]);

  const folderId = useMemo(() => {
    const urlSegments = pathname?.split("/").filter(Boolean);
    if (urlSegments) {
      if (urlSegments.length > 2) {
        return urlSegments[2];
      }
    }
  }, [pathname]);

  const fileId = useMemo(() => {
    const urlSegments = pathname?.split("/").filter(Boolean);
    if (urlSegments) {
      if (urlSegments.length > 3) {
        return urlSegments[3];
      }
    }
  }, [pathname]);

  // useEffect(() => {}, [folderId, workspaceId]);

  useEffect(() => {
    console.log("App State Changed", state);
  }, [state]);

  return (
    <AppStateContext.Provider
      value={{ state, dispatch, workspaceId, folderId, fileId }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export default AppStateProvider;

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};
