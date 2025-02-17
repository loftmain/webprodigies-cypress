export const dynamic = "force-dynamic";

import QuillEditor from "@/components/quill-editor/quill-editor";
import { getFileDetails } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import React from "react";

type Params = Promise<{ fileId: string }>;

const FilePage = async ({ params }: { params: Params }) => {
  const { fileId } = await params;
  const { data, error } = await getFileDetails(fileId);
  if (error || !data.length) redirect("/dashboard");

  return (
    <div className="relative">
      <QuillEditor dirType="file" fileId={fileId} dirDetails={data[0] || {}} />
    </div>
  );
};

export default FilePage;
