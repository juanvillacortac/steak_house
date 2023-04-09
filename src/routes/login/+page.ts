import { pb } from "$lib/pocketbase";

export async function load() {
  const users = await pb.collection("users").getList(1, 1);
  if (users.totalItems < 1) {
    await pb.collection("users").create({
      username: "admin",
      email: "admin@steakhouse.com",
      emailVisibility: true,
      password: "12345678",
      passwordConfirm: "12345678",
      name: "Administrador",
      role: "admin",
    });
  }
  return {
    header: {
      hideBack: true,
    },
    hideNav: true,
  };
}
