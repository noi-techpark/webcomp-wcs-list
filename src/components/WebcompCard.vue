<template>
  <a
    class="text-reset text-decoration-none"
    :href="`https://webcomponents.opendatahub.testingmachine.eu/webcomponent/${webcompData.shortName}`"
    target="_blank"
  >
    <div class="d-flex flex-column h-100 rounded-2 overflow-hidden bg-white shadow">
      <div class="ratio ratio-16x9">
        <img
          :src="imageSrc"
          class="w-100 object-fit-cover"
        />
      </div>
      <div class="d-flex flex-column justify-content-between flex-grow-1 p-3">
        <div>
          <h4><strong><span class="text-secondary">#</span>{{ webcompData.title }}</strong></h4>
          <p>{{ webcompData.descriptionAbstract }}</p>
        </div>
        <div class="d-none d-lg-flex row">
          <div class="col-6">
            <span>
              Author: 
              <strong>
                {{ webcompData.authors[0].name }}
              </strong>
              {{ webcompData.authors.length > 1 ? "et al." : "" }}
            </span>
            <br />
            <span>
              Category: 
              <strong>
                {{ webcompData.searchTags.join(", ") }}
              </strong>
            </span>
          </div>
          <div class="col-6">
            <span>
              Version: 
              <strong>
                {{ webcompData.currentVersion.versionTag }}
              </strong>
            </span>
            <br />
            <span>
              License: 
              <strong>
                {{ webcompData.license.licenseId }}
              </strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
import { WebcompData } from "../types";
import placeholder from "../assets/img/component_placeholder.png";

const { webcompData, apiBase } = defineProps<{
  webcompData: WebcompData;
  apiBase: string
}>();

const imageSrc = webcompData.image === "wcs-logo.png"
  ? `${apiBase}/webcomponent/${webcompData.uuid}/logo/thumb`
  : placeholder;
</script>