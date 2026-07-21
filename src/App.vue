<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      location="start"
      temporary
    >
      <v-list nav density="comfortable">
        <v-list-item @click="tab = 'oracle'">
          <template #prepend>
            <v-icon icon="mdi-yin-yang" />
          </template>
          <v-list-item-title>Oracle</v-list-item-title>
        </v-list-item>
        <v-list-item @click="tab = 'browse'">
          <template #prepend>
            <v-icon icon="mdi-shuffle" />
          </template>
          <v-list-item-title>Random hexagram</v-list-item-title>
        </v-list-item>
        <v-list-item @click="tab = 'patterns'">
          <template #prepend>
            <v-icon icon="mdi-hexagon-multiple" />
          </template>
          <v-list-item-title>Patterns</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="surface" elevation="1">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-app-bar-title>I Ching: The Book of Changes</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid class="py-6 py-md-8">
        <v-tabs v-model="tab" class="mb-6" color="primary" align-tabs="center">
          <v-tab value="oracle" prepend-icon="mdi-yin-yang">Oracle</v-tab>
          <v-tab value="browse" prepend-icon="mdi-shuffle">Browse</v-tab>
          <v-tab value="patterns" prepend-icon="mdi-hexagon-multiple">Patterns</v-tab>
        </v-tabs>

        <v-window v-model="tab">
          <v-window-item value="oracle">
            <IChingOracle />
          </v-window-item>
          <v-window-item value="browse">
            <v-sheet class="mx-auto pa-4 pa-md-6 text-center" max-width="720" rounded="lg" border>
              <p class="text-body-2 text-medium-emphasis mb-4">
                This draws a hexagram uniformly at random from the 64 King Wen figures. It is not a divination cast.
              </p>
              <v-btn class="mb-6" color="primary" @click="shuffle">Draw at random</v-btn>
              <HexagramPanel v-if="browseHex" :entry="browseHex" />
            </v-sheet>
          </v-window-item>
          <v-window-item value="patterns">
            <PatternsLab :active="tab === 'patterns'" />
          </v-window-item>
        </v-window>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { pickRandomHexagram } from '@/hexagrams.js';
import IChingOracle from '@/components/IChingOracle.vue';
import HexagramPanel from '@/components/HexagramPanel.vue';
import PatternsLab from '@/components/patterns/PatternsLab.vue';

const drawer = ref(false);
const tab = ref('oracle');
const browseHex = ref(null);

function shuffle() {
  browseHex.value = pickRandomHexagram();
}

onMounted(() => {
  browseHex.value = pickRandomHexagram();
});
</script>

<style scoped>
</style>
