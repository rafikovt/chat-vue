<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue';
import { useChatStore } from "@/stores/chat.js";
import LoginForm from '@/components/LoginForm.vue'
const  router = useRouter()
const { openConnect } = useChatStore()
const loading = ref(false);

const loginToChat = async (name) => {
  loading.value = true;
    try {
      await openConnect(name);
      router.push('/chat')
    } catch (e) {
      console.error(e)
    }
  loading.value = false;
}

</script>

<template>
  <main>
    <div class="container"></div>
    <LoginForm @submit="loginToChat" :loading="loading"/>
  </main>
</template>

<style lang="scss">
.container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
</style>
