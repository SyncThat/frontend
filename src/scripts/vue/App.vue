<template>
	<div class="flex text-white bg-blue-800">
		<div class="flex flex-col shrink-0 w-3/12 h-screen">
			<Logo></Logo>
			<Playlist :playlist="queue" :played-songs="playedSongs" @add-song="downloadSong" :user="me" :users="users" :conn="conn" />
		</div>
		
		<div class="flex flex-col grow h-screen overflow-hidden">
			<Header :roomName="'🍺 Lekker lekker lekker'" :user='me' @randomize-emoji="conn.changeUser({ randomEmoji: true })" />
			
			<div class="flex flex-wrap h-full">	
				<div class="flex flex-col w-9/12">					
					<Player :currentSong="currentSong" :conn='conn' :user='me' :users="users" />

					<Chat :messages='messages' @send-chat-message="sendChatMessage" />
				</div>

				<div class="flex flex-col h-full w-3/12 bg-blue-500">
					<Vote @vote-on-current-song="voteOnCurrentSong" />

					<Users :users="users" :conn='conn' :user='me' />
				</div>
			</div>
		</div>
	</div>

	<!--TODO: getUserById functie, met fallback als user niet meer bestaat-->
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue';

	import Logo from '../vue/components/Logo.vue';
	import Playlist from './components/PlayList.vue';
	import Header from './components/Header.vue';
	import Player from '../vue/components/Player.vue';
	import Chat from '../vue/components/Chat.vue';
	import Vote from '../vue/components/Vote.vue';
	import Users from '../vue/components/Users.vue';
	import { RoomConnection } from '../ts/RoomConnection';
	import { CurrentSong, PrivateUserData, Song, User} from '../ts/models/Room';
	import { LogMessage } from '../ts/models/Chat';

	const queue = ref<Song[]|undefined>();
	const playedSongs = ref<Song[]|undefined>();
	const currentSong = ref<CurrentSong|undefined>();
	const users = ref<User[]>();
	const me = ref<PrivateUserData|undefined>();
	const logMessages = ref<LogMessage[]|undefined>();
	const privateMessages = ref<LogMessage[]>([]);

	const conn = new RoomConnection(1, queue, playedSongs, currentSong, users, me, logMessages, privateMessages);

	// a computed ref
	const messages = computed(() => {
		const publicMessages = logMessages.value ? logMessages.value : [];
		const combinedMessages = [...publicMessages, ...privateMessages.value];

		return combinedMessages.sort( (message1, message2) => message1.timestamp - message2.timestamp );
	});

	function downloadSong(song: string) {
		conn.downloadSong(song);
	}

	function sendChatMessage(message: string) {
		conn.sendChatMessage(message);
	}

	function voteOnCurrentSong(vote: boolean|undefined) {
		console.log(vote);
		conn.voteOnCurrentSong(vote);
	}
</script>
