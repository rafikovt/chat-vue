import { ref } from 'vue'
import { defineStore } from 'pinia'
import PieSocket from 'piesocket-js';

export const useChatStore = defineStore('chat', () => {
  const chat = ref(null);
  const userName = ref('');
  const messages = ref([]);
  const socket = ref({});
  const openConnect = async (name) => {
    socket.value = new PieSocket({
      clusterId: "demo",
      apiKey: "NNLZMOWE0pQcwrwzfgABYhSLFQOXsnnW6x32mpJO",
      notifySelf: true,
      presence: true,
      userId: name
    });

    chat.value = await socket.value.subscribe("chat-room");
    userName.value = name;
    listenMessages();
  };

  const logoutRoom = async () => {
    await socket.value.unsubscribe("chat-room");
    messages.value = [];
  };

  const listenMessages = () => {
    chat.value.listen("new_message", (data, meta) => {
      if(data.sender === userName.value){
        data.sender = "Вы";
      }

      messages.value.push({
        name: data.sender,
        message: data.text
      });
    })
  };

  return {
    chat,
    userName,
    messages,
    socket,
    openConnect,
    logoutRoom
  }
})
