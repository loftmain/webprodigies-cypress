"use client";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/lib/providers/state-provider";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { createClient } from "@/lib/supabase/client";
import { User } from "@/lib/supabase/supabase.types";
import { Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

const SettingsForm = () => {
  const { toast } = useToast();
  const { user } = useSupabaseUser();
  const router = useRouter();
  const supabase = createClient();
  const { state, workspaceId, dispatch } = useAppState();
  const [permissions, setPermissions] = useState("private");
  const [collaborators, setCollaborators] = useState<User[] | []>([]);
  const [openAlertMessage, setOpenAlertMessage] = useState(false);
  const [workspaceDetails, setWorkspaceDetails] = useState();
  const titleTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const [uploadProfilePic, setUploadProfilePic] = useState(false);
  //WIP PAYMENT PORTAL

  //addcollaborators
  //remove collaborators
  //onchange workspace title
  //on chagne

  //onClick

  //fetching avator details
  //get Workspace details
  //get all the collaborators
  //WIP Payment Portal redirect

  return (
    <div className="flex gap-4 flex-col">
      <p className="flex items-center gap-2 mt-6">
        <Briefcase size={20} />
        Workspace
      </p>
    </div>
  );
};

export default SettingsForm;
