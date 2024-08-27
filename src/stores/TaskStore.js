import { defineStore } from "pinia";

export const useTaskStore = defineStore("taskStore", {
  state: () => ({
    tasks: [
      // { id: 1, title: "buy some milk", isFav: false },
      // { id: 2, title: "play chess", isFav: true },
    ],
    loading: false,
    name: "To-do List",
  }),
  getters: {
    favs() {
      return this.tasks.filter((task) => {
        return task.isFav;
      });
    },
    favCount() {
      return this.tasks.reduce((fcount, task) => {
        return task.isFav ? fcount + 1 : fcount;
      }, 0);
    },
    //If we make use of arrow function then "this" won't refer to state object, so we can pass state as parameter there
    totalCount: (state) => {
      return state.tasks.length;
    },
  },
  actions: {
    async getTasks() {
      this.loading = true;
      const response = await fetch("http://localhost:3000/tasks");
      this.tasks = await response.json();
      this.loading = false;
    },
    async addTask(task) {
      this.tasks.push(task);

      const res = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        body: JSON.stringify(task),
        headers: { "Content-Type": "application/json" },
      });

      if (res.error) {
        console.log(res.error);
      }
    },
    async deleteTask(id) {
      this.tasks = this.tasks.filter((task) => {
        return task.id !== id;
      });

      const res = await fetch("http://localhost:3000/tasks/" + id, {
        method: "DELETE",
      });

      if (res.error) {
        console.log(res.error);
      }
    },
    async toggleFav(id) {
      const task = this.tasks.find((task) => {
        return task.id === id;
      });
      task.isFav = !task.isFav;
      const res = await fetch("http://localhost:3000/tasks/" + id, {
        method: "PATCH",
        body: JSON.stringify({ isFav: task.isFav }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.error) {
        console.log(res.error);
      }
    },
  },
});
