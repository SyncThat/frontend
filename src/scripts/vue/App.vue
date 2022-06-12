<template>
	<div class="flex text-white bg-blue-800">
		<div class="flex flex-col shrink-0 w-3/12 h-screen">
			<Logo></Logo>
			<Playlist :playlist="queue" :played-songs="playedSongs" @add-song="downloadSong" :user="me" :users="users" :conn="conn" :class="{ 'opacity-20': !hasJoinedSync }" />
		</div>
		
		<div class="flex flex-col grow h-screen overflow-hidden">
			<Header :roomName="roomName"
					:user='me'
					v-model:is-playing="isPlaying"
					@randomize-emoji="conn.changeUser({ randomEmoji: true })" />

			<div class="flex flex-wrap h-full" :class="{ 'opacity-20': !hasJoinedSync }">
				<div class="flex flex-col w-9/12">					
					<Player :currentSong="currentSong" :conn='conn' :user='me' :users="users" v-model:is-playing="isPlaying" />

					<Chat :messages='messages'
						  @send-chat-message="sendChatMessage"
						  @is-typing="state => conn.updateTypingState(state)" />
				</div>

				<div class="flex flex-col h-full w-3/12 bg-blue-500">
					<Vote :user="me" :current-song="currentSong"
						  @vote-on-current-song="voteOnCurrentSong" />

					<Users :users="users" :conn='conn' :user='me' :votes="currentSong?.song?.likedDisliked" />
				</div>
			</div>
		</div>
	</div>

	<!--TODO: getUserById functie, met fallback als user niet meer bestaat-->
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";

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
	import { manager } from '../ts/notifications';

	const isPlaying = ref<boolean>(false);
	const hasJoinedSync = ref<boolean>(false);
	const queue = ref<Song[]|undefined>();
	const playedSongs = ref<Song[]|undefined>();
	const currentSong = ref<CurrentSong|undefined>();
	const users = ref<User[]>();
	const me = ref<PrivateUserData|undefined>();
	const logMessages = ref<LogMessage[]|undefined>();
	const privateMessages = ref<LogMessage[]>([]);
	const roomName = ref<string>('🍺 Lekker lekker lekker');

	const conn = new RoomConnection(1, queue, playedSongs, currentSong, users, me, logMessages, privateMessages);

	// a computed ref
	const messages = computed(() => {
		const publicMessages = logMessages.value ? logMessages.value : [];
		const combinedMessages = [...publicMessages, ...privateMessages.value];

		return combinedMessages.sort( (message1, message2) => message1.timestamp - message2.timestamp );
	});

	watch(isPlaying, value => {
		if (value) {
			// Configure notifications when the user has joined the sync
			if (!hasJoinedSync.value) {
				// Configure the browser notifications
				manager.watchMessageStreams(me, logMessages, privateMessages);

				// Request for notification permission if not done yet
				if (!manager.canNotify) {
					manager.requestPermission();
				}
			}

			hasJoinedSync.value = true
		}

		conn.updatePlayState(value);
	});

	watch(currentSong, setPageTitle);
	watch(roomName, setPageTitle);


	function downloadSong(song: string) {
		conn.downloadSong(song);
	}

	function sendChatMessage(message: string) {
		conn.sendChatMessage(message);
	}

	function voteOnCurrentSong(vote: boolean|undefined) {
		conn.voteOnCurrentSong(vote);
	}

	function setPageTitle() {
		const parts = [ 'SyncThat' ];

		let songTitle = currentSong.value?.song?.title;
		if (songTitle) {
			parts.push(songTitle);
		}

		parts.push(roomName.value);

		document.title = parts.join(' - ');
	}


	// TODO: Show an initial modal to join the sync instead of ghetto opacity option

	onMounted(() => {
		// Listen to a bunch of events to update the active state
		const sol = () => conn.signOfLife();
		document.addEventListener('scroll', sol);
		document.addEventListener('mousemove', sol);
		document.addEventListener('touchmove', sol);
		document.addEventListener('touchstart', sol);
		document.addEventListener('click', sol);
		document.addEventListener('keyup', sol);
	});
</script>
