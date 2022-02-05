<template>
  <!-- Nobody wants to see this when they print ;) -->
  <nav class="font-bold text-slate-800 no-print p-3">
    <router-link to="/">Home</router-link> |
    <router-link to="/loader">Loader</router-link>
  </nav>
</template>

<style scoped>
/* Modify the class that vue-router applies */
nav a.router-link-exact-active {
  color: #42b983;
}

@media print {
  .no-print {
    visibility: hidden !important;
    height: 0;
  }
}
</style>
