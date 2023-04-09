import PocketBase from "pocketbase";

export const pb = new PocketBase("http://127.0.0.1:9080", undefined, "es-VE");

pb.autoCancellation(false);
