"use server";

import { z } from "zod";
import { FormSchema } from "../types";
import { createClient } from "../supabase/server";

export async function actionLoginUser({
  email,
  password,
}: z.infer<typeof FormSchema>) {
  // deseperated
  const supabase = await createClient();
  const response = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // 기존에 없던 코드라 문제시 확인 해봐야함.
  return response;
}

export async function actionSignUpUser({
  email,
  password,
}: z.infer<typeof FormSchema>) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email);

  if (data?.length) return { error: { message: "User already exists", data } };
  const response = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}api/auth/callback`,
    },
  });
  return response;
}
