<template>
    <div class="border-b py-4 border-white/25">
        <span class="block text-xs mb-3 leading-none">
            {{message?.name}}
        </span>
        
        <p class="text-sm text-white/75 leading-relaxed">
            {{message?.message}}
        </p>
    </div>
</template>

<script setup lang="ts">
	import { PropType } from '@vue/runtime-core';
	import { LogChatMessage } from '../../../ts/models/Chat';

	const props = defineProps({
		'message': Object as PropType<LogChatMessage>,
	})
</script>
