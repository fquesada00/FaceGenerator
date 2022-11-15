<template>
  <v-container class="d-flex flex-wrap">
    <div
      class="d-flex ma-2"
      style="width: 20vh"
      v-for="id in facesId"
      :key="id"
    >
      <ImageDisplayer :faceId="id" />
    </div>
  </v-container>
</template>

<script>
import ImageDisplayer from "./ImageDisplayer.vue";

export default {
  components: {
    ImageDisplayer,
  },
  data: () => {
    return { facesId: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2] };
  },
};
</script>
