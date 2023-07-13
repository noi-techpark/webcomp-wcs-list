<template>
  <!DOCTYPE html>
  <html data-bs-theme=light lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Document</title>
    <link rel="stylesheet" href="./scss/styles.scss">
  </head>
  <body>
    <div class="bg-body-secondary py-4">
      <h1>Web Component</h1>
      <div class="container-fluid py-4">
        <div class="row g-4">
          <div
            v-for="item in data"
            :key="item.uuid"
            class="col-12 col-md-6 col-lg-4 col-xl-3"
          >
            <WebcompCard :webcomp-data="item" />
          </div>
        </div>
      </div>
    </div>
  </body>
  </html>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { WebcompData } from './types';
import WebcompCard from "./components/WebcompCard.vue";

const data = ref<WebcompData[]>();

fetch("https://api.webcomponents.opendatahub.testingmachine.eu/webcomponent?pageSize=1000&pageNumber=0&tags=&searchTerm=")
.then((res) => res.json())
.then((json) => data.value = json.content)
.catch((err) => console.error(err));
</script>

<style lang="scss">
@import "./scss/styles.scss";
</style>
