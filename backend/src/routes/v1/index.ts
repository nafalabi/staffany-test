import { Server } from "@hapi/hapi";
import createShiftRoutes from "./shifts";
import createPublishedWeekRoutes from "./publishedWeek";

export default function (server: Server, basePath: string) {
  createShiftRoutes(server, basePath + "/shifts");
  createPublishedWeekRoutes(server, basePath + "/published-week");
}
