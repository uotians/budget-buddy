<template>
  <div>
    <input type="file" @change="handleFileUpload" />
    <button @click="submit">Upload</button>
  </div>
</template>

<script>
import EventBus from "./event-bus";
export default {
  data() {
    return {
      file: null,
    };
  },
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    async submit() {
      let formData = new FormData();
      formData.append("file", this.file);
      await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .catch((error) => console.error(error));
      EventBus.$emit("my-event");
    },
  },
};
</script>
