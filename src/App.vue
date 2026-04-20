<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div
    v-bind="attrs"
    data-bs-theme="light"
    :style="{ fontFamily: `'${props.fontName}'`, backgroundColor: props.bgColor }"
  >
    <div class="container-fluid py-4">

      <!-- Header -->
      <div class="wcs-header">
        <div class="wcs-header-text">
          <h2
            v-if="props.sectionTitleVisible !== 'false'"
            :style="{ color: props.sectionTitleColor }"
          >{{ props.sectionTitle }}</h2>
          <p
            v-if="props.sectionSubtitleVisible !== 'false'"
            :style="{ color: props.sectionSubtitleColor }"
          >{{ props.sectionSubtitle }}</p>
        </div>
        <a
          v-if="props.headerButtonVisible !== 'false'"
          :href="frontendBase"
          target="_blank"
          rel="noopener noreferrer"
          class="wcs-cta-btn"
          :style="{
            backgroundColor: props.headerButtonBgColor,
            color: props.headerButtonTextColor,
            borderColor: props.headerButtonBorderColor,
          }"
        >
          {{ props.headerButtonText }}
        </a>
      </div>

      <!-- Category filter -->
      <CategoryFilter
        v-if="props.filterVisible !== 'false'"
        :tags="tags"
        :filter-type="props.filterType"
        :chip-bg-color="props.chipBgColor"
        :chip-text-color="props.chipTextColor"
        :chip-active-bg-color="props.chipActiveBgColor"
        :chip-active-text-color="props.chipActiveTextColor"
        :chip-active-border-color="props.chipActiveBorderColor"
        :chip-border-color="props.chipBorderColor"
        :chip-all-label="props.chipAllLabel"
        @tags-change="(t) => { selectedTags = t; }"
        @search-term-change="(s) => { searchTerm = s; }"
      />

      <!-- States -->
      <div v-if="loading" class="wcs-state wcs-state-loading">Loading&hellip;</div>
      <div v-else-if="error" class="wcs-state wcs-state-error">{{ error }}</div>
      <div
        v-else-if="filteredData.length === 0 && props.emptyStateVisible !== 'false'"
        class="wcs-state wcs-state-empty"
        :style="{ color: props.emptyStateTextColor }"
      >{{ props.emptyStateText }}</div>

      <!-- Slider -->
      <div v-else-if="filteredData.length > 0" class="wcs-slider-outer">
        <button
          v-show="props.sliderArrowsVisible !== 'false'"
          class="wcs-slider-arrow left"
          :class="{ 'is-disabled': !canScrollPrev }"
          :aria-disabled="!canScrollPrev"
          @click="scrollByPage(-1)"
          aria-label="Previous"
          :style="{
            backgroundColor: props.sliderArrowBgColor,
            borderColor: props.sliderArrowBorderColor,
            color: props.sliderArrowIconColor,
          }"
        >&lsaquo;</button>

        <div
          ref="sliderViewport"
          class="wcs-slider-viewport"
          @scroll.passive="onSliderScroll"
        >
          <div
            class="wcs-slider-track"
            :style="{ '--wcs-cards-per-page': String(cardsPerPageNumber) }"
          >
            <div
              v-for="item in filteredData"
              :key="item.uuid"
              class="wcs-slider-item"
            >
              <WebcompCard
                :webcomp-data="item"
                v-bind="cardPassthrough"
              />
            </div>
          </div>
        </div>

        <button
          v-show="props.sliderArrowsVisible !== 'false'"
          class="wcs-slider-arrow right"
          :class="{ 'is-disabled': !canScrollNext }"
          :aria-disabled="!canScrollNext"
          @click="scrollByPage(1)"
          aria-label="Next"
          :style="{
            backgroundColor: props.sliderArrowBgColor,
            borderColor: props.sliderArrowBorderColor,
            color: props.sliderArrowIconColor,
          }"
        >&rsaquo;</button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue';
import { WebcompData } from './ts/types';
import WebcompCard from './components/WebcompCard.vue';
import CategoryFilter from './components/CategoryFilter.vue';
import { apiBase, frontendBase, fetchCategories, fetchMetadata } from './ts/api';

const props = defineProps({
  // Font
  fontUrl:                { type: String,  default: 'https://fonts.testingmachine.eu/open-sans/style.css' },
  fontName:               { type: String,  default: 'Open Sans' },
  // Widget Root
  bgColor:                { type: String,  default: '#ffffff' },
  // Header — Title
  sectionTitle:           { type: String,  default: 'Explore by category' },
  sectionTitleColor:      { type: String,  default: '#111111' },
  sectionTitleVisible:    { type: String,  default: 'true' },
  // Header — Subtitle
  sectionSubtitle:        { type: String,  default: 'Access a growing number of web components.' },
  sectionSubtitleColor:   { type: String,  default: '#666666' },
  sectionSubtitleVisible: { type: String,  default: 'true' },
  // Header — CTA Button
  headerButtonVisible:    { type: String,  default: 'true' },
  headerButtonText:       { type: String,  default: 'View all in Store' },
  headerButtonTextColor:  { type: String,  default: '#ffffff' },
  headerButtonBgColor:    { type: String,  default: '#111111' },
  headerButtonBorderColor:{ type: String,  default: '#111111' },
  // Filter Bar
  filterType:             { type: String,  default: 'chips' },
  filterVisible:          { type: String,  default: 'true' },
  filterCategories:       { type: String,  default: '' },
  categoryApiUrl:         { type: String,  default: '' },
  // Filter — Chips
  chipBgColor:            { type: String,  default: '#f0f0f0' },
  chipTextColor:          { type: String,  default: '#111111' },
  chipActiveBgColor:      { type: String,  default: '#111111' },
  chipActiveTextColor:    { type: String,  default: '#ffffff' },
  chipActiveBorderColor:  { type: String,  default: '#111111' },
  chipBorderColor:        { type: String,  default: '#dddddd' },
  chipAllLabel:           { type: String,  default: 'All' },
  // Slider Arrows
  sliderArrowsVisible:    { type: String,  default: 'true' },
  sliderArrowBgColor:     { type: String,  default: '#ffffff' },
  sliderArrowIconColor:   { type: String,  default: '#111111' },
  sliderArrowBorderColor: { type: String,  default: '#dddddd' },
  // Cards — Container
  cardsPerPage:           { type: Number,  default: 4 },
  cardBgColor:            { type: String,  default: '#ffffff' },
  cardBorderColor:        { type: String,  default: '#eeeeee' },
  cardShadowVisible:      { type: String,  default: 'true' },
  // Cards — Thumbnail
  cardThumbBgColor:       { type: String,  default: '#e8eef4' },
  cardThumbVisible:       { type: String,  default: 'true' },
  // Cards — Badge
  cardBadgeBgColor:       { type: String,  default: '#111111' },
  cardBadgeTextColor:     { type: String,  default: '#ffffff' },
  cardBadgeVisible:       { type: String,  default: 'true' },
  // Cards — Bookmark
  cardBookmarkVisible:    { type: String,  default: 'true' },
  cardBookmarkColor:      { type: String,  default: '#111111' },
  // Cards — Title
  cardTitleColor:         { type: String,  default: '#111111' },
  cardTitleVisible:       { type: String,  default: 'true' },
  // Cards — Updated Row
  cardUpdatedVisible:     { type: String,  default: 'true' },
  cardUpdatedColor:       { type: String,  default: '#888888' },
  cardUpdatedLabel:       { type: String,  default: 'Updated' },
  // Cards — Rating Row
  cardRatingVisible:      { type: String,  default: 'true' },
  cardRatingColor:        { type: String,  default: '#888888' },
  cardRatingStarColor:    { type: String,  default: '#f5a623' },
  // Cards — Users Row
  cardUsersVisible:       { type: String,  default: 'true' },
  cardUsersColor:         { type: String,  default: '#888888' },
  cardUsersLabel:         { type: String,  default: 'users' },
  // Cards — Description
  cardDescriptionColor:   { type: String,  default: '#666666' },
  cardDescriptionVisible: { type: String,  default: 'true' },
  // Cards — legacy meta color (kept for backward compat, superseded by individual row colors)
  cardMetaColor:          { type: String,  default: '#888888' },
  // Cards — Open in Store Button
  cardButtonVisible:      { type: String,  default: 'true' },
  cardButtonText:         { type: String,  default: 'Open in Store' },
  cardButtonTextColor:    { type: String,  default: '#111111' },
  cardButtonBorderColor:  { type: String,  default: '#cccccc' },
  cardButtonBgColor:      { type: String,  default: 'transparent' },
  cardButtonIconVisible:  { type: String,  default: 'true' },
  cardButtonIconColor:    { type: String,  default: '#111111' },
  // Empty State
  emptyStateVisible:      { type: String,  default: 'true' },
  emptyStateText:         { type: String,  default: 'No components found.' },
  emptyStateTextColor:    { type: String,  default: '#888888' },
});

