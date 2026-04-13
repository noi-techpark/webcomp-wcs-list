<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <!-- Chip filter bar -->
  <div
    v-if="filterType === 'chips'"
    class="wcs-filter-bar"
    :style="{
      '--chip-bg': chipBgColor,
      '--chip-text': chipTextColor,
      '--chip-active-bg': chipActiveBgColor,
      '--chip-active-text': chipActiveTextColor,
      '--chip-active-border': chipActiveBorderColor,
      '--chip-border': chipBorderColor,
    }"
  >
    <button
      class="wcs-chip"
      :class="{ active: selectedTag === null }"
      @click="selectTag(null)"
    >
      {{ chipAllLabel }}
    </button>
    <button
      v-for="tag in tags"
      :key="tag"
      class="wcs-chip"
      :class="{ active: selectedTag === tag }"
      @click="selectTag(tag)"
    >
      {{ tag.charAt(0).toUpperCase() + tag.slice(1) }}
    </button>
  </div>

  <!-- Search input -->
  <div v-else-if="filterType === 'search'" class="mb-3 position-relative">
    <input
      type="text"
      class="form-control"
      placeholder="Search elements"
      v-model="searchTerm"
    />
    <span
      v-if="searchTerm"
      class="position-absolute top-50 end-0 translate-middle-y pe-3"
      style="cursor:pointer"
      @click="searchTerm = ''"
    >&#x2716;</span>
  </div>

  <!-- Dropdown fallback -->
  <div v-else class="mb-3 position-relative" ref="dropdownRef">
    <button
      class="form-control text-start dropdown-toggle position-relative"
      @click="showDropdown = !showDropdown"
    >
      {{ dropdownLabel }}
    </button>
    <div
      v-if="showDropdown"
      class="position-absolute w-100 mt-1 card shadow z-1"
      style="max-height: 300px; overflow-y: auto"
    >
      <ul class="list-unstyled p-2 mb-0">
        <li v-for="tag in tags" :key="tag" class="form-check p-1">
          <input
            class="form-check-input"
            type="checkbox"
            :id="`cf-${tag}`"
            :checked="dropdownSelected.has(tag)"
            @change="toggleDropdownTag(tag)"
          />
          <label class="form-check-label ms-1" :for="`cf-${tag}`">
            {{ tag.charAt(0).toUpperCase() + tag.slice(1) }}
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps<{
  tags: Set<string>;
  filterType: string;
  chipBgColor?: string;
  chipTextColor?: string;
  chipActiveBgColor?: string;
  chipActiveTextColor?: string;
  chipActiveBorderColor?: string;
  chipBorderColor?: string;
  chipAllLabel?: string;
}>();

const {
  chipAllLabel = 'All',
} = props;

const emit = defineEmits<{
  tagsChange: [selectedTags: Set<string>];
  searchTermChange: [searchTerm: string];
}>();

// ── Chip mode ──────────────────────────────────────────────────────────────
const selectedTag = ref<string | null>(null);

function selectTag(tag: string | null) {
  selectedTag.value = tag;
  emit('tagsChange', tag ? new Set([tag]) : new Set());
}

// ── Search mode ────────────────────────────────────────────────────────────
const searchTerm = ref('');
watch(searchTerm, (val) => emit('searchTermChange', val));

// ── Dropdown mode ──────────────────────────────────────────────────────────
const showDropdown = ref(false);
const dropdownSelected = ref<Set<string>>(new Set());
const dropdownRef = ref<HTMLElement | null>(null);

const dropdownLabel = computed(() =>
  dropdownSelected.value.size > 0
    ? Array.from(dropdownSelected.value).map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')
    : 'Filter by categories'
);

function toggleDropdownTag(tag: string) {
  const s = new Set(dropdownSelected.value);
  s.has(tag) ? s.delete(tag) : s.add(tag);
  dropdownSelected.value = s;
  emit('tagsChange', s);
}

function onOutsideClick(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    showDropdown.value = false;
  }
}

onMounted(() => document.addEventListener('click', onOutsideClick));
onBeforeUnmount(() => document.removeEventListener('click', onOutsideClick));
</script>
