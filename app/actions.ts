"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const username = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        username,
      },
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const newPostAction = async (formData: FormData) => {
  const content = formData.get("content") as string;
  const parentPostId = formData.get("parent_post_id") as string;
  const supabase = await createClient();

  console.log(parentPostId, parentPostId || null);

  if (content.length > 320) {
    return encodedRedirect("error", "/", "Post is too long");
  }

  const { error } = await supabase
    .from("posts")
    .insert([{ content, parent_post_id: parentPostId || null }]);

  if (error) {
    console.error(error.message);
    return encodedRedirect("error", "/", "Could not create post");
  }

  return redirect("/");
};

export const deletePostAction = async (id: string) => {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().match({ id });

  if (error) {
    console.error(error.message);
    return false;
  }

  return true;
};

export const likePostAction = async (id: string) => {
  const supabase = await createClient();
  const { error } = await supabase.from("likes").insert([{ post_id: id }]);

  if (error) {
    console.error(error.message);
    return false;
  }

  return true;
};

export const unlikePostAction = async (id: string) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from("likes")
    .delete()
    .match({ post_id: id });

  if (error) {
    console.error(error.message);
    return false;
  }

  return true;
};

export const followUserAction = async (id: string) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from("follows")
    .insert([{ following_id: id }]);

  if (error) {
    console.error(error.message);
    return false;
  }

  return true;
};

export const unfollowUserAction = async (id: string) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from("follows")
    .delete()
    .match({ following_id: id });

  if (error) {
    console.error(error.message);
    return false;
  }

  return true;
};
