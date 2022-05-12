<template>
    <div class="bg-grey-700 p-8 overflow-auto">
		<h2 class="mb-4 text-3xl font-bold">Chat</h2>

		<p v-for="message of messages" :class="{ 'text-red-50': message.type === 'error' }">
			{{ message.message }}
		</p>
    </div>
</template>

<script setup lang="ts">

	import { PropType } from '@vue/runtime-core';
	import { RoomConnection } from '../../ts/RoomConnection';
	import { onMounted, ref } from 'vue';
	import { Notice } from '../../ts/Modals';

	const props = defineProps({
		'conn': Object as PropType<RoomConnection>,
	})

	// Data
	// TODO: Specify multiple types
	const messages = ref<Notice[]>([]);

	onMounted(() => {
		props.conn?.addNoticeCallback(notice => {
			console.log('Notice', notice);
			messages.value.push(notice);
		});
	});


</script>
