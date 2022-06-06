<template>
    <div class="flex items-center" v-if='song' @mouseenter="showAltInfo = true" @mouseleave="showAltInfo = false">
        <figure class="relative shrink-0 mr-3" v-if="song.songInfo?.thumbnail">
			<div v-if="showAltInfo && queuedBy" class="flex justify-center items-center w-14 h-14 rounded-xl bg-white/10">
				<span class="text-3xl">{{ queuedBy.emoji }}</span>
			</div>
            <img v-else class="w-14 h-14 rounded-xl overflow-hidden" :src="song.songInfo?.thumbnail" alt="">
        </figure>

        <div class="flex-1 min-w-0">
            <span class="block text-sm text-ellipsis whitespace-nowrap overflow-hidden">{{song.title}}</span>

			<span class="block text-xs text-grey-500" v-if="showAltInfo && queuedBy">Queued by <span class="font-bold">{{ queuedBy.name }}</span></span>
            <span class="block text-xs text-grey-500" v-else>{{ song.songInfo?.uploader }}</span>
        </div>

        <div class="flex flex-col items-end">
            <div class="flex shrink-0 gap-2 pl-4" v-if="showAltInfo">
				<!-- TODO: Fix icon colors -->
				<!-- TODO: Should be drag & drop -->
				<button v-if="showControls && canMoveUp" @click="emit('move-up')" class="fill" title="Move the song up one position">
					<img src="/images/green-arrow-up.svg" alt="" class="w-3">
				</button>
				<button v-if="showControls && canMoveDown" @click="emit('move-down')" title="Move the song down one position">
					<img src="/images/red-arrow-down.svg" alt="" class="w-3">
				</button>

                <a :href="song.songInfo?.webpage_url" target="_blank" title="Original link to the song">
                    <img src="/images/link.svg" alt="" class="w-3">
                </a>

				<!-- TODO: Add confirmation dialog for this action -->
                <button v-if="showControls && song.ready" @click="emit('play-now')" title="Force the song to be played right now">
                    <img src="/images/play.svg" alt="" class="w-3">
                </button>

				<!-- TODO: Add confirmation dialog for this action -->
                <button v-if="showControls" @click="emit('remove')" title="Remove the song from the queue">
                    <img src="/images/remove.svg" alt="" class="w-3">
                </button>
            </div>
			<div class="flex shrink-0 gap-2 pl-4" v-else>
				<!-- TODO: @FE Fix this nasty ass way of taking the same space as other buttons -->
				<button disabled>
					<img src="/images/green-arrow-up.svg" alt="" class="w-3 invisible" >
				</button>
			</div>
            
            <span class="block mt-2 text-xs text-grey-500">
				{{song.ready ? durationString : `${song.downloadProgress.toFixed(1)}%`}}
			</span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { PropType } from '@vue/runtime-core';
	import { Song, User as ModelUser } from "../../ts/models/Room";
	import { computed, ref } from "vue";
	import { formatDurationString } from '../../ts/helpers/functions';

	const emit = defineEmits<{
		(event: 'play-now'): void,
		(event: 'remove'): void,
		(event: 'move-up'): void,
		(event: 'move-down'): void,
	}>()
    
    const props = defineProps({
        'song': Object as PropType<Song>,
		'showControls': Boolean,
		'canMoveUp': Boolean,
		'canMoveDown': Boolean,
		'users': Array as PropType<Array<ModelUser>>,
    });

	const showAltInfo = ref<boolean>(false);

	const durationString = computed(() => props.song ? formatDurationString(props.song.durationInSeconds) : '-')
	const queuedBy = computed<ModelUser|undefined>(() => props.users?.find(user => user.id === props.song?.requestedBy));


</script>
