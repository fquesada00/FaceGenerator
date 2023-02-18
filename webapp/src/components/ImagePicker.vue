<template>
  <v-container class="hoverable" height="inherit" width="inherit" @click="picked" :style="selected ? 'box-shadow: 0px 0px 10px 8px rgba(98,0,238,0.61);' : ''">
    <ImageDisplayer :faceId="id" />
  </v-container>
</template>

<script>
import ImageDisplayer from "./ImageDisplayer.vue";

export default {
  props: {
    faceId: {
      type: Number,
      required: true,
    },
    isPicked: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  components: {
    ImageDisplayer,
  },
  data: () => {
    return { id: -1, selected: false };
  },
  methods: {
    picked() {
        this.$emit("picked", this.faceId);
    },
  },
  mounted() {
    this.id = this.$props.faceId;
  },
  watch: {
    isPicked(newValue, oldValue) {
      this.selected = newValue;
    },
  },
};
</script>

<style scoped>
.hoverable {
  padding: 0;
}

.hoverable:hover {
  cursor: pointer;
}
</style>