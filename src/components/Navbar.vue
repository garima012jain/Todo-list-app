<template>
  <div class="navbar">
    <nav class="nav-extended indigo darken-2">
      <div class="nav-content">
        <router-link v-bind:to="{path: '/'}">
          <span class="nav-title">Todo List</span>
        </router-link>
        <a href class="btn-floating btn-large halfway-fab pink">
          <router-link v-bind:to="{path: '/add-todo'}">
            <i class="material-icons">add</i>
          </router-link>
        </a>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {};
  }
};
</script>

<style scoped>
.navbar nav {
  padding: 0 20px;
}
</style>

