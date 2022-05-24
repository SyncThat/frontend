<template>
    <div>
        <div class="flex items-center relative my-5 p-2 bg-gradient-to-r from-cyan-700 to-cyan-900 rounded">
            <span class="flex justify-center items-center shrink-0 w-8 h-8 mr-2 rounded-full bg-white/10" v-if="message?.emoji">
                <span class="text-1xl">{{message?.emoji}}</span>
            </span>

            <div class="w-full">
                <p class="text-white" v-html="message?.message"></p>

                <span class="absolute right-2 bottom-1 text-white/75 text-xs">{{formattedDate}}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
	import { PropType } from '@vue/runtime-core';
    
	import { LogNotification } from '../../../ts/models/Chat';
	import { formatDate } from '../../../ts/helpers/functions';

    const formattedDate = computed(() => {
        if(props.message){
            return formatDate(props.message?.timestamp);
        } else {
            return false;
        }
    });

	const props = defineProps({
		'message': Object as PropType<LogNotification>,
	})
</script>
