<template>
  <div>
    <p class="form-builder__label">{{ label }}</p>
    <input v-bind="$attrs" :type="type" v-model="localValue" />
  </div>
</template>

<script>
export default {
  name: "FormInput",
  props: {
    label: String,
    type: {
      type: String,
      default: "text",
    },
    value: String, // Получаем начальное значение
  },
  data() {
    return {
      localValue: this.value, // Локальное значение
    };
  },
  watch: {
    localValue(newValue) {
      this.$emit("update", newValue); // Обновляем родительский компонент
    },
  },
};
</script>


<style scoped>

</style>
