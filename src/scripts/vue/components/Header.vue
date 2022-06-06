<template>
    <div class="flex justify-between items-center px-8 py-4 text-sm bg-blue-600">
        <div>
            <span class="opacity-75">Current room:</span> <strong>{{roomName}}</strong>
        </div>

		<!-- TODO: Better styling / position for this button -->
		<Button @click="emit('update:isPlaying', false)" v-if="isPlaying">Pause listening</Button>
		<Button @click="emit('update:isPlaying', true)" v-else>Join the sync!</Button>


        <div class="flex items-center" v-if='user'>
            <figure class="relative mr-2">
                <button class="flex justify-center items-center w-8 h-8 rounded-full bg-white/10" @click="emit('randomize-emoji')">
                    <span class="text-lg">{{ user.emoji }}</span>
                </button>
            </figure>
            <div class="flex flex-col">
                <span class="font-medium text-sm">
                    {{user.name}}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { PropType } from '@vue/runtime-core';
	import Button from './../parts/Button.vue';

    import { PrivateUserData } from "../../ts/models/Room";

	const emit = defineEmits<{
		(event: 'randomize-emoji'): void,
		(event: 'update:isPlaying', isPlaying: boolean): void,
	}>();

    const props = defineProps({
        'roomName': String,
        'user': Object as PropType<PrivateUserData>,
		'isPlaying': Boolean,
    });
</script>
