<template>
  <v-card height="inherit" width="inherit">
    <v-img
      contain
      height="80%"
      width="inherit"
      lazy-src="@/assets/home.jpg"
      :src="'/api/faces/' + faceId + '/image'"
    >
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular
            indeterminate
            color="grey lighten-5"
          ></v-progress-circular>
        </v-row>
      </template>
    </v-img>
    <div
      style="
        height: 20%;
        display: flex;
        align-items: center;
        justify-content: center;
      "
    >
      <p class="font-weight-medium">ID: {{ faceId }}</p>
    </div>
  </v-card>
</template>

<script>
export default {
  props: {
    faceId: {
      type: Number,
      required: true,
    },
  },
  data: () => {
    return { id: -1 };
  },
  mounted() {
    this.id = this.$props.faceId;
  },
};
</script>
