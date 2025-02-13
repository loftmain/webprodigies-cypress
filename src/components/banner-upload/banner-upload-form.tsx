"use client";
import { useAppState } from "@/lib/providers/state-provider";
import { createClient } from "@/lib/supabase/client";
import { UploadBannerFormSchema } from "@/lib/types";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Loader from "../global/Loader";
import {
  updateFile,
  updateFolder,
  updateWorkspace,
} from "@/lib/supabase/queries";

interface BannerUploadFormProps {
  dirType: "workspace" | "file" | "folder";
  id: string;
}

const BannerUploadForm: React.FC<BannerUploadFormProps> = ({ dirType, id }) => {
  const supabase = createClient();
  const { state, workspaceId, folderId, dispatch } = useAppState();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting: isUploading, errors },
  } = useForm<z.infer<typeof UploadBannerFormSchema>>({
    mode: "onChange",
    // TODO : File 입력 validate rresolver 해결해보기
    //resolver: zodResolver(UploadBannerFormSchema),
    defaultValues: { banner: undefined },
  });

  console.log(errors);

  const onSubmitHandler: SubmitHandler<
    z.infer<typeof UploadBannerFormSchema>
  > = async (values) => {
    const file = values.banner?.[0];
    if (!file || !id) return;
    try {
      // id를 새로 생성하게 되면 cacheControl을 사용할 필요가 없음?
      let filePath = null;

      const uploadBanner = async () => {
        const { data, error } = await supabase.storage
          .from("file-banners")
          .upload(`banner-${id}`, file, { cacheControl: "5", upsert: true });
        if (error) throw new Error();
        filePath = data.path;
      };

      if (dirType === "file") {
        if (!workspaceId || !folderId) return;
        await uploadBanner();
        dispatch({
          type: "UPDATE_FILE",
          payload: {
            file: { bannerUrl: filePath },
            fileId: id,
            folderId,
            workspaceId,
          },
        });
        await updateFile({ bannerUrl: filePath }, id);
      } else if (dirType === "folder") {
        if (!workspaceId) return;
        await uploadBanner();
        dispatch({
          type: "UPDATE_FOLDER",
          payload: {
            folder: { bannerUrl: filePath },
            folderId: id,
            workspaceId,
          },
        });
        await updateFolder({ bannerUrl: filePath }, id);
      } else if (dirType === "workspace") {
        await uploadBanner();
        dispatch({
          type: "UPDATE_WORKSPACE",
          payload: {
            workspace: { bannerUrl: filePath },
            workspaceId: id,
          },
        });
        await updateWorkspace({ bannerUrl: filePath }, id);
      }
    } catch (error) {}
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="flex flex-col gap-2"
    >
      <Label className="text-sm text-muted-foreground" htmlFor="bannerImage">
        Banner Image
      </Label>
      <Input
        id="bannerIamge"
        type="file"
        accept="image/*"
        disabled={isUploading}
        {...register("banner", { required: "Banner Url is required" })}
      />
      <small className="text-red-600">
        {errors.banner?.message?.toString()}
      </small>
      <Button disabled={isUploading} type="submit">
        {!isUploading ? "Upload Banner" : <Loader />}
      </Button>
    </form>
  );
};

export default BannerUploadForm;
