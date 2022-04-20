<template>
	<div class="flex text-white">
		<div class="w-3/12 h-screen bg-slate-800">
			<PlayList />
		</div>
		
		<div class="w-7/12 h-screen bg-slate-700">
			<Player />

			<Chat />
		</div>

		<div class="w-2/12 h-screen bg-slate-800">
			<Users />
		</div>
	</div>
</template>

<script setup lang="ts">
	import PlayList from '../vue/components/PlayList.vue';
	import Player from '../vue/components/Player.vue';
	import Chat from '../vue/components/Chat.vue';
	import Users from '../vue/components/Users.vue';
</script>
