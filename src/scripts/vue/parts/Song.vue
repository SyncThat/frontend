<template>
    <div class="flex items-center" v-if='song'>
        <figure class="relative shrink-0 mr-3" v-if="song.songInfo?.thumbnail">
            <img class="w-14 h-14 rounded-xl overflow-hidden" :src="song.songInfo?.thumbnail" alt="">
        </figure>

        <div class="flex-1 min-w-0">
            <span class="block text-sm text-ellipsis whitespace-nowrap overflow-hidden">{{song.title}}</span>
            <span class="block text-xs text-grey-500">{{song.songInfo?.uploader}}</span>
        </div>

        <div class="flex flex-col items-end">
            <div class="flex shrink-0 gap-2 pl-4">
                <a :href="song.songInfo?.webpage_url" target="_blank">
                    <img src="/images/link.svg" alt="" class="w-3">
                </a>

                <button v-if="showControls" @click="$emit('play-now')">
                    <img src="/images/play.svg" alt="" class="w-3">
                </button>

                <button v-if="showControls" @click="$emit('remove')">
                    <img src="/images/remove.svg" alt="" class="w-3">
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
    import {Song} from '../../ts/models/Room';
	import { computed } from 'vue';
	import { formatDurationString } from '../../ts/helpers/functions';

	defineEmits(['play-now', 'remove'])
    
    const props = defineProps({
        'song': Object as PropType<Song>,
		'showControls': Boolean,
    });

	const durationString = computed(() => props.song ? formatDurationString(props.song.durationInSeconds) : '-')

</script>
