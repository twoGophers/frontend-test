<template>
  <fieldset>
    <legend class="form-builder__label">{{ label }}</legend>
    <div
      v-for="option in options"
      :key="option.value"
      class="age"
    >
      <input
        type="radio"
        :id="option.value"
        :value="option.value"
        v-model="selectedValue"
        :name="name"
      />
      <label :for="option.value">{{ option.text }}</label>
    </div>
  </fieldset>
</template>

<script>
export default {
  name: "FormRadio",
  props: {
    label: {
      type: String,
      default: ""
    },
    options: {
      type: Array,
      required: true
    },
    value: {
      type: [String, Number], // Синхронизация значения с родителем
      default: null
    },
    name: {
      type: String, // Для уникальной группы radio
      required: true
    }
  },
  data() {
    return {
      selectedValue: this.value || this.findSelectedOption() || null
    };
  },
  methods: {
    findSelectedOption() {
      const selectedOption = this.options.find(option => option.selected);
      return selectedOption ? selectedOption.value : null;
    }
  },
  watch: {
    value(newValue) {
      this.selectedValue = newValue;
    },
    selectedValue(newValue) {
      this.$emit("update", newValue);
    }
  },
  mounted() {
    if (!this.value && this.selectedValue) {
      this.$emit("update", this.selectedValue);
    }
  }
};
</script>

<style lang="scss" scoped>
.age {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin: 5px;
  label {
    font-size: 14px;
  }
}
</style>
