import { auth } from "@/lib/auth";
export default auth.middleware({loginUrl:"/auth/sign-in",publicRoutes:["/"]});
export const config={matcher:["/((?!_next/static|_next/image|favicon.ico|favicon.svg).*)"]};
