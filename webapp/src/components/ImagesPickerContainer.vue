<template>
  <v-row justify="center">
    <v-dialog v-model="show">
      <v-card
        style="
          height: 30.5rem;
          width: 50rem;
          background-color: gainsboro;
          position: relative;
          top: -4rem;
        "
      >
        <v-container
          class="d-flex flex-wrap"
          style="
            justify-content: center;
            align-items: center;
            overflow: auto;
            height: 27.5rem;
            width: 50rem;
          "
        >
          <div
            class="d-flex ma-2"
            style="width: 10rem"
            v-for="id in facesId"
            :key="id"
          >
            <ImagePicker
              :faceId="id"
              @picked="picked"
              :isPicked="id === pickedId"
            />
          </div>
        </v-container>
        <v-card-actions class="d-flex" style="justify-content: space-around">
          <v-btn color="primary" @click="done">Done</v-btn>
          <v-btn color="primary" @click="closeModal">Close Dialog</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import ImagePicker from "./ImagePicker.vue";
export default {
  props: {
    showModal: {
      type: Boolean,
      required: true,
    },
    doneEventName: {
      type: String,
      required: true,
    },
  },
  components: {
    ImagePicker,
  },
  data: () => {
    return {
      facesId: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      show: false,
      pickedId: -1,
      doneEvent: "",
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    picked(id) {
      this.pickedId = id;
    },
    done() {
      this.$emit(this.doneEvent, this.pickedId);
    },
  },
  updated() {
    this.pickedId = -1;
    this.doneEvent = this.doneEventName;
  },
  watch: {
    showModal(newValue, oldValue) {
      this.show = newValue;
    },
    // doneEventName(newValue, oldValue) {
    //   this.doneEvent = newValue;
    // },
  },
};
</script>