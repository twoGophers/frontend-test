<template>
  <div>
    <p>{{ label }}</p>
    <select>
      <option
        v-for="option in options"
        :key="option.value"
        :selected="option.selected"
        @input="handleInput(option.selected)"
      >{{ option.text }}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: "FormSelect",

  props: {
    label: {
      type: String,
      default: ''
    },

    options: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleInput(newValue) {
      this.$emit("update", newValue );
    }
  }
}
</script>

<style scoped>

</style>
