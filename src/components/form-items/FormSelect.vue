<template>
  <div class="select">
    <p class="form-builder__label">{{ label }}</p>
    <select class="select__list" v-model="selectedValue" @change="handleInput">
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

<style lang="scss" scoped>
 .select {
  &__list {
      border-radius: 5px;
      width: 100%;
      height: 32px;
      padding: 0px 16px;
      border: 1px solid rgb(221, 221, 221);
    }
  }
</style>
