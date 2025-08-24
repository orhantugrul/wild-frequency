import type { PageLoad } from "./$types";
import type { Animal } from "./api/animals/+server";

export type PageData = { animals: Animal[] };

export const load: PageLoad = async ({ fetch }): Promise<PageData> => {
  const response = await fetch("/fun/wild-frequency/api/animals");
  const animals: Animal[] = await response.json();
  return { animals };
};
