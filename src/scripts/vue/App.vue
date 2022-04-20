<template>
	<div class="flex text-white">
		<div class="w-3/12 h-screen bg-grey-800">
			<PlayList />
		</div>
		
		<div class="w-7/12 h-screen bg-grey-700">
			<Player />

			<Chat />
		</div>

		<div class="w-2/12 h-screen bg-grey-800">
			<Users />
		</div>
	</div>
</template>

<script setup lang="ts">
	import PlayList from './components/Playlist.vue';
	import Player from '../vue/components/Player.vue';
	import Chat from '../vue/components/Chat.vue';
	import Users from '../vue/components/Users.vue';
</script>
