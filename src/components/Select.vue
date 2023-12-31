<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div>
    <div class="d-flex flex-column flex-lg-row gap-2 gap-lg-4">
      <div
        class="col-12 col-lg-4 position-relative"
      >
        <div
          id="dropdown-title"
          class="select-element w-100 position-relative border-0 form-control bg-light dropdown-toggle text-start"
          @click="toggleDropdown"
        >
          {{ dropdownTitle }}
        </div>
        <div
          id="dropdown"
          class="w-100 position-absolute z-1 mt-2 overflow-y-scroll card shadow"
          :class="`${showDropdown ? 'd-block' : 'd-none'}`"
        >
          <ul class="mb-0 p-2 list-unstyled">
            <li v-for="tag in tags" :key="tag">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :value="tag"
                  :id="`${tag}-checkbox`"
                  @change="(toggleTag)"
                >
                <label class="form-check-label" :for="`${tag}-checkbox`">
                  {{ tag.charAt(0).toUpperCase() + tag.slice(1) }}
                </label>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="col-12 col-lg-4 position-relative">
        <input
          type="text"
          class="select-element w-100 border-0 form-control bg-light text-start"
          placeholder="Search elements"
          v-model="searchTerm"
        >
        <div @click="searchTerm = ''" class="close-icon"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const { tags } = defineProps<{
  tags: Set<string>;
}>()

const showDropdown = ref(false);

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

const emit = defineEmits<{
  tagsChange: [selectedTags: Set<string>];
  searchTermChange: [searchTerm: string];
}>()

const selectedTags = ref<Set<string>>(new Set);

function toggleTag({ target: { value: tag } }: { target: HTMLInputElement }) {
  if (selectedTags.value.has(tag)) {
    selectedTags.value.delete(tag);
  } else {
    selectedTags.value.add(tag);
  }

  emit("tagsChange", selectedTags.value);
}

const dropdownTitle = computed<string>(() => {
  if (selectedTags.value.size > 0) {
    return Array.from(selectedTags.value.values()).map((tag) => tag.charAt(0).toUpperCase() + tag.slice(1)).join(", ");
  } else {
    return "Filter by categories";
  }
})

const searchTerm = ref<string>("");
watch(searchTerm, (newValue) => emit("searchTermChange", newValue));
</script>
