<template>
	<div class="flex text-white">
		<div class="w-3/12 h-screen bg-grey-800">
			<Playlist :roomName="'wat'" :playlist="queue" @add-song="downloadSong" />
		</div>
		
		<div class="flex flex-col w-7/12 h-screen bg-grey-700">
			<Player :currentSong="currentSong" :conn='conn' :user='me' />

			<Chat :conn='conn' />
		</div>

		<div class="w-2/12 h-screen bg-grey-800">
			<Users :users="users" :conn='conn' :user='me' />
		</div>
	</div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';

	import getApi from '../ts/helpers/getApi';

	import Playlist from './components/Playlist.vue';
	import Player from '../vue/components/Player.vue';
	import Chat from '../vue/components/Chat.vue';
	import Users from '../vue/components/Users.vue';
	import { RoomConnection } from '../ts/RoomConnection';
	import { CurrentSong, PrivateUserData, Song, User} from '../ts/Modals';

	const queue = ref<Song[]|undefined>();
	const currentSong = ref<CurrentSong|undefined>();
	const users = ref<User[]>();
	const me = ref<PrivateUserData|undefined>();

	const conn = new RoomConnection(1, queue, currentSong, users, me);

	function downloadSong(song: string) {
		conn.downloadSong(song);
	}

</script>
