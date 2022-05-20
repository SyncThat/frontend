<template>
	<div class="p-6 grow">
		<div class="bg-blue-900 py-4 px-8 overflow-auto h-full rounded-t-xl">
			<template v-for="message of messages" :key="message.id">
				<ChatMessage :message="getAsChatMessage(message)" v-if="isChat(message?.type)"></ChatMessage>
				<ChatNotification :message="getAsNotification(message)" v-else-if="isNotification(message?.type)"></ChatNotification>
			</template>

			<form class="sticky bottom-0 left-0" @submit.prevent="sendMessage">
				<textarea class="text-black" name="" id="" rows="10" required v-model="chatMessage"></textarea>

				<Button type="submit">Send</Button>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">

	import { PropType } from '@vue/runtime-core';
	import { RoomConnection } from '../../ts/RoomConnection';
	import { onMounted, ref, defineEmits } from 'vue';
	import { Notice } from '../../ts/models/Room';
	import { LogChatMessage, LogNotification } from '../../ts/models/Chat';
	import { LogMessage, LogMessageType } from '../../ts/models/Chat';
	import ChatMessage from '../parts/chat/Message.vue';
	import ChatNotification from '../parts/chat/Notification.vue';
	import Button from '../parts/Button.vue';


	const emit = defineEmits(['send-chat-message']);

	const props = defineProps({
		'messages': Array as PropType<LogMessage[]>
	});
	
	const chatMessage = ref<string>('');

	function isChat(type:LogMessageType) {
		return type === LogMessageType.ChatMessage;
	}

	function getAsChatMessage(message: LogMessage): LogChatMessage {
		return message as LogChatMessage;
	}


	function isNotification(type:LogMessageType) {
		return type === LogMessageType.Notification;
	}

	function getAsNotification(message: LogMessage): LogNotification {
		return message as LogNotification;
	}

	function sendMessage() {
		if(chatMessage.value.length > 0) {
			emit('send-chat-message', chatMessage.value);

			chatMessage.value = '';
		}
	}

	onMounted(() => {
		// props.conn?.addNoticeCallback(notice => {
		// 	console.log('Notice', notice);
		// 	messages.value.push(notice);
		// });
	});

</script>
