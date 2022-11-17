<template>
  <v-container
    class="d-flex flex-wrap"
    style="justify-content: center; align-items: center"
  >
    <div
      class="d-flex ma-2"
      style="width: 10rem; height: 13rem"
      v-for="id in facesId"
      :key="id"
    >
      <ImageDisplayer :faceId="id" />
    </div>
  </v-container>
</template>

<script>
import axios from "axios";
import ImageDisplayer from "./ImageDisplayer.vue";

export default {
  components: {
    ImageDisplayer,
  },
  data: () => {
    return { facesId: [] };
  },
  methods: {
    getImagesIds() {
      axios
        .get("/api/faces/ids")
        .then((response) => {
          this.facesId = response.data.ids;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.getImagesIds(); // TODO: uncomment this line to get the ids from the server
  },
};
</script>
