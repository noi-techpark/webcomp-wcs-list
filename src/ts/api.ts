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
  const url = `${apiBase}/webcomponent?${params.join("&")}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
    const json: { content: WebcompData[] } = await res.json();
    return json.content;
  } catch (err) {
    throw err instanceof Error ? err : new Error("Failed to fetch web component data");
  }
}

export async function fetchCategories(categoryApiUrl: string): Promise<string[]> {
  try {
    const res = await fetch(categoryApiUrl);
    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
    const json: unknown = await res.json();
    return extractCategoryValues(json);
  } catch (err) {
    throw err instanceof Error ? err : new Error("Failed to fetch categories");
  }
}

function extractCategoryValues(payload: unknown): string[] {
  const base = Array.isArray(payload)
    ? payload
    : isRecord(payload) && Array.isArray(payload.content)
      ? payload.content
      : [];

  const normalized = base
    .map((item) => {
      if (typeof item === "string") return item;
      if (!isRecord(item)) return "";
      if (typeof item.name === "string") return item.name;
      if (typeof item.tag === "string") return item.tag;
      if (typeof item.title === "string") return item.title;
      if (typeof item.value === "string") return item.value;
      return "";
    })
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  return Array.from(new Set(normalized));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}