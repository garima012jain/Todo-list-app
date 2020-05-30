<template>
  <div class="add-todo container">
    <h2 class="center-align indigo-text">Add New Todo</h2>
    <form>
      <div class="field title">
        <label for="title">Todo Title:</label>
        <input type="text" name="title" v-model="title" />
      </div>
      <div class="field add-todo">
        <label for="add-todo">Add the description:</label>
        <input type="text" name="add-todo" />
      </div>
      <div class="field center-align">
        <button class="btn pink">Add Todo</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "Addtodo",
  data() {
    return {};
  }
};
</script>

<style scoped>
.add;
</style>