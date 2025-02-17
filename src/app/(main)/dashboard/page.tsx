import React from "react";

import db from "@/lib/supabase/db";
import { redirect } from "next/navigation";
import { getUserSubscrptionStatus } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import DashboardSetup from "@/components/dashboard-setup/dashboard-setup";

const DashboardPage = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const workspace = await db.query.workspaces.findFirst({
    where: (workspaces, { eq }) => eq(workspaces.workspaceOwner, user.id),
  });

  const { data: subscription, error: subscriptionError } =
    await getUserSubscrptionStatus(user.id);

  if (subscriptionError) return;

  if (!workspace) {
    return (
      <div className="bg-background h-screen w-screen flex justify-center items-center">
        <DashboardSetup
          user={user}
          subscription={subscription}
        ></DashboardSetup>
      </div>
    );
  }

  redirect(`/dashboard/${workspace.id}`);
};

export default DashboardPage;
