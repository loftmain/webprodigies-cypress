"use server";

import { z } from "zod";
import { FormSchema } from "../types";
import { createClient } from "../supabase/client";

export async function actionLoginUser({
  email,
  password,
}: z.infer<typeof FormSchema>) {
  //const supabase = createRouteHandlerClient({ cookies });
  const supabase = createClient();
  const response = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return response;
}
