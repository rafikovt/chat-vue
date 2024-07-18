<script setup>
import { useInfiniteScroll, onClickOutside } from '@vueuse/core'
import { ref, onMounted } from 'vue';
import NorrisApi from '@/api/norris.js'
import Loader from '@/components/ui/Loader.vue'

const emit = defineEmits(['close', 'select-joke'])
const list = ref(null);
const jokes = ref([]);
const loadingJokes  = ref(false);

const loadJokes = async () => {
  const res = await NorrisApi.getNorrisJokes(10)
  return res;
}

useInfiniteScroll(
    list,
    async () => {
      const res = await  loadJokes();
      jokes.value.push(...res);
    },
    { distance: 300 }
)
onClickOutside(list, () => emit('close'))

onMounted(async () => {
    loadingJokes.value = true;
    jokes.value = await loadJokes();
    loadingJokes.value = false;
})

</script>

<template>
  <div class="jokes-list__wrapper">
    <Loader class="jokes-list__loader" v-if="loadingJokes"/>
    <div ref="list" class="jokes-list" v-else>
      <div
          class="jokes-list__item"
          v-for="(joke, index) in jokes"
          :key="index"
          @click="$emit('select-joke', joke)"
      >
        {{ joke }}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.jokes-list {
  padding: 6px;
  height: 420px;
  overflow-y: scroll;

  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    height: 420px;
    width: 86%;
    position: absolute;
    bottom: 72px;
    color: #000;
    box-shadow: 1px 3px 30px 19px rgba(34, 60, 80, 0.17);
    border-radius: 8px;
  }

  &__item {
    margin-bottom: 8px;
    padding: 4px;
    background-color: #e4eaee;
    border-radius: 8px;
    cursor: pointer;
    transition: ease .3s;

    &:hover {
      opacity: .5;
    }
  }

  &__loader {
    width: 50px;
  }
}
</style>