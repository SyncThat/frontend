<template>
	<div class="flex-1 px-6 pb-6">
		<div class="relative w-full h-full">
			<div class="flex flex-col absolute top-0 left-0 w-full h-full bg-blue-900 rounded-t-xl">
				<div class="h-full px-8 py-6 overflow-auto" ref="chatWindowRef">
					<template v-for="message of messages" :key="message.id">
						<ChatMessage :message="getAsChatMessage(message)" v-if="isChat(message?.type)"></ChatMessage>
						<ChatNotification :message="getAsNotification(message)" v-else-if="isNotification(message?.type)"></ChatNotification>
					</template>
				</div>

				<!-- TODO: Show scroll indicator if not sticky -->

				<div class="flex items-center relative mt-auto px-8 py-2 border-t border-white/25 text-sm">
					<div class="w-full">
						<span
							class="block max-h-20 overflow-x-hidden overflow-y-auto resize-none leading-tight whitespace-pre-wras focus:outline-none before:content-['Start_talking_bruh…'] before:opacity-50"
							:class="[showPlaceholder ? 'before:block' : 'before:hidden']" ref='chatMessageBox'
							@keydown.enter.exact.prevent='sendMessage'
							role='textbox' contenteditable @focus='showPlaceholder = false' @blur='handleBlur()'></span>
					</div>

					<div>
						<Button class="shrink-0" @click.prevent="sendMessage">Send</Button>
					</div>
				</div>

				<!-- TODO: Add typing indicator -->
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

	import { PropType } from '@vue/runtime-core';
	import { nextTick, onMounted, ref, watch } from "vue";
	import { LogMessage, LogMessageType, LogChatMessage, LogNotification } from '../../ts/models/Chat';
	import ChatMessage from '../parts/chat/Message.vue';
	import ChatNotification from '../parts/chat/Notification.vue';
	import Button from '../parts/Button.vue';

	const emit = defineEmits<{
		(event: 'send-chat-message', message: string): void,
		(event: 'is-typing', isTyping: boolean): void,
	}>();

	const props = defineProps({
		'messages': Array as PropType<LogMessage[]>,
	});

	const chatMessageBox = ref<HTMLInputElement>();
	const showPlaceholder = ref<Boolean>(true);

	const chatWindowRef = ref<HTMLDivElement>();
	const isStickyChat = ref<Boolean>(true);
	const currentChatMessage = ref<string>('');
	const isTyping = ref<boolean>(false);

	// Watch the messages to scroll the chat window to the bottom
	watch(() => props.messages, () => scrollToNewMessages());

	// Emit isTyping state
	let isTypingTimeout: NodeJS.Timeout|undefined = undefined;
	watch(currentChatMessage, message => {
		clearTimeout(isTypingTimeout);
		if (message) {
			isTyping.value = true;
			isTypingTimeout = setTimeout(() => {
				isTyping.value = false;
			}, 5000);
		} else {

			isTyping.value = false;
		}
	});
	watch(isTyping, value => emit("is-typing", value));


	function scrollToNewMessages() {
		if (isStickyChat.value && chatWindowRef.value) {
			nextTick(() => {
				const chatWindow = chatWindowRef.value;
				if (chatWindow && chatWindow.scrollHeight) {
					chatWindow.scrollTop = chatWindow.scrollHeight;
				}
			});
		}
	}

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

		let chatMessage = chatMessageBox.value.innerText;
		// chatMessage = chatMessage.replace(/<br>/gi, "\n");
		
		if(chatMessage) {
			console.log(chatMessage);
	
			if(chatMessage.length > 0) {				
				emit('send-chat-message', chatMessage);
	
				chatMessageBox.value.innerText = '';
				currentChatMessage.value = '';
			}
		}
	}

	onMounted(() => {
		// Add key listener to chat message box to update the current message in a ref (which we can watch)
		chatMessageBox.value?.addEventListener('keyup', () => {
			currentChatMessage.value = chatMessageBox.value?.innerText ?? '';
		});

		// Register a scroll listener to make the chat sticky
		chatWindowRef.value?.addEventListener('scroll', event => {
			const ref = chatWindowRef.value;
			if (ref) {
				isStickyChat.value = Math.ceil(ref.scrollTop + ref.clientHeight) >= ref.scrollHeight
			}
		});

		// Scroll the chat to the bottom
		scrollToNewMessages();
	})

</script>
