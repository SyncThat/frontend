<template>
    <div class="flex flex-col justify-between h-full">
        <h2 class="px-8 py-4 text-3xl font-bold bg-grey-900">Room: <br> {{roomName}}</h2>
        <div class="h-full px-8 pt-4 overflow-auto">
            <div class="mb-6 relative" v-for="(song, index) in playlist" :key="index">
                <Song :song="song" />
                <span class="absolute w-full h-px -bottom-3 bg-grey-700"></span>
            </div>
        </div>
        <AddSong />
    </div>
</template>

<script setup lang="ts">
    import Song from '../parts/Song.vue';
    import AddSong from '../components/AddSong.vue';

    const props = defineProps({
        'roomName': String,
        'playlist': Object, 
    });
</script>
