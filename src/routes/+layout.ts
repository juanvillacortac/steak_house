import { pb } from "$lib/pocketbase";
import { redirect } from "@sveltejs/kit";
import { routesMap } from "$lib/routes";

export function load({ route, url }) {
  if ((route.id as string) != "/login" && !pb.authStore.isValid) {
    throw redirect(301, "/login");
  }
  for (let r of routesMap) {
    if (
      r.roles?.length &&
      url.pathname.startsWith(r.path || "/") &&
      !r.roles.includes(pb.authStore.model?.role)
    ) {
      pb.authStore.clear();
      throw redirect(301, "/login");
    }
  }
}

export const ssr = false;
