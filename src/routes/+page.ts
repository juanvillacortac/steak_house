import type { PageLoad } from "./$types";

export const load = (({}) => {
  return {
    header: {
      hideBack: true,
    },
    segment: "/menu",
  };
}) satisfies PageLoad;
