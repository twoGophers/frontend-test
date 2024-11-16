<template>
  <div class="form-builder">
    <form @submit.prevent="onSubmit">
      <div v-if="data" class="form-builder__form-block">
        <div v-for="[key, section] in Object.entries(data)" :key="key" class="form-builder__form-section">
          <h2 v-if="section.name">{{ section.name }}</h2>
          <div v-for="item in section.items" :key="item.name">
            <component
              :is="getComponents(item.type)"
              :label="item.label"
              :options="item.additional?.options"
              :name="`${key}.${item.name}`"
              v-model="formValues[key][item.name]"
              @update="(value) => handleUpdate(key, item.name, value)"
            />
            <div class="error"> 
              <p v-if="errors[key]?.[item.name]" class="error__message">
                {{ errors[key][item.name] }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="form-builder__btn">
        <button class="form-builder__btn-send" type="submit">Отправить</button>
        <button class="form-builder__btn-clear" type="reset">Стереть</button>
      </div>
    </form>
  </div>
</template>

<script>
import { reactive } from "vue";
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
      errors: reactive({}), // Ошибки
    };
  },
  methods: {
    async loadJson() {
      try {
        const response = await fetch("/form-config.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.data = await response.json();

        // Инициализация formValues и errors
        Object.entries(this.data).forEach(([sectionKey, section]) => {
          this.formValues[sectionKey] = {};
          this.errors[sectionKey] = {};
          section.items.forEach((item) => {
            this.formValues[sectionKey][item.name] = ""; // Пустое значение
            this.errors[sectionKey][item.name] = null; // Ошибки по умолчанию
          });
        });
      } catch (error) {
        console.error("Error loading JSON:", error);
      }
    },

    handleUpdate(section, name, value) {
      if (!this.formValues[section]) {
        this.formValues[section] = {};
      }
      this.formValues[section][name] = value;

      // Убираем ошибку при изменении
      if (value) {
        this.errors[section][name] = null;
      }
    },

    validateForm() {
      let isValid = true;

      Object.entries(this.formValues).forEach(([sectionKey, fields]) => {
        Object.entries(fields).forEach(([fieldName, fieldValue]) => {
          if (!fieldValue) {
            // Поле пустое
            this.errors[sectionKey][fieldName] = "Это поле обязательно.";
            isValid = false;
          }
        });

        // Проверка на совпадение pass и repeat-pass
        if (
          fields.pass &&
          fields["repeat-pass"] &&
          fields.pass !== fields["repeat-pass"]
        ) {
          this.errors[sectionKey]["repeat-pass"] = "Пароли не совпадают.";
          isValid = false;
        }
      });

      return isValid;
    },

    // отправка формы
    async onSubmit() {
      if (this.validateForm()) {
        // Убираем repeat-pass перед отправкой
        const sanitizedFormValues = JSON.parse(JSON.stringify(this.formValues));
        Object.keys(sanitizedFormValues).forEach((sectionKey) => {
          delete sanitizedFormValues[sectionKey]["repeat-pass"];
        });

        // Логика отправки запроса
        const url = "https://jsonplaceholder.typicode.com/posts"; // Фейковый URL
        const requestBody = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sanitizedFormValues),
        };

        try {
          console.log("Отправка данных:", sanitizedFormValues);

          // Фейковый запрос
          const response = await fetch(url, requestBody);

          // Проверка статуса
          if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
          }

          const responseData = await response.json();
          console.log("Успешный ответ:", responseData);
          alert("Форма успешно отправлена!");
        } catch (error) {
          console.error("Ошибка при отправке формы:", error.message);
          alert("Произошла ошибка при отправке данных. Попробуйте позже.");
        }
      } else {
        console.warn("Форма содержит ошибки.");
      }
    },


    getComponents(type) {
      return {
        password: FormPassword,
        select: FormSelect,
        radio: FormRadio,
        input: FormInput,
      }[type];
    },
  },

  created() {
    this.loadJson();
  },

  components: {
    FormPassword,
    FormRadio,
    FormSelect,
    FormInput,
  },
};
</script>

<style lang="scss" >

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 8px 16px;
  background-color: #f9f9f9;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  font-size: 16px;
  color: #333333;
}

label {
  font-size: 12px;
}

h2 {
  font-size: 24px;
}
.form-builder {
  max-width: 600px;
  margin: 0 auto;
  margin-top: 100px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 20px;

  &__form-block {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    gap: 20px;
  }

  &__form-section{
    width: calc((100% - 20px) / 2);
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  &__btn {
    display: flex;
    justify-content: end;
    margin-top: 20px;
    button {
      color: #ffffff;
      padding: 12px 20px;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      margin-left: 20px;
    }
  }
  &__btn-send {
    background: #0078d4;
    &:active {
      background-color: #003f8f;
    }
    &:hover {
      background-color: #005bb5;
    }
  }
  &__btn-clear {
    background: #bc8f8f;
    &:active {
      background-color: #b08989;
    }
    &:hover {
      background-color: #c49b9b;
    }
  }
  &__label {
    font-size: 16px;
    counter-reset: #414141;
  }
}
.error {
  height: 20px;
  position: relative;
  &__message {
    color: red;
    font-size: 12px;
    animation: show-error-message 0.3s linear;
  }
}

@keyframes show-error-message {
  0%{ opacity: 0;}
  100%{ opacity: 1;}
}

</style>
