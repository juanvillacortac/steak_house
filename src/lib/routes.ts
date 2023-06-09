import ChartBar from "carbon-icons-svelte/lib/ChartBar.svelte";
import type { SvelteComponent } from "svelte";

export type RouteMap = {
  name: string;
  path?: string;
  segment?: string;
  icon?: string | (new (args: { target: any; props?: any }) => SvelteComponent);
  roles?: string[];
};

// SVG stuff is hopefully temporary
export const routesMap: RouteMap[] = [
  {
    name: "Menú",
    path: "/",
    segment: "/menu",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M4 1.5a.5.5 0 0 0-1 0v3a2.5 2.5 0 0 0 2 2.45v7.55a.5.5 0 0 0 1 0V6.95A2.5 2.5 0 0 0 8 4.5v-3a.5.5 0 0 0-1 0v3a1.5 1.5 0 0 1-1 1.415V1.5a.5.5 0 0 0-1 0v4.415A1.5 1.5 0 0 1 4 4.5v-3Zm7 13V8H9.5a.5.5 0 0 1-.5-.5v-4c0-.663.326-1.283.771-1.729C10.217 1.326 10.837 1 11.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0Z"></path></svg>`,
  },
  {
    name: "Categorías",
    path: "/categories",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5s4.5-2.01 4.5-4.5s-2.01-4.5-4.5-4.5zm0 7a2.5 2.5 0 0 1 0-5a2.5 2.5 0 0 1 0 5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z"></path></svg>`,
    roles: ["chef", "admin", "cocinero"],
  },
  {
    name: "Ingredientes",
    path: "/ingredients",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M5 1a.5.5 0 0 1 .5.5V2h2v-.5a.5.5 0 0 1 1 0V2h2v-.5a.5.5 0 0 1 1 0V2A1.5 1.5 0 0 1 13 3.5v2.536a2.547 2.547 0 0 0-1 .406V3.5a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h1.547v.002a1.59 1.59 0 0 0 .068.998H4.5A1.5 1.5 0 0 1 3 13.5v-10A1.5 1.5 0 0 1 4.5 2v-.5A.5.5 0 0 1 5 1Zm5 7c.107 0 .206.034.288.091L9.378 9H6a.5.5 0 0 1 0-1h4Zm-3.004 3.435A.5.5 0 0 0 6.5 11H6a.5.5 0 0 0 0 1h.5a.498.498 0 0 0 .157-.025c.097-.189.21-.37.339-.54ZM6 5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1H6Zm6.338 2.455a1.56 1.56 0 0 1 2.207 2.207l-4.289 4.288a2.777 2.777 0 0 1-1.29.731l-1.211.303a.61.61 0 0 1-.74-.74l.304-1.21c.122-.489.374-.935.73-1.29l4.289-4.289Z"></path></svg>`,
    roles: ["chef", "admin", "cocinero"],
  },
  {
    name: "Inventario",
    path: "/inventory",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 21H5q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h4.175q.275-.875 1.075-1.438T12 1q1 0 1.788.563T14.85 3H19q.825 0 1.413.588T21 5v5h-2V5h-2v3H7V5H5v14h6v2Zm4.5-1.075l-4.25-4.25l1.4-1.4l2.85 2.85l5.65-5.65l1.4 1.4l-7.05 7.05ZM12 5q.425 0 .713-.288T13 4q0-.425-.288-.713T12 3q-.425 0-.713.288T11 4q0 .425.288.713T12 5Z"></path></svg>`,
    roles: ["chef", "admin", "cocinero"],
  },
  {
    name: "Reportes",
    path: "/reports",
    icon: ChartBar,
    roles: ["chef", "admin"],
  },
];

