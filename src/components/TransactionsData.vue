<template>
  <div v-if="totals">
    <div>
      <date-picker
        v-model="dateRange"
        range
        placeholder="Valitse päivämäärät"
        format="DD-MM-YYYY"
        range-separator=" - "
      ></date-picker>
      <button @click="sendDate">Päivitä</button>
    </div>

    <div class="totalAll">
      <b-table-simple>
        <b-tbody>
          <b-tr>
            <b-td class="font-weight-bold">Tulot</b-td>
            <b-td class="font-weight-bold">Menot</b-td>
            <b-td class="font-weight-bold">Yhteensä</b-td>
          </b-tr>
          <b-tr>
            <b-td>{{
              totals.rows[0] != null ? totals.rows[0].Tulot.toFixed(2) : 0
            }}</b-td>
            <b-td>{{
              totals.rows[0] != null ? totals.rows[0].Menot.toFixed(2) : 0
            }}</b-td>
            <b-td>{{
              (totals.rows[0].Tulot + totals.rows[0].Menot).toFixed(2)
            }}</b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </div>

    <div class="totalCategory" v-if="totalsCategory">
      <b-table-simple>
        <b-tbody>
          <b-tr>
            <b-td class="font-weight-bold">Kategoria</b-td>
            <b-td class="font-weight-bold">Yhteensä</b-td>
          </b-tr>
          <b-tr v-for="item in totalsCategory.rows" :key="item.category">
            <b-td>{{ item.category }} </b-td>
            <b-td>{{ item.total.toFixed(2) }} </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </div>
  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";

export default {
  components: { DatePicker },
  data() {
    return {
      dateRange: null,
      totals: null,
      totalsCategory: null,
    };
  },
  methods: {
    async fetchSums() {
      const response = await fetch("http://localhost:3000/gettotals");
      this.totals = await response.json();
    },
    async sendDate() {
      if (this.dateRange && this.dateRange[0] != null) {
        try {
          const response = await fetch("http://localhost:3000/gettotals", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ date: this.dateRange }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          this.totals = await response.json();

          const response2 = await fetch(
            "http://localhost:3000/gettotalsbycategory",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ date: this.dateRange }),
            }
          );

          if (!response2.ok) {
            throw new Error(`HTTP error! status: ${response2.status}`);
          }

          this.totalsCategory = await response2.json();
          

        } catch (error) {
          console.error(
            "There was a problem with the fetch operation: ",
            error
          );
        }
      } else {
        this.fetchSums();
      }
    },
  },
  mounted() {
    this.fetchSums();
  },
};
</script>

<style>
.totalAll {
  width: 50vw;
}
.totalCategory {
  width: 50vw;
}
.font-weight-bold {
  font-size: 1.5em; /* Adjust this value to make the text bigger or smaller */
}
body {
  display: grid;
  place-items: start center;
  height: 100vh;
  margin: 0;
  padding-top: 20px; /* Adjust this value to create the desired gap */
}
</style>
