<template>
  <div id="app">
    <h1>Budget Buddy</h1>
    <FileUpload /> <br>
    <CreateCategory /><br>
    <TransactionsData />
    <TransactionsNoCategory />
  </div>
</template>

<script>
import FileUpload from './components/FileUpload.vue';
import CreateCategory from './components/CreateCategory.vue';
import TransactionsNoCategory from './components/TransactionsNoCategory.vue';
import TransactionsData from './components/TransactionsData.vue'


export default {
  name: 'App',
  components: {
    FileUpload,
    CreateCategory,
    TransactionsNoCategory,
    TransactionsData
  }
};
</script>

<style>
#app {
  text-align: center;
  color: #2c3e50;
}
</style>
