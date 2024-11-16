<template>
  <div>
    <p>{{ label }}</p>
    <select v-model="selectedValue" @change="handleInput">
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.text }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "FormSelect",
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
      type: [String, Number],
      default: ""
    }
  },
  data() {
    return {
      selectedValue: this.value || this.findSelectedOption() || ""
    };
  },
  methods: {
    findSelectedOption() {
      const selectedOption = this.options.find(option => option.selected);
      return selectedOption ? selectedOption.value : null;
    },
    handleInput() {
      this.$emit("update", this.selectedValue);
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

<style scoped>
/* Стили */
</style>
