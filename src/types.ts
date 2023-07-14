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
}