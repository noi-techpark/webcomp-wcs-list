<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div
    class="wcs-card"
    :class="{ 'wcs-card--no-shadow': cardShadowVisible === 'false' }"
    :style="{
      backgroundColor: cardBgColor,
      borderColor: cardBorderColor,
    }"
  >
    <!-- Thumbnail -->
    <div
      v-show="cardThumbVisible !== 'false'"
      class="wcs-card-thumb"
      :style="{ backgroundColor: cardThumbBgColor }"
    >
      <img
        :src="imgSrc"
        alt="web component thumbnail"
        @error="onImgError"
      />
      <span
        v-if="firstTag"
        v-show="cardBadgeVisible !== 'false'"
        class="wcs-card-badge"
        :style="{ backgroundColor: cardBadgeBgColor, color: cardBadgeTextColor }"
      >{{ firstTag }}</span>
      <span
        v-show="cardBookmarkVisible !== 'false'"
        class="wcs-card-bookmark"
        :style="{ color: cardBookmarkColor }"
        :data-card-id="cardId"
        role="button"
        tabindex="0"
        @click="onBookmarkClick"
      >
        <!-- Bookmark outline icon -->
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      </span>
    </div>

    <!-- Body -->
    <div class="wcs-card-body">
      <p
        v-show="cardUpdatedVisible !== 'false'"
        class="wcs-card-updated"
        :style="{ color: cardUpdatedColor }"
      >{{ cardUpdatedLabel }} {{ updatedLabel }}</p>
      <h3
        v-show="cardTitleVisible !== 'false'"
        class="wcs-card-title"
        :style="{ color: cardTitleColor }"
      >#{{ webcompData.title }}</h3>
      <p
        v-show="cardRatingVisible !== 'false'"
        class="wcs-card-rating"
        :style="{ color: cardRatingColor }"
      >
        <span :style="{ color: cardRatingStarColor }">&#9733;</span>
        {{ ratingDisplay }} ({{ webcompData.reviewCount ?? 0 }} reviews)
      </p>
      <p
        v-show="cardUsersVisible !== 'false'"
        class="wcs-card-users"
        :style="{ color: cardUsersColor }"
      >
        <!-- People icon -->
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        {{ userCountDisplay }} {{ cardUsersLabel }}
      </p>
      <p
        v-show="cardDescriptionVisible !== 'false'"
        class="wcs-card-desc"
        :style="{ color: cardDescriptionColor }"
      >{{ webcompData.descriptionAbstract }}</p>
      <div v-if="cardButtonVisible !== 'false'" class="wcs-card-cta">
        <a
          :href="storeUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="wcs-open-btn"
          :style="{
            color: cardButtonTextColor,
            borderColor: cardButtonBorderColor,
            backgroundColor: cardButtonBgColor,
          }"
        >
          <span
            v-show="cardButtonIconVisible !== 'false'"
            :style="{ color: cardButtonIconColor }"
          >
            <IconExternal sm />
          </span>
          {{ cardButtonText }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { WebcompData } from '../ts/types';
import { apiBase, frontendBase } from '../ts/api';
import IconExternal from './IconExternal.vue';

const {
  webcompData,
  cardBgColor = '#ffffff',
  cardBorderColor = '#eeeeee',
  cardShadowVisible = 'true',
  cardThumbBgColor = '#e8eef4',
  cardThumbVisible = 'true',
  cardBadgeBgColor = '#111111',
  cardBadgeTextColor = '#ffffff',
  cardBadgeVisible = 'true',
  cardBookmarkVisible = 'true',
  cardBookmarkColor = '#111111',
  cardTitleColor = '#111111',
  cardTitleVisible = 'true',
  cardUpdatedVisible = 'true',
  cardUpdatedColor = '#888888',
  cardUpdatedLabel = 'Updated',
  cardRatingVisible = 'true',
  cardRatingColor = '#888888',
  cardRatingStarColor = '#f5a623',
  cardUsersVisible = 'true',
  cardUsersColor = '#888888',
  cardUsersLabel = 'users',
  cardDescriptionColor = '#666666',
  cardDescriptionVisible = 'true',
  cardButtonVisible = 'true',
  cardButtonText = 'Open in Store',
  cardButtonTextColor = '#111111',
  cardButtonBorderColor = '#cccccc',
  cardButtonBgColor = 'transparent',
  cardButtonIconVisible = 'true',
  cardButtonIconColor = '#111111',
} = defineProps<{
  webcompData: WebcompData;
  cardBgColor?: string;
  cardBorderColor?: string;
  cardShadowVisible?: string;
  cardThumbBgColor?: string;
  cardThumbVisible?: string;
  cardBadgeBgColor?: string;
  cardBadgeTextColor?: string;
  cardBadgeVisible?: string;
  cardBookmarkVisible?: string;
  cardBookmarkColor?: string;
  cardTitleColor?: string;
  cardTitleVisible?: string;
  cardUpdatedVisible?: string;
  cardUpdatedColor?: string;
  cardUpdatedLabel?: string;
  cardRatingVisible?: string;
  cardRatingColor?: string;
  cardRatingStarColor?: string;
  cardUsersVisible?: string;
  cardUsersColor?: string;
  cardUsersLabel?: string;
  cardDescriptionColor?: string;
  cardDescriptionVisible?: string;
  cardButtonVisible?: string;
  cardButtonText?: string;
  cardButtonTextColor?: string;
  cardButtonBorderColor?: string;
  cardButtonBgColor?: string;
  cardButtonIconVisible?: string;
  cardButtonIconColor?: string;
}>();

// Always use the API thumb URL as primary; fall back to placeholder on error
const imgSrc = ref(`${apiBase}/webcomponent/${webcompData.uuid}/logo/thumb`);
const placeholderImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%23e8eef4'/%3E%3Cg fill='none' stroke='%2394a3b8' stroke-width='12' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='164' y='84' width='312' height='192' rx='18'/%3E%3Cpath d='M196 242l74-86 60 58 44-40 70 68'/%3E%3Ccircle cx='248' cy='142' r='20'/%3E%3C/g%3E%3C/svg%3E";
function onImgError() {
  imgSrc.value = placeholderImg;
}

function onBookmarkClick() {
  console.log('Bookmark clicked', {
    cardId,
  });
}

const cardId = webcompData.uuid;

const firstTag = computed(() => webcompData.searchTags[0] ?? '');

const updatedLabel = computed(() => webcompData.updatedAt ?? 'unknown');

const ratingDisplay = computed(() =>
  webcompData.rating !== undefined ? webcompData.rating.toFixed(1) : '0.0'
);

const userCountDisplay = computed(() => {
  const n = webcompData.userCount ?? 0;
  return n >= 1000
    ? (n / 1000).toFixed(3).replace('.', ',')
    : String(n);
});

const storeUrl = computed(() =>
  `${frontendBase}/webcomponent/${webcompData.shortName}`
);
</script>