const attrs = useAttrs();

// All card-level props bundled for v-bind pass-through to WebcompCard
const cardPassthrough = computed(() => ({
  cardBgColor:          props.cardBgColor,
  cardBorderColor:      props.cardBorderColor,
  cardShadowVisible:    props.cardShadowVisible,
  cardThumbBgColor:     props.cardThumbBgColor,
  cardThumbVisible:     props.cardThumbVisible,
  cardBadgeBgColor:     props.cardBadgeBgColor,
  cardBadgeTextColor:   props.cardBadgeTextColor,
  cardBadgeVisible:     props.cardBadgeVisible,
  cardBookmarkVisible:  props.cardBookmarkVisible,
  cardBookmarkColor:    props.cardBookmarkColor,
  cardTitleColor:       props.cardTitleColor,
  cardTitleVisible:     props.cardTitleVisible,
  cardUpdatedVisible:   props.cardUpdatedVisible,
  cardUpdatedColor:     props.cardUpdatedColor,
  cardUpdatedLabel:     props.cardUpdatedLabel,
  cardRatingVisible:    props.cardRatingVisible,
  cardRatingColor:      props.cardRatingColor,
  cardRatingStarColor:  props.cardRatingStarColor,
  cardUsersVisible:     props.cardUsersVisible,
  cardUsersColor:       props.cardUsersColor,
  cardUsersLabel:       props.cardUsersLabel,
  cardDescriptionColor: props.cardDescriptionColor,
  cardDescriptionVisible: props.cardDescriptionVisible,
  cardButtonVisible:    props.cardButtonVisible,
  cardButtonText:       props.cardButtonText,
  cardButtonTextColor:  props.cardButtonTextColor,
  cardButtonBorderColor:props.cardButtonBorderColor,
  cardButtonBgColor:    props.cardButtonBgColor,
  cardButtonIconVisible:props.cardButtonIconVisible,
  cardButtonIconColor:  props.cardButtonIconColor,
}));

// Load custom font into Shadow DOM
fetch(props.fontUrl)
  .then((response) => response.text())
  .then((cssText) => {
    const fontFaceSheet = new CSSStyleSheet();
    fontFaceSheet.replaceSync(cssText);
    document.adoptedStyleSheets = [
      ...document.adoptedStyleSheets,
      fontFaceSheet,
    ];
  })
  .catch(() => {
    // Font load failure is non-fatal — system font will be used
  });

// ── Data fetching ─────────────────────────────────────────────────────────────
const data = ref<WebcompData[]>([]);
const apiCategories = ref<Set<string> | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const params = [
  "pageSize=1000",
  "pageNumber=0",
  "origin=webcomp-wcs-list",
];

fetchMetadata(apiBase, params)
  .then((res) => { data.value = res; })
  .catch((err: Error) => { error.value = err.message; })
  .finally(() => { loading.value = false; });

if (props.categoryApiUrl.trim()) {
  fetchCategories(props.categoryApiUrl.trim())
    .then((categories) => {
      apiCategories.value = new Set(categories);
    })
    .catch(() => {
      // Category API is optional; fallback remains the metadata searchTags list.
    });
}

// ── Filtering ─────────────────────────────────────────────────────────────────
const selectedTags = ref<Set<string>>(new Set());
const searchTerm = ref<string>('');

const filteredData = computed<WebcompData[]>(() => {
  const tagFiltered = filterByTags(data.value, selectedTags.value);
  return filterByTerm(tagFiltered, searchTerm.value);
});

