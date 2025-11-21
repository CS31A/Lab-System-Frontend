<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { RouterView, useRoute } from 'vue-router'

const GlobalHeader = defineAsyncComponent(() => import('@/components/global/Header.vue'))
const route = useRoute()

const isAdminPage = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <div id="app" class="">
    <!-- GLOBAL HEADER - SHOWN ON ADMIN PAGE -->
    <GlobalHeader v-if="isAdminPage" />

    <main>
      <RouterView />
    </main>
  </div>
</template>
