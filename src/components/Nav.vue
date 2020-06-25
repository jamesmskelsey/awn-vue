<template>
    <div id="nav no-print">
      <router-link to="/">Home</router-link> |
      <router-link to="/loader">Loader</router-link>
    </div>
</template>

<style scoped>

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

@media print {
  .no-print {
    visibility: hidden !important;
    height: 0;
  }
}

</style>