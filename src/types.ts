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