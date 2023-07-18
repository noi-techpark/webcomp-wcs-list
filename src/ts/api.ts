// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { WebcompData } from "./types";

function withoutEndingSlash(url: string): string {
  return url.endsWith("/")
  ? url.slice(0, -1)
  : url;
}

const apiBaseEnv = import.meta.env.VITE_API_BASE as string;
export const apiBase = withoutEndingSlash(apiBaseEnv);

const frontendBaseEnv = import.meta.env.VITE_FRONTEND_BASE as string;
export const frontendBase = withoutEndingSlash(frontendBaseEnv);

export async function fetchMetadata(apiBase: string, params: string[]): Promise<WebcompData[]> {
  const url = `${apiBase}/webcomponent?${params.join("&")}`
  const res = await fetch(url);
  const json: { content: WebcompData[] } = await res.json();
  return json.content;
}