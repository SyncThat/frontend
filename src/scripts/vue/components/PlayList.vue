<template>
    <div class="flex flex-col justify-between h-full">
        <h2 class="px-8 py-4 text-3xl font-bold bg-grey-900">Room: <br> {{roomName}}</h2>
        <div class="h-full px-8 pt-4 overflow-auto">
            <div class="mb-6 relative" v-for="(song, index) in playlist" :key="index">
                <SongItem :song="song" />
                <span class="absolute w-full h-px -bottom-3 bg-grey-700"></span>
            </div>
        </div>
        
        <AddSong @song="emit('add-song', $event)" v-if="user?.admin"/>
    </div>
</template>

<script setup lang="ts">
    import SongItem from '../parts/Song.vue';
    import AddSong from '../components/AddSong.vue';
    import { PrivateUserData, Song } from '../../ts/Modals';
    import { PropType } from 'vue';

	const emit = defineEmits(['add-song'])

    const props = defineProps({
        'roomName': String,
        'playlist': Array as PropType<Array<Song>>, 
        'user': Object as PropType<PrivateUserData>
    });
</script>
