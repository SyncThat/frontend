<template>
    <div class="relative border-b pt-4 pb-5 border-white/25">
        <span class="block text-xs mb-2 leading-none">
            {{message?.name}}
        </span>
        
        <div class="w-full">
            <p class="text-sm text-white/75 leading-relaxed" v-html="decodedMessage"></p>

            <span class="absolute right-2 bottom-1 text-white/75 text-xs">{{formattedDate}}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
	import { PropType } from '@vue/runtime-core';

	import { LogChatMessage } from '../../../ts/models/Chat';
	import { formatDate, encodeHTML, highlight, ReplaceTag } from '../../../ts/helpers/functions';

	const props = defineProps({
		'message': Object as PropType<LogChatMessage>,
	});

    const formattedDate = computed(() => {
        if(props.message){
            return formatDate(props.message?.timestamp);
        } else {
            return false;
        }
    });

    const decodedMessage = computed(() => {
        if(props.message?.message) {
            let message = encodeHTML(props.message.message);
        
            message = highlight(ReplaceTag.ASTERISKS, message);
            message = highlight(ReplaceTag.UNDERSCORES, message); 
            message = highlight(ReplaceTag.HREF, message); 

            return message;
        } else {
            return false;
        }
    });
</script>
