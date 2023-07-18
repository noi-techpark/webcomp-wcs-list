<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="webcomp-card d-flex flex-column h-100 rounded-2 overflow-hidden bg-white shadow">
    <div class="ratio ratio-16x9 position-relative">
      <img
        :src="imageSrc"
        class="w-100 object-fit-cover"
        alt="web component image"
      />
      <a
        class="webcomp-card-link d-none d-lg-flex justify-content-center align-items-center gap-2 position-absolute h-100 text-decoration-none cursor-pointer"
        :href="`${frontendBase}/webcomponent/${webcompData.shortName}`"
        target="_blank"
      >
        <h4 class="m-0">Open in Store</h4><IconExternal />
      </a>
    </div>
    <div class="d-flex flex-column justify-content-between flex-grow-1 p-3">
      <div>
        <h4><strong><span class="text-secondary">#</span>{{ webcompData.title }}</strong></h4>
        <p>{{ webcompData.descriptionAbstract }}</p>
      </div>
      <div class="d-none d-lg-flex row">
        <div class="col-12">
          <div v-if="webcompData.authors[0]">
            Author: 
            <strong>
              {{ webcompData.authors[0].name }}
            </strong>
            {{ webcompData.authors.length > 1 ? "et al." : "" }}
          </div>
          <div v-if="webcompData.searchTags[0]">
            Category: 
            <strong>
              {{ webcompData.searchTags.join(", ") }}
            </strong>
          </div>
          <div>
            Version: 
            <strong>
              {{ webcompData.currentVersion?.versionTag }}
            </strong>
          </div>
          <div>
            License: 
            <strong>
              {{ webcompData.license?.licenseId }}
            </strong>
          </div>
        </div>
      </div>
      <a
        :href="`${frontendBase}/webcomponent/${webcompData.shortName}`"
        target="_blank"
        class="align-self-start d-lg-none d-flex justify-content-center align-items-center gap-2 btn btn-primary bg-black border-0"
      >
        <span>Open in Store</span><IconExternal sm />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { WebcompData } from "../ts/types";
import placeholder from "../assets/img/component_placeholder.png";
import IconExternal from "./IconExternal.vue";
import { frontendBase } from "../ts/api";

const { webcompData, apiBase } = defineProps<{
  webcompData: WebcompData;
  apiBase: string
}>();

const imageSrc = webcompData.image === "wcs-logo.png"
  ? `${apiBase}/webcomponent/${webcompData.uuid}/logo/thumb`
  : placeholder;
</script>