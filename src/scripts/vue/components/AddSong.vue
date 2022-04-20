<template>
    <div class="flex flex-col p-8 bg-grey-900 gap-4">
        <div class="relative bg-inherit w-full">
            <input type="text" id="username" name="username" placeholder="Song URL" v-model="songURL" class="peer bg-transparent h-10 w-full rounded-lg text-gray-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-cyan-600 focus:outline-none focus:border-rose-600"/>
            <label for="username" class="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-cyan-600 peer-focus:text-sm transition-all">Song URL</label>
        </div>
        <Button @click="addSong">Sync that!</Button>
    </div>    
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    
    import postApi from '../../ts/helpers/postApi';

    import Button from '../parts/Button.vue';

    const songURL = ref('');
       
    const headers = {
        Accept: 'application/json'
    }
    
    function addSong() {
        postApi(headers, 'https://example.com/answer', { url: songURL }).then(data => {
            console.log(data); // JSON data parsed by `data.json()` call
            songURL.value = '';
            alert('Song Added!');
        });
    }
</script>
