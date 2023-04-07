import { pb } from "$lib/pocketbase";
import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load = (({ route }) => {
  if ((route.id as string) != "/login" && !pb.authStore.isValid) {
    throw redirect(301, "/login");
  }
  return {};
}) satisfies LayoutLoad;

export const ssr = false;
