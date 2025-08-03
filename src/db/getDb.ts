import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

// For Webflow Cloud - generic environment access
export const getDb = (env: any) => {
  return drizzle(env.DB, { schema });
};

// For async context in Webflow Cloud
export const getDbAsync = async (env: any) => {
  return drizzle(env.DB, { schema });
};