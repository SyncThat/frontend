<template>
    <div class="flex flex-col grow justify-between bg-blue-700">
        <div class="flex flex-col h-full px-6 pt-4 gap-y-2 overflow-auto">
            <div class="relative" v-for="(song, index) in playlist" :key="index">
                <SongItem :song="song" />
            </div>
        </div>
        
        <AddSong @song="emit('add-song', $event)" v-if="user?.admin"/>
    </div>
</template>

<script setup lang="ts">
    import SongItem from '../parts/Song.vue';
    import AddSong from '../components/AddSong.vue';
    import { PrivateUserData, Song } from '../../ts/models/Room';
    import { PropType } from 'vue';

	const emit = defineEmits(['add-song'])

    const props = defineProps({
        'playlist': Array as PropType<Array<Song>>, 
        'user': Object as PropType<PrivateUserData>
    });
</script>
