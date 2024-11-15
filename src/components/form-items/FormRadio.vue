<template>
  <fieldset>
    <legend>{{ label }}</legend>
    <div
      v-for="option in options"
      :key="option.value"
    >
      <input
        required
        type="radio"
        :id="option.value"
        :value="option.value"
        v-model="selectedValue"
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
      default: ''
    },
    options: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedValue: null
    };
  },
  watch: {
    selectedValue(newValue) {
      this.$emit('update', parseInt(newValue));
    }
  }
}
</script>
