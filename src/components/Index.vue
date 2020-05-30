<template>
  <div class="index container">
    <div class="card" v-for="todo in todos" :key="todo.id">
      <div class="card-content">
        <i class="material-icons delete" @click="deleteTodo(todo.id)">delete</i>
        <router-link v-bind:to="{path: '/add-todo'}">
          <h2 class="indigo-text">{{todo.title}}</h2>
        </router-link>
        <ul class="description">{{todo.description}}</ul>
      </div>
    </div>
  </div>
</template>

<script>
import db from "@/firebase/init";
export default {
  name: "Index",
  data() {
    return {
      todos: []
      /*todos: [
        {
          title: "Udemy Course",
          description: "Go through Firebase part of the course",
          slug: "udemy-course",
          id: "1"
        },
        {
          title: "ToDo App",
          description: "Create a Todo app using Vue and firebase",
          slug: "todo-app",
          id: "2"
        }
      ]*/
    };
  },
  methods: {
    deleteTodo(id) {
      db.collection("todos")
        .doc(id)
        .delete()
        .then(() => {
          this.todos = this.todos.filter(todo => {
            return todo.id != id;
          });
        });
    }
  },
  created() {
    //fetch database from
    db.collection("todos")
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          let todo = doc.data();
          todo.id = doc.id;
          this.todos.push(todo);
        });
      });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.index {
  margin-top: 30px;
}
.index h2 {
  font-size: 1.8em;
}
.index .delete {
  position: absolute;
  top: 4px;
  right: 4px;
  cursor: pointer;
  color: #aaa;
  font-size: 1.8em;
}
</style>
