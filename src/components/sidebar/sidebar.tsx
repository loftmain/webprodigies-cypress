import {
  getCollaboratingWorkspaces,
  getFolders,
  getPrivateWorkspaces,
  getSharedWorkspaces,
  getUserSubscrptionStatus,
} from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import { twMerge } from "tailwind-merge";
import WorkspaceDropdown from "./workspace-dropdown";
import PlanUsage from "./plan-usage";
import NativeNavigation from "./native-navigation";
import { ScrollArea } from "../ui/scroll-area";
import FolderDropdownList from "./folder-dropdown-list";

interface SidebarProps {
  params: { workspaceId: string };
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = async ({ params, className }) => {
  const supabase = await createClient();
  // user 유저체크
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;
  // subscr 구독 상태 체크
  const { data: subscriptionData, error: subscriptionError } =
    await getUserSubscrptionStatus(user.id);

  // folders 폴더 체크
  const { workspaceId } = await params;
  const { data: workspaceFolderData, error: foldersError } = await getFolders(
    workspaceId
  );
  // error 존재 여부 체크
  if (subscriptionError || foldersError) redirect("/dashboard");

  const [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces] =
    await Promise.all([
      getPrivateWorkspaces(user.id),
      getCollaboratingWorkspaces(user.id),
      getSharedWorkspaces(user.id),
    ]);

  // get all the different workspace private collaborating shared
  return (
    <aside
      className={twMerge(
        "hidden sm:flex sm:flex-col w-[280px] shrink-0 p-4 md:gap-4 !justify-between",
        className
      )}
    >
      <div>
        <WorkspaceDropdown
          privateWorkspaces={privateWorkspaces}
          collaboratingWorksaces={collaboratingWorkspaces}
          sharedWorkspaces={sharedWorkspaces}
          defaultValue={[
            ...privateWorkspaces,
            ...collaboratingWorkspaces,
            ...sharedWorkspaces,
          ].find((workspace) => workspace.id === workspaceId)}
        />
        <PlanUsage
          foldersLength={workspaceFolderData?.length || 0}
          subscription={subscriptionData}
        />
        <NativeNavigation myWorkspaceId={workspaceId} />
        <ScrollArea className="overflow-auto relative h-[450px]">
          <div
            className="pointer-events-none w-full absolute bottom-0 h-20 bg-gradient-to-t
          from-background to-transparent z-40"
          />
          <FolderDropdownList
            workspaceFolders={workspaceFolderData}
            workspaceId={workspaceId}
          />
        </ScrollArea>
      </div>
    </aside>
  );
};

export default Sidebar;
