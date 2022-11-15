<template>
  <v-card height="25vh" width="20vh">
    <v-img
      v-if="loading"
      contain
      height="20vh"
      width="20vh"
      src="@/assets/home.jpg"
    />
    <v-img
      v-else
      contain
      height="20vh"
      width="20vh"
      :src="'data:image/png;base64, ' + base64"
    />
    <v-card-text style="display: flex; justify-content: center; padding: 1vh;"> ID {{ id }} </v-card-text>
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  props: {
    faceId: {
      type: Number,
      required: true,
    },
  },
  data: () => {
    return { base64: "", loading: true, id: -1 };
  },
  mounted() {
    this.id = this.$props.faceId;
    this.getImageBase64();
  },
  methods: {
    async getImageBase64() {
      this.base64 = await axios
        // .get("/api/faces/"+ id)
        .get("/api/faces?id1=" + this.faceId + "&id2=" + this.faceId)
        .then((response) => {
          return response.data.imgs_bytes[0];
        })
        .catch((error) => {
          console.log(error);
        });
      this.loading = false;
    },
  },
};
</script>
