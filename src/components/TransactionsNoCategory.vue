<template>
  <div v-if="transactions">
    <table>
      <h5>Transactions</h5>
      <tr v-for="transaction in transactions.rows" :key="transaction.id">
        <td>{{ transaction.date }}</td>
        <td>{{ transaction.recipient_or_payer }}</td>
        <td>{{ transaction.amount }}</td>

        <div>
          <b-dropdown id="categoryDropdown">
            <template #button-content>
              <i class="fas fa-cog"></i>
              {{
                transaction.selectedItem
                  ? transaction.selectedItem.name
                  : "Pick Category"
              }}
            </template>
            <b-dropdown-item
              v-for="item in categories?.rows"
              :key="item.id"
              @click="transaction.selectedItem = item"
            >
              {{ item.name }}
            </b-dropdown-item>
          </b-dropdown>
        </div>
        <td>
          <button
            @click="
              submitCategory(
                transaction.selectedItem.name,
                transaction.recipient_or_payer
              )
            "
          >
            Add to Category
          </button>
        </td>
      </tr>
    </table>
  </div>

  <!-- <div v-if="!transactions" class="text-center">
    <div class="spinner-border spinner-border-sm"></div>
  </div> -->
</template>

<script>
import EventBus from "./event-bus";
export default {
  data() {
    return {
      transactions: null,
      categories: null,
      showDropDown: false,
      selectedCategory: null,
      timer: null,
    };
  },
  methods: {
    async fetchData() {
      const response = await fetch("http://localhost:3000/alltransactions");
      this.transactions = await response.json();
      this.transactions.showDropDown = false;
      this.transactions.selectedItem = null;
    },
    async fetchCategories() {
      const response = await fetch("http://localhost:3000/fetchcategories");
      this.categories = await response.json();
    },
    async submitCategory(category, recipient_or_payer) {
      console.log(category);
      await fetch("http://localhost:3000/addtocategory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: category, recipient_or_payer }),
      })
        .then((response) => response.json())
        .catch((error) => console.error(error));
      this.fetchData();
      this.fetchCategories();
    },
    selectCategory(item) {
      this.selectedCategory = item;
    },
  },
  mounted() {
    this.fetchData();
    this.fetchCategories();
  },
  created() {
    EventBus.$on("my-event", () => {
      this.fetchData();
    });
  },
};
</script>

<style>
td {
  border: 1px solid black;
}
/* .dropdown-content {
  display: block;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
}
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}
.dropdown-content a:hover {
  background-color: #f1f1f1;
}
.show {
  display: block;
} */
</style>
