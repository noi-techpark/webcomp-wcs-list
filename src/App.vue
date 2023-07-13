<template>
  <!DOCTYPE html>
  <html data-bs-theme=light lang="en">
  <head ref="head">
    <meta charset="UTF-8">
    <title>Document</title>
  </head>
  <body>
    <div class="container-fluid py-4">
      <div class="pb-4 row">
        <Select
          class="col col-xl-4"
          :tags="tags"
          @tags-change="(changedTags) => selectedTags = changedTags"
          @search-term-change="(changedTerm) => searchTerm = changedTerm"
        />
      </div>
      <div class="mt-4">
        <div class="row g-4">
          <div
            v-if="filteredData?.length ?? 0 > 0"
            v-for="item in filteredData"
            :key="item.uuid"
            class="col-12 col-md-6 col-lg-4 col-xl-3"
          >
            <WebcompCard :webcomp-data="item" />
          </div>
          <h2 v-else>Your search came up empty</h2>
        </div>
      </div>
    </div>
  </body>
  </html>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { WebcompData } from './types';
import WebcompCard from "./components/WebcompCard.vue";
import Select from './components/Select.vue';

const data = ref<WebcompData[]>();

fetch("https://api.webcomponents.opendatahub.testingmachine.eu/webcomponent?pageSize=1000&pageNumber=0&tags=&searchTerm=")
.then((res) => res.json())
.then((json) => data.value = json.content)
.catch((err) => console.error(err));

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
