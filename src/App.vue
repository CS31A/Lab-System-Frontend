<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <!-- <header>
      <h1>Lab System Frontend</h1>
      Navigation will go here
    </header> -->

    <main>
      <RouterView />
    </main>
<!-- 
    <footer>
      Footer content will go here
    </footer> -->
  </div>
</template>

<style scoped>
/* #app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background-color: var(--color-background-soft);
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
}

header h1 {
  margin: 0;
  color: var(--color-heading);
}

main {
  flex: 1;
  padding: 2rem;
}

footer {
  background-color: var(--color-background-soft);
  padding: 1rem;
  border-top: 1px solid var(--color-border);
  text-align: center;
} */
</style>