// {
// 	name: "ComboBox",
// 	path: "/components/combobox",
// 	icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 3C3.89543 3 3 3.89543 3 5V15C3 16.1046 3.89543 17 5 17H9.22047L9.43163 16.1553C9.44469 16.1031 9.45904 16.0513 9.47466 16H5C4.44772 16 4 15.5523 4 15V5C4 4.44772 4.44772 4 5 4H15C15.5523 4 16 4.44772 16 5V9.23163C16.3194 9.09477 16.6586 9.01856 17 9.00299V5C17 3.89543 16.1046 3 15 3H5ZM9.5 14H10.9427L11.9427 13H9.5C9.22386 13 9 13.2239 9 13.5C9 13.7761 9.22386 14 9.5 14ZM7.5 7.25C7.5 7.66421 7.16421 8 6.75 8C6.33579 8 6 7.66421 6 7.25C6 6.83579 6.33579 6.5 6.75 6.5C7.16421 6.5 7.5 6.83579 7.5 7.25ZM6.75 11C7.16421 11 7.5 10.6642 7.5 10.25C7.5 9.83579 7.16421 9.5 6.75 9.5C6.33579 9.5 6 9.83579 6 10.25C6 10.6642 6.33579 11 6.75 11ZM6.75 14C7.16421 14 7.5 13.6642 7.5 13.25C7.5 12.8358 7.16421 12.5 6.75 12.5C6.33579 12.5 6 12.8358 6 13.25C6 13.6642 6.33579 14 6.75 14ZM9.5 7C9.22386 7 9 7.22386 9 7.5C9 7.77614 9.22386 8 9.5 8H13.5C13.7761 8 14 7.77614 14 7.5C14 7.22386 13.7761 7 13.5 7H9.5ZM9.5 10C9.22386 10 9 10.2239 9 10.5C9 10.7761 9.22386 11 9.5 11H13.5C13.7761 11 14 10.7761 14 10.5C14 10.2239 13.7761 10 13.5 10H9.5ZM10.9798 15.3772L15.8092 10.5478C16.5395 9.81741 17.7237 9.81741 18.454 10.5478C19.1843 11.2781 19.1843 12.4622 18.454 13.1926L13.6246 18.022C13.343 18.3036 12.9902 18.5033 12.6039 18.5999L11.106 18.9744C10.4546 19.1372 9.86451 18.5472 10.0274 17.8958L10.4018 16.3979C10.4984 16.0116 10.6982 15.6588 10.9798 15.3772Z" /></svg>`
// },
// {
// 	name: "Slider",
// 	path: "/components/slider",
// 	icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9C6.93191 9 7.71496 9.63738 7.93699 10.5L13.5 10.5C13.7761 10.5 14 10.7239 14 11C14 11.2455 13.8231 11.4496 13.5899 11.4919L13.5 11.5L7.93673 11.501C7.71435 12.3631 6.93155 13 6 13C5.06845 13 4.28565 12.3631 4.06327 11.501L2.5 11.5C2.22386 11.5 2 11.2761 2 11C2 10.7545 2.17688 10.5504 2.41012 10.5081L2.5 10.5L4.06301 10.5C4.28504 9.63738 5.06809 9 6 9ZM6 10C5.44772 10 5 10.4477 5 11C5 11.5523 5.44772 12 6 12C6.55228 12 7 11.5523 7 11C7 10.4477 6.55228 10 6 10ZM10 3C10.9319 3 11.715 3.63738 11.937 4.49998L13.5 4.5C13.7761 4.5 14 4.72386 14 5C14 5.24546 13.8231 5.44961 13.5899 5.49194L13.5 5.5L11.9367 5.50102C11.7144 6.36312 10.9316 7 10 7C9.06845 7 8.28565 6.36312 8.06327 5.50102L2.5 5.5C2.22386 5.5 2 5.27614 2 5C2 4.75454 2.17688 4.55039 2.41012 4.50806L2.5 4.5L8.06301 4.49998C8.28504 3.63738 9.06809 3 10 3ZM10 4C9.44772 4 9 4.44772 9 5C9 5.55228 9.44772 6 10 6C10.5523 6 11 5.55228 11 5C11 4.44772 10.5523 4 10 4Z"/></svg>`
// },

export const docsPages = filterPages(routesMap);

function filterPages(structure: RouteMap[] | RouteMap): RouteMap[] {
  if (Array.isArray(structure)) {
    // it's an array of pages/categories
    return structure
      .map((page) => filterPages(page)) // recursively flatten the structure and filter to only include pages
      .flat(Infinity) as RouteMap[]; // flatten the structure to get rid of any nesting
  } else {
    // it's a single page/category, not a structure
    // if (structure.type === "category") {
    //   // it's a category
    //   return structure.pages
    //     .map(page => filterPages(page)) // filter down and down until only pages are left
    //     .flat(Infinity) as RouteMap[]; // flatten the array
    // } else {
    // it's a page
    return [structure];
    // }
  }
}
