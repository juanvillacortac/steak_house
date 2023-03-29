import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { page } from "$app/stores";
import { writable, type Writable } from "svelte/store";

type Media<Query extends Record<string, string> = Record<string, string>> = {
  [K in keyof Query]?: boolean | string;
} & {
  classNames: string;
};

type MediaQueryLists = Record<string, MediaQueryList>;

function calculateMedia(mqls: MediaQueryLists) {
  let media: Media = { classNames: "" };
  let mediaClasses: string[] = [];
  for (let name in mqls) {
    media[name] = mqls[name].matches;
    if (media[name]) {
      mediaClasses.push(`media-${name}`);
    }
  }
  media.classNames = mediaClasses.join(" ");
  return media;
}

export function watchMedia<Query extends Record<string, string>>(
  mediaqueries: Query
) {
  return writable<Media<Query>>({ classNames: "" }, (set) => {
    if (typeof window === "undefined") return;
    let mqls: MediaQueryLists = {};
    let updateMedia = () => set(calculateMedia(mqls));
    for (let key in mediaqueries) {
      let foo = window.matchMedia(mediaqueries[key]);
      mqls[key] = foo;
      mqls[key].addListener(updateMedia);
    }
    updateMedia();
    return () => {
      for (let key in mqls) {
        mqls[key].removeListener(updateMedia);
      }
    };
  });
}

export function createQueryStore<T = any>(prop: string): Writable<T> {
  let query: Record<string, any> = {};
  const set = (v: any) => {
    // if (v) {
    query[prop] = v || "";
    // } else {
    //   delete query[prop]
    // }
    if (!browser) return;
    const urlSearchParams = new URLSearchParams(query);
    const g = `?${urlSearchParams.toString()}`;
    if (g !== window.location.search)
      goto(g, { keepFocus: true, replaceState: true, noScroll: true });
  };
  return {
    subscribe: (h) => {
      return page.subscribe((p) => {
        query = Object.fromEntries(p.url.searchParams.entries());
        h(query[prop]);
      });
    },
    update(cb: CallableFunction) {
      const value = cb(query[prop]);
      set(value);
    },
    set,
  };
}
