<template>
	<div class="flex-1 p-6">
		<div class="relative w-full h-full">
			<div class="flex flex-col absolute top-0 left-0 w-full h-full bg-blue-900 rounded-t-xl">
				<div class="h-full px-8 py-6 overflow-auto">
					<template v-for="message of messages" :key="message.id">
						<ChatMessage :message="getAsChatMessage(message)" v-if="isChat(message?.type)"></ChatMessage>
						<ChatNotification :message="getAsNotification(message)" v-else-if="isNotification(message?.type)"></ChatNotification>
					</template>
				</div>

				<div class="flex items-center relative mt-auto px-8 py-2 border-t border-white/25 text-sm">
					<div class="w-full">
						<span class="block max-h-20 overflow-x-hidden overflow-y-auto resize-none leading-tight whitespace-pre-wras focus:outline-none before:content-['Start_talking_bruh…'] before:opacity-50" :class="[showPlaceholder ? 'before:block' : 'before:hidden']" ref="chatMessageBox" role="textbox" contenteditable @focus="showPlaceholder = false" @blur="handleBlur()"></span>
					</div>

					<div>
						<Button class="shrink-0" @click.prevent="sendMessage">Send</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

	import { PropType } from '@vue/runtime-core';
	import { ref, defineEmits } from 'vue';
	import { LogMessage, LogMessageType, LogChatMessage, LogNotification } from '../../ts/models/Chat';
	import ChatMessage from '../parts/chat/Message.vue';
	import ChatNotification from '../parts/chat/Notification.vue';
	import Button from '../parts/Button.vue';

	const emit = defineEmits(['send-chat-message']);

	const props = defineProps({
		'messages': Array as PropType<LogMessage[]>
	});
	
	const chatMessageBox = ref<HTMLInputElement>();
	const showPlaceholder = ref<Boolean>(true);

	function handleBlur() {		
		const text = chatMessageBox.value?.innerText;

		showPlaceholder.value = text?.length === 0;
	};

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
		if(!chatMessageBox.value) return;

		let chatMessage = chatMessageBox.value.innerHTML;
		chatMessage = chatMessage.replace(/<br>/gi, "\n");
		
		if(chatMessage) {
			console.log(chatMessage);
	
			if(chatMessage.length > 0) {				
				emit('send-chat-message', chatMessage);
	
				chatMessageBox.value.innerText = '';
			}
		}
	}

</script>
