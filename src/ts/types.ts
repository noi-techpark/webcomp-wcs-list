// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export interface WebcompData {
  uuid: string;
  shortName: string;
  title: string;
  descriptionAbstract: string;
  image: string;
  license: { licenseId: string };
  authors: { name: string }[];
  searchTags: string[];
  currentVersion: { versionTag: string };
  // Optional display fields — may be present in future API responses;
  // fall back to 0 / "unknown" when absent.
  updatedAt?: string;
  rating?: number;
  reviewCount?: number;
  userCount?: number;
}