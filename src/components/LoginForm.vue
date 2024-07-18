<script setup>
import { ref } from "vue";
import Loader from '@/components/ui/Loader.vue'

defineProps({
  loading: Boolean
})

const emit = defineEmits(['submit'])

const login = ref('');
const error = ref('');

const onSubmit = () => {
  if (login.value) {
    error.value = '';
    emit('submit', login.value)
  } else {
    error.value = 'Введите свой ник'
  }
}

</script>


<template>
  <form class="login" @submit.prevent="onSubmit">
    <input class="login__input" placeholder="Введите Ваш ник" type="text" v-model="login">
    <span class="login__error" v-if="error"> {{ error }}</span>
    <button class="login__button">
      <Loader v-if="loading" />
      <span v-else>Войти</span>
    </button>
  </form>
</template>

<style lang="scss">
.login {
  width: 300px;
  height: 200px;
  margin: 0 auto;
  align-self: center;
  border-radius: 10px;
  background: var(--messages-background);
  padding: 20px;

  &__input {
    display: block;
    width: 100%;
    border: none;
    outline: none;
    padding: 10px;
  }

  &__button {
    display: block;
    margin: 0 auto;
    padding: 10px 50px;
    margin-top: 50px;
    border-radius: 5px;
    color: #fff;
    background: var(--send-background);
    cursor: pointer;
    transition: ease .3s;

    &:hover {
      opacity: .7;
    }
  }

  &__error {
    color: #ff4b5b;
    font-size: 12px;
    font-style: italic;
  }
}
</style>