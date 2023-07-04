import { NextRouter } from "next/router";

export default async function maybeLogin(error: any, router: NextRouter) {
  console.log(error);

  if (error) {
    return router.push("/login");
  }

  router.push("/org");
}
