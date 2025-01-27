"use client";

import { AuthUser } from "@supabase/supabase-js";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import EmojiPicker from "../global/emoji-picker";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { subscription } from "@/lib/supabase/supabase.types";
import { CreateWorkspaceFormSchema } from "@/lib/types";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import Loader from "../global/Loader";

interface DashboardSetupProps {
  user: AuthUser;
  subscription: subscription | null;
}

const DashboardSetup: React.FC<DashboardSetupProps> = ({
  subscription,
  user,
}) => {
  const [selectedEmoji, setSelectedEmoji] = React.useState("💼");
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting: isLoading, errors },
  } = useForm<z.infer<typeof CreateWorkspaceFormSchema>>({
    mode: "onChange",
    defaultValues: {
      logo: "",
      workspaceName: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof CreateWorkspaceFormSchema>> = (
    value
  ) => {
    const file = value.logo?.[0];
    console.log(file);
    console.log("value :>> " + value);
    reset();
  };

  const onValid = (data) => console.log(data, "onValid");

  return (
    <Card className="w-[800px] h-screen sm:h-auto">
      <CardHeader>
        <CardTitle>Create A Workspace</CardTitle>
        <CardDescription>
          Let&apos;s create a private workspace to get you started. You can add
          collaborations later from the workspace settings tab.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={() => {
            handleSubmit(onValid);
          }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="text-5xl">
                <EmojiPicker getValue={(emoji) => setSelectedEmoji(emoji)}>
                  {selectedEmoji}
                </EmojiPicker>
              </div>
              <div className="w-full">
                <Label
                  htmlFor="workspaceName"
                  className="text-sm text-muted-foreground"
                >
                  Name
                </Label>
                <Input
                  id="worspaceName"
                  type="text"
                  placeholder="Workspace Name"
                  disabled={isLoading}
                  {...register("workspaceName", {
                    required: "Workspace name is required",
                  })}
                />
                <small className="text-red-600">
                  {errors?.workspaceName?.message?.toString()}
                </small>
              </div>
            </div>
            <div>
              <Label htmlFor="logo" className="text-sm text-muted-foreground">
                Workspace Logo
              </Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                placeholder="Workspace Logo"
                //disabled={isLoading || subscription?.status !== "active"}
                {...register("logo", {
                  required: false,
                })}
              />
              <small className="text-red-600">
                {errors?.logo?.message?.toString()}
              </small>
              {subscription?.status !== "active" && (
                <small className="text-muted-foreground block">
                  To customize your workspace, you need to be on a Pro Plan
                </small>
              )}
            </div>
            <div className="self-end">
              <Button disabled={isLoading} type="submit">
                {!isLoading ? "Create Workspace" : <Loader />}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DashboardSetup;