<script setup>
import JokesList from '@/components/JokesList.vue'
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useChatStore } from "@/stores/chat.js";
const router = useRouter();
const { logoutRoom } = useChatStore()
const { chat, userName, messages } = storeToRefs(useChatStore());
const message = ref('');
const members = ref([]);
const serviceMessages = ref([])

const sendMessage = async () => {
  try {
    await chat.value.publish("new_message", {
      sender: userName.value,
      text: message.value
    });
    message.value = ''
  } catch (e) {
    console.error(e)
  }
}
const goToMain = () => {
  router.push('/')
}

const logout = async () => {
  try {
    await logoutRoom();
    router.push('/');
  } catch (e) {
    console.error(e)
  }
}

const sendJoke = (joke) => {
  message.value = joke;
}

const closeJokes = () => {
  message.value = '';
}

onMounted(() => {
  if (!chat.value) {
    return goToMain();
  }

  chat.value.listen("system:member_joined", (data) => {
    members.value = data.members;
    serviceMessages.value.push({
      join: true,
      text: 'К чату подключился',
      user: data.member.user
    })
  })

  chat.value.listen("system:member_left", (data) => {
    members.value = data.members;
    serviceMessages.value.push({
      join: false,
      text: 'Чат покинул',
      user: data.member.user
    })
  })
})

</script>

<template>
  <section class="chat">
    <header class="chat__title">
      <ul class="chat__indicators">
        <li class="chat__indicator chat__indicator--red"></li>
        <li class="chat__indicator chat__indicator--yellow"></li>
        <li class="chat__indicator chat__indicator--green"></li>
      </ul>
      <h2>Чат</h2>
    </header>

    <div class="chat__wrapper">
      <div class="chat__users users">
        <h3>В сети</h3>
        <ul class="users__list" v-if="chat">
          <li class="users__item" v-for="(item, index) in members" :key="index">{{ item.user }}</li>
        </ul>
      </div>

      <div class="chat__messages messages">
        <ul class="messages__list" v-if="messages.length">
          <li class="messages__item" v-for="(item, index) in messages" :key="index">
            <span class="messages__name">{{ item.name }}:</span>
            <span class="messages__text">{{ item.message }}</span>
          </li>
        </ul>
        <form class="messages__controls controls" @submit.prevent="sendMessage">
          <input class="controls__input" type="text" v-model="message" @update:model-value="onInput" />
          <button class="controls__button">Отправить</button>
        </form>
        <Transition name="fade" mode="out-in">
          <JokesList
              v-if="message === 'norris'"
              @select-joke="sendJoke"
              @close="closeJokes"
          />
        </Transition>
      </div>

      <div class="chat__notifications notifications">
        <ul class="notifications__list">
          <li
              v-for="(message, index) in serviceMessages"
              :class="['notifications__item', message.join ? 'notifications__item--success' : 'notifications__item--warning']"
              :key="index"
          >{{ message.text }}: {{ message.user }}</li>
        </ul>
        <div class="notifications__controls controls">
          <button class="notifications__button" @click="logout">Выйти</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.chat {
  background: #fff;
  margin: 0 auto;
  align-self: center;
  border-radius: 10px;

  &__title {
    position: relative;
    text-align: center;
    padding: 7px;

    h2 {
      text-align: center;
      font-size: 18px;
    }
  }

  &__indicators {
    position: absolute;
    left: 7px;
    top: 50%;
    transform: translateY(-50%);
  }

  &__indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;

    &:not(:last-child) {
      margin-right: 5px;
    }

    &.chat__indicator--green {
      background: #2bcd72;
    }

    &.chat__indicator--red {
      background: #ff4b5b;
    }

    &.chat__indicator--yellow {
      background: #fac751;
    }
  }

}

.chat__wrapper {
  display: flex;
  width: 1000px;
  height: 900px;

  .users {
    width: 20%;
    background: #505d71;
    padding: 10px;
    color: #bcc3d0;
    .users__item {
      margin-top: 10px;
      font-size: 12px;
    }
  }

  .messages {
    position: relative;
    border: 1px solid #a0b4c0;
    width: 60%;
    padding: 10px 0 0 10px;
    font-size: 14px;
    height: 100%;

    .messages__item {
      padding: 10px;
      color: #181818;
      border-radius: 8px;

      &:nth-child(2n) {
        background: #e4eaee;
      }
    }

    &__name {
      margin-right: 12px;
      font-style: italic;
    }

    &__text {
      font-size: 18px;
    }
  }
}

.controls {
  position: absolute;
  z-index: 2;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  background: #e4eaee;
  display: flex;

  &__input {
    width: 70%;
    margin-right: 5px;
  }

  &__button {
    width: 25%;
    padding: 5px;
    border-radius: 5px;
    color: #fff;
    background: #a0b4c0;
    cursor: pointer;
    transition: ease .3s;

    &:hover {
      opacity: .7;
    }
  }
}

.notifications {
  border-top: 1px solid #a0b4c0;
  border-bottom: 1px solid #a0b4c0;
  font-size: 12px;
  padding: 10px;
  width: 25%;
  height: 100%;
  position: relative;

  &__controls {
    justify-content: center;
  }

  &__button {
    padding: 5px 20px;
    border-radius: 5px;
    color: #fff;
    background: #a0b4c0;
    cursor: pointer;
    transition: ease .3s;

    &:hover {
      opacity: .7;
    }
  }

  &__item {
    &:not(:last-child) {
      margin-bottom: 5px;
    }

    &--success {
      color: #2bcd72;
    }

    &--warning {
      color: #ff4b5b;
    }
  }
}

.messages__list,
.notifications__list,
.users__list {
  height: calc(100% - 50px);
  overflow-y: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>