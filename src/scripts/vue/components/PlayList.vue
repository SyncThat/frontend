<template>
    <div class="flex flex-col grow justify-between bg-blue-700">
		<!-- FE all this stuff :) -->
		<div class="flex px-6 py-4 justify-around">
			<button class="group cursor-pointer px-6 py-3 rounded-lg overflow-hidden uppercase text-xs font-bold tracking-wider"
					@click='showCurrentQueue = true'
					:class="{ 'outline outline-cyan-500 outline-1': showCurrentQueue }">
				<span class="text-white transition ease-in-out duration-500">
					Queue
				</span>
			</button>
			<button class="group cursor-pointer px-6 py-3 rounded-lg overflow-hidden uppercase text-xs font-bold tracking-wider"
					@click='showCurrentQueue = false'
					:class="{ 'outline outline-cyan-500 outline-1': !showCurrentQueue }">
				<span class="text-white transition ease-in-out duration-500">
					History
				</span>
			</button>
		</div>

        <div class="flex flex-col h-full px-6 pt-4 gap-y-2 overflow-auto"
			 :class="{ 'place-content-center place-items-center': !hasItems }">
            <div class="relative" v-for="(song, index) in currentList" :key="index">
                <SongItem :song="song" :show-controls="user.admin && showCurrentQueue" />
            </div>
			<div class="relative" v-if='!hasItems'>
				<!-- TODO: Format me! -->
				<p class="italic text-xs text-gray-500 text-center">
					{{ showCurrentQueue ? 'How about adding some bangers?' : 'Nothing has ever been played in the history of ever. In this room.'}}
				</p>
			</div>
        </div>
        
        <AddSong @song="emit('add-song', $event)" v-if="user?.admin"/>
    </div>
</template>

<script setup lang="ts">
    import SongItem from '../parts/Song.vue';
    import AddSong from '../components/AddSong.vue';
	import { PrivateUserData, Song, User } from '../../ts/models/Room';
	import { computed, PropType, ref } from 'vue';
	import Button from '../parts/Button.vue';

	const emit = defineEmits(['add-song'])

    const props = defineProps({
        'playlist': Array as PropType<Array<Song>>,
		'playedSongs': Array as PropType<Array<Song>>,
        'user': Object as PropType<PrivateUserData>,
		'users': Array as PropType<Array<User>>,
	});

	const showCurrentQueue = ref(true);

	const currentList = computed(() => showCurrentQueue.value
		? props.playlist : props.playedSongs)
	const hasItems = computed(() => currentList.value && currentList.value.length > 0);

</script>