function filterByTags(items: WebcompData[], selected: Set<string>): WebcompData[] {
  if (selected.size === 0) return items;
  return items.filter((w) => w.searchTags.some((t) => selected.has(t)));
}

function filterByTerm(items: WebcompData[], term: string): WebcompData[] {
  if (!term) return items;
  const lower = term.toLowerCase();
  return items.filter((w) =>
    w.title.toLowerCase().includes(lower) ||
    w.descriptionAbstract.toLowerCase().includes(lower)
  );
}

const availableTags = computed<Set<string>>(() => {
  const unique = new Set<string>();
  data.value.forEach((w) => w.searchTags.forEach((t) => unique.add(t)));
  return unique;
});

const allowedCategories = computed<Set<string> | null>(() => {
  const parsed = parseCategoryList(props.filterCategories);
  if (parsed.has('all')) return null;
  return parsed.size > 0 ? parsed : null;
});

const tags = computed<Set<string>>(() => {
  const source = apiCategories.value && apiCategories.value.size > 0
    ? apiCategories.value
    : availableTags.value;

  const allowed = allowedCategories.value;
  if (!allowed) return source;
  return new Set(Array.from(source).filter((tag) => allowed.has(tag)));
});

watch(tags, (visibleTags) => {
  if (selectedTags.value.size === 0) return;
  const cleaned = new Set(Array.from(selectedTags.value).filter((tag) => visibleTags.has(tag)));
  if (cleaned.size !== selectedTags.value.size) {
    selectedTags.value = cleaned;
  }
});

function parseCategoryList(raw: string): Set<string> {
  const trimmed = raw.trim();
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed: unknown = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return new Set(
          parsed
            .filter((value): value is string => typeof value === 'string')
            .map((value) => value.trim())
            .filter((value) => value.length > 0)
        );
      }
    } catch {
      // Falls back to delimiter parsing.
    }
  }

  return new Set(
    raw
      .split(/[,\n;|]/)
      .map((value) => value.trim())
      .filter((value) => value.length > 0)
  );
}

// ── Slider behavior ───────────────────────────────────────────────────────────
const sliderViewport = ref<HTMLDivElement | null>(null);
const canScrollPrev = ref(false);
const canScrollNext = ref(false);

const cardsPerPageNumber = computed(() => {
  const n = Number(props.cardsPerPage);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
});

function updateSliderControls(): void {
  const vp = sliderViewport.value;
  if (!vp) return;

  const maxLeft = Math.max(0, vp.scrollWidth - vp.clientWidth);
  canScrollPrev.value = vp.scrollLeft > 4;
  canScrollNext.value = vp.scrollLeft < maxLeft - 4;
}

function scheduleSliderControlsUpdate(): void {
  nextTick(() => {
    updateSliderControls();
    requestAnimationFrame(() => {
      updateSliderControls();
    });
    setTimeout(() => {
      updateSliderControls();
    }, 120);
  });
}

function onSliderScroll(): void {
  updateSliderControls();
}

function scrollByPage(direction: -1 | 1): void {
  const vp = sliderViewport.value;
  if (!vp) return;
  const maxLeft = Math.max(0, vp.scrollWidth - vp.clientWidth);
  const nextLeft = Math.min(maxLeft, Math.max(0, vp.scrollLeft + (direction * vp.clientWidth)));

  vp.scrollTo({
    left: nextLeft,
    behavior: 'smooth',
  });
}

async function resetSliderPosition(): Promise<void> {
  await nextTick();
  const vp = sliderViewport.value;
  if (!vp) return;
  vp.scrollTo({ left: 0, behavior: 'auto' });
  updateSliderControls();
}

watch(filteredData, () => {
  resetSliderPosition();
  scheduleSliderControlsUpdate();
});

watch(cardsPerPageNumber, () => {
  resetSliderPosition();
  scheduleSliderControlsUpdate();
});

watch(loading, (isLoading) => {
  if (!isLoading) {
    scheduleSliderControlsUpdate();
  }
});

onMounted(() => {
  scheduleSliderControlsUpdate();
  window.addEventListener('resize', updateSliderControls);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateSliderControls);
});
</script>

<style lang="scss">
@use "./scss/styles.scss";
</style>
