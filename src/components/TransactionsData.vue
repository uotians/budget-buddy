<template>
  <div v-if="result">
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

    <div>
      <b-table-simple>
        <b-tbody>
          <b-tr>
            <b-td class="font-weight-bold">Tulot</b-td>
            <b-td class="font-weight-bold">Menot</b-td>
            <b-td class="font-weight-bold">Yhteensä</b-td>
          </b-tr>
          <b-tr>
            <b-td>{{ result.rows[0] != null ? result.rows[0].Tulot.toFixed(2) : 0 }}</b-td>
            <b-td>{{ result.rows[0] != null ? result.rows[0].Menot.toFixed(2) : 0 }}</b-td>
            <b-td>{{ (result.rows[0].Tulot + result.rows[0].Menot).toFixed(2) }}</b-td>
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
      result: null,
    };
  },
  methods: {
    async fetchSums() {
      const response = await fetch("http://localhost:3000/gettotals");
      this.result = await response.json();
    },
    async sendDate() {
      console.log(this.dateRange)
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

          this.result = await response.json();
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

<style></style>
