<template>
  <fieldset>
    <legend>{{ label }}</legend>
    <div
      v-for="option in options"
      :key="option.value"
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
    // Поиск опции с `selected: true`
    findSelectedOption() {
      const selectedOption = this.options.find(option => option.selected);
      return selectedOption ? selectedOption.value : null;
    }
  },
  watch: {
    // Следим за изменениями props.value и обновляем внутреннее значение
    value(newValue) {
      this.selectedValue = newValue;
    },
    // Уведомляем родителя об изменении
    selectedValue(newValue) {
      this.$emit("update", newValue);
    }
  },
  mounted() {
    // Если значение не передано, устанавливаем из `selected`
    if (!this.value && this.selectedValue) {
      this.$emit("update", this.selectedValue);
    }
  }
};
</script>

<style scoped>
/* Добавьте стили при необходимости */
</style>
