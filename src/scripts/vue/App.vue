<template>
	<div class="flex text-white">
		<div class="w-3/12 h-screen bg-grey-800">
			<Playlist :roomName="'wat'" :playlist="queue" />
		</div>
		
		<div class="w-7/12 h-screen bg-grey-700">
			<Player />

			<Chat />
		</div>

		<div class="w-2/12 h-screen bg-grey-800">
			<Users :users="users" />
		</div>
	</div>
</template>

<script setup lang="ts">
    import { onMounted, ref } from 'vue';

	import getApi from '../ts/helpers/getApi';

	import Playlist from './components/Playlist.vue';
	import Player from '../vue/components/Player.vue';
	import Chat from '../vue/components/Chat.vue';
	import Users from '../vue/components/Users.vue';
	import { RoomConnection } from '../ts/RoomConnection';

	const queue = ref<any[]>([]);
	const currentSong = ref<object|null>(null);
	const users = ref<any>();
	const me = ref<object|undefined>();

	const conn = new RoomConnection(1, queue, currentSong, users, me);


	const roomData = ref({
		name: String,
  		playlist: Object,
		users: Object
	});




	onMounted(() => {  
		const headers = {
            Accept: 'application/json'
        }


		getApi(headers, '/json/room.json').then(response => {
			console.log(response);
			roomData.value = response;
        }).catch((e) => {
            console.error('error', e);
        });
	});

</script>
