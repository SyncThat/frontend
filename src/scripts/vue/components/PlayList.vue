<template>
    <div class="flex flex-col justify-between h-full">
        <h2 class="px-8 py-4 text-3xl font-bold bg-grey-900">Playlist</h2>
        <div class="h-full px-8 pt-4 overflow-auto">
            <div class="mb-6 relative" v-for="index in 20" :key="index">
                <Song />
                <span class="absolute w-full h-px -bottom-3 bg-grey-700"></span>
            </div>
        </div>
        <div class="flex flex-col py-6 px-8 bg-grey-900 gap-4">
            <div class="relative bg-inherit w-full">
                <input type="text" id="username" name="username" placeholder="Song URL" v-model="songURL" class="peer bg-transparent h-10 w-full rounded-lg text-gray-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-cyan-600 focus:outline-none focus:border-rose-600"/>
                <label for="username" class="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-cyan-600 peer-focus:text-sm transition-all">Song URL</label>
            </div>
            <Button @click="addSong">Sync that!</Button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import Button from '../parts/Button.vue';
    import Song from '../parts/Song.vue';
    import postApi from '../../ts/helpers/postApi';
    import {ref} from 'vue';

    const songURL = ref('');
       
    const headers = {
        Accept: 'application/json'
    }
    
    function addSong() {
        postApi(headers, 'https://example.com/answer', { url: songURL }).then(data => {
            console.log(data); // JSON data parsed by `data.json()` call
        });
    }
</script>
