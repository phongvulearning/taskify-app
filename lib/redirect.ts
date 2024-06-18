import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export function redirectAuth() {
  const { orgId, userId } = auth();

  if (!orgId) {
    return redirect("/select-org");
  }
  if (!userId) {
    return redirect("/sign-in");
  }

  return;
}
