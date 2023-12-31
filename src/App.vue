<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <head>
    <meta name="description" content="List of all webcomponents available in the Open Data Hub Web Component Store">
  </head>
  <body data-bs-theme=light :style="`font-family: '${fontName}'`">
    <div class="container-fluid py-4">
      <div class="pb-lg-4 row gy-4 align-items-center">
        <Select
          class="col-12 col-xl-6"
          :tags="tags"
          @tags-change="(changedTags) => selectedTags = changedTags"
          @search-term-change="(changedTerm) => searchTerm = changedTerm"
        />
        <h4 class="col-12 col-xl-6 text-lg-end"><b>{{ filteredData?.length }} Components</b></h4>
      </div>
      <div class="pt-4">
        <div class="row g-4">
          <div
            v-if="filteredData?.length ?? 0 > 0"
            v-for="item in filteredData"
            :key="item.uuid"
            class="col-12 col-md-6 col-lg-4 col-xl-3"
          >
            <WebcompCard :webcomp-data="item" :api-base="apiBase" />
          </div>
          <h4 v-else><b>Your search came up empty</b></h4>
        </div>
      </div>
    </div>
  </body>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { WebcompData } from './ts/types';
import WebcompCard from "./components/WebcompCard.vue";
import Select from './components/Select.vue';
import { apiBase, fetchMetadata } from './ts/api';

const {
  fontUrl,
  fontName,
} = withDefaults(defineProps<{
  fontUrl?: string;
  fontName?: string;
}>(), {
  fontUrl: "https://fonts.testingmachine.eu/open-sans/style.css",
  fontName: "Open Sans",
})

fetch(fontUrl)
.then((response) => response.text())
.then((cssText) => {
  const fontFaceSheet = new CSSStyleSheet();
  fontFaceSheet.replaceSync(cssText);
  document.adoptedStyleSheets = [
    ...document.adoptedStyleSheets,
    fontFaceSheet,
  ];
});

const data = ref<WebcompData[]>();

const params = [
  "pageSize=1000",
  "pageNumber=0",
  "origin=webcomp-wcs-list"
];

fetchMetadata(apiBase, params).then((res) => data.value = res)

const selectedTags = ref<Set<string>>(new Set);
const searchTerm = ref<string>("");

const filteredData = computed<WebcompData[] | undefined>(() => {
  const unfilteredData = data.value ?? [];

  const tagFilteredData = filterByTags(unfilteredData, selectedTags.value);
  const bothFilteredData = filterByTerm(tagFilteredData, searchTerm.value);

  return bothFilteredData;
})

function filterByTags(data: WebcompData[], selectedTags: Set<string>): WebcompData[] {
  if (selectedTags.size > 0) {
    return data.filter((webcompData) => {
      return webcompData.searchTags.filter((tag) => selectedTags.has(tag)).length > 0
    });
  } else {
    return data;
  }
}

function filterByTerm(data: WebcompData[], searchTerm: string): WebcompData[] {
  if (searchTerm.length > 0) {
    return data.filter((webcompData) => {
      const titleIncludesTerm = webcompData.title.toLowerCase().includes(searchTerm.toLowerCase());
      const descriptionIncludesTerm = webcompData.descriptionAbstract.toLowerCase().includes(searchTerm.toLowerCase());
      return titleIncludesTerm || descriptionIncludesTerm;
    })
  } else {
    return data;
  }
}

const tags = computed<Set<string>>(() => {
  const unique = new Set<string>();
  data.value?.forEach((webcompData) => {
    webcompData.searchTags.forEach((tag) => unique.add(tag));
  });
  return unique;
})
</script>

<style lang="scss">
@import "./scss/styles.scss";
</style>
