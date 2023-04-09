import type { PageLoad } from "./$types";

export const load = (({}) => {
  return {
    header: {
      hideBack: true,
    },
  };
}) satisfies PageLoad;
