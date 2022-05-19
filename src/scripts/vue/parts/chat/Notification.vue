<template>
    <div>
        <div class="flex items-center my-5 p-2 bg-gradient-to-r from-cyan-700 to-cyan-900 rounded">
            <span class="flex justify-center items-center w-8 h-8 mr-2 rounded-full bg-white/10" v-if="message?.emoji">
                <span class="text-1xl">{{message?.emoji}}</span>
            </span>

            <div class="text-white">
                <p v-html="message?.message"></p>

                <span>{{message?.timestamp}}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
	import { PropType } from '@vue/runtime-core';
	import { LogNotification } from '../../../ts/models/Chat';

	const props = defineProps({
		'message': Object as PropType<LogNotification>,
	})
</script>
