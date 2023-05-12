import { router } from "~/lib/trpc";
import { Context, createContext } from "~/lib/trpc/context";
import { groupRouter } from "~/servers/group";
import { ticketRouter } from "~/servers/ticket";
import { ticketManagerRouter } from "~/servers/ticketManager";
import { userRouter } from "~/servers/user";

export const appRouter = router({
  user: userRouter,
  ticket: ticketRouter,
  group: groupRouter,
  ticketManager: ticketManagerRouter,
});

export type AppRouter = typeof appRouter;
