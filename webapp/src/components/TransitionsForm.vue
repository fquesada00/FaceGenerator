<template>
  <v-form v-model="valid" @submit.prevent="submit">
    <v-container style="width: 70vw">
      <v-row>
        <v-col>
          <v-text-field
            v-model="id1"
            :rules="amountRules"
            label="Id of first face"
            required
            type="number"
          ></v-text-field>
          <div class="d-flex" style="justify-content: center">
            <v-btn
              color="primary"
              class="mr-4"
              :disabled="isLoading"
              @click="openImagePickerModal('id1')"
            >
              Pick first face
            </v-btn>
          </div>
        </v-col>
        <v-col>
          <v-text-field
            v-model="id2"
            :rules="amountRules"
            label="Id of second face"
            required
            type="number"
          ></v-text-field>
          <div class="d-flex" style="justify-content: center">
            <v-btn
              color="primary"
              class="mr-4"
              :disabled="isLoading"
              @click="openImagePickerModal('id2')"
            >
              Pick second face
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-spacer class="mt-10"></v-spacer>
      <v-row>
        <v-col>
          <v-text-field
            v-model="amount"
            :rules="amountRules"
            label="Amount"
            required
            type="number"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            color="primary"
            class="mr-4"
            type="submit"
            :disabled="isLoading"
          >
            Generate
          </v-btn>
          <v-progress-circular
            indeterminate
            color="primary"
            v-if="isLoading"
          ></v-progress-circular>
        </v-col>
      </v-row>
    </v-container>
    <ImagesPickerContainer
      :doneEventName="doneEventName"
      :showModal="showImagePickerModal"
      @close="closeImagePickerModal"
      @doneid1="doneid1"
      @doneid2="doneid2"
    />
  </v-form>
</template>

<script>
import ImagesPickerContainer from "./ImagesPickerContainer.vue";

import axios from "axios";
export default {
  components: {
    ImagesPickerContainer,
  },
  data: () => ({
    refCount: 0,
    isLoading: false,
    valid: false,
    amount: "",
    id1: "",
    id2: "",
    amountRules: [
      (v) => !!v || "Amount is required",
      (v) => Number.isInteger(v) > 0 || "Amount must be an integer",
      (v) => Number(v) > 0 || "Amount must be a positive integer",
    ],
    selectedIdVariable: "",
    showImagePickerModal: false,
  }),
  computed: {
    doneEventName() {
      return "done" + this.selectedIdVariable;
    },
  },
  methods: {
    doneid1(id) {
      if (id !== -1) {
        this.id1 = id;
      } else {
        this.id1 = "";
      }
      this.closeImagePickerModal();
    },
    doneid2(id) {
      if (id !== -1) {
        this.id2 = id;
      } else {
        this.id2 = "";
      }
      this.closeImagePickerModal();
    },
    closeImagePickerModal() {
      this.showImagePickerModal = false;
    },
    openImagePickerModal(idVariable) {
      this.selectedIdVariable = idVariable;
      this.showImagePickerModal = true;
    },
    submit() {
      let formData = new FormData();
      formData.append("id1", this.id1);
      formData.append("id2", this.id2);
      formData.append("amount", this.amount);
      axios({
        url: "/api/transition",
        method: "post",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((response) => {
          console.log(response);
          this.$emit("generated", response.data.imgs_bytes, response.data.zs);
        })
        .catch((e) => {
          alert("Error");
          console.log(e);
        });
    },
    setLoading(isLoading) {
      if (isLoading) {
        this.refCount++;
        this.isLoading = true;
      } else if (this.refCount > 0) {
        this.refCount--;
        this.isLoading = this.refCount > 0;
      }
    },
  },
  created() {
    axios.interceptors.request.use(
      (config) => {
        this.setLoading(true);
        return config;
      },
      (error) => {
        this.setLoading(false);
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => {
        this.setLoading(false);
        return response;
      },
      (error) => {
        this.setLoading(false);
        return Promise.reject(error);
      }
    );
  },
};
</script>