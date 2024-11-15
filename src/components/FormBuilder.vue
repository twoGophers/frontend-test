<template>
  <div class="form-builder">
    <form @submit.prevent="onSubmit">
      <div v-if="data" class="form-builder__form-block">
        <div v-for="[key, section] in Object.entries(data)" :key="key">
          <h2 v-if="section.name">{{ section.name }}</h2>
          <div v-for="item in section.items" :key="item.name">
            <component
              :is="getComponents(item.type)"
              :label="item.label"
              :options="item.additional?.options"
              @update="(value) => handleUpdate(key, item.name, value)"
            />
          </div>
        </div>
      </div>
      <div class="form-builder__btn">
        <button type="submit">Отправить</button>
        <button type="reset">Стереть</button>
      </div>
    </form>
  </div>
</template>

<script>
import { reactive } from 'vue';
import FormInput from "@/components/form-items/FormInput.vue";
import FormSelect from "@/components/form-items/FormSelect.vue";
import FormRadio from "@/components/form-items/FormRadio.vue";
import FormPassword from "@/components/form-items/FormPassword.vue";

export default {
  name: "FormBuilder",
  data() {
    return {
      data: null,
      formValues: reactive({}), 
    };
  },
  methods: {
    async loadJson() {
      try {
        const response = await fetch('/form-config.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.data = await response.json();
        console.log(this.data);
        
      } catch (error) {
        console.error('Error loading JSON:', error);
      }
    },

    handleUpdate(section, name, value) {
      if (!this.formValues[section]) {
        this.formValues[section] = {};
      }

      this.formValues[section][name] = value;
    },

    getComponents(type) {
      return {
        password: FormPassword,
        select: FormSelect,
        radio: FormRadio,
        input: FormInput,
      }[type];
    },

    onSubmit() {
      console.log( this.formValues);
    }
  },

  created() {
    this.loadJson();
  },

  components: {
    FormPassword, FormRadio, FormSelect, FormInput
  }
};
</script>

<style lang="scss" scoped>
  .form-builder {
    max-width: 400px;
    margin: 0 auto;
    margin-top: 100px;
    &__form-block {
      display: flex;
      flex-direction: row;
      width: 100%;
      justify-content: space-between;
    }
    &__btn {
      display: flex;
      justify-content: end;
    }
  }
</style>
