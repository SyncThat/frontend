<template>
    <div class="p-12 pb-2 pt-2">
        <div class="flex flex-col">
			<div class="mb-4">
				<div v-if='!currentSong'>
					<span class="block">Nothing playing right now</span>
				</div>
			</div>
			
            <div class="flex flex-wrap items-center gap-8 mb-1">
				<figure v-if="currentSong?.song.songInfo?.thumbnail">
					<img :src="currentSong?.song.songInfo?.thumbnail" alt="" class="h-28 w-28 rounded-lg">
				</figure>

                <div class="flex-1 min-w-0" v-if="currentSong">
					<div class="flex gap-2 mb-2">
						<span class="flex">
							<img src="/images/music.svg" alt="" class="w-4">	
						</span>

						<div class="text-xs font-medium">
							DJ: <span v-html="currentRequestedBy"></span>
						</div>
					</div>

                    <p class="mb-2 text-3xl font-medium text-ellipsis whitespace-nowrap overflow-hidden">{{ currentSong.song.title }}</p>

                    <span class="block text-white/75 text-xl">{{ currentSong.song.songInfo?.uploader }}</span>
                </div>
            </div>
			
			<div class="flex justify-end w-full mb-2" v-if="currentSong?.song?.songInfo">
				<div class="flex shrink-0 gap-4">
					<button class="flex items-center gap-2 text-sm" v-if="canSkipCurrentSong" @click.prevent="conn.skipSong()">
						<img src="/images/remove.svg" alt="" class="w-3">
						Force skip
					</button>


					<a class="flex items-center gap-2 text-sm" :href="currentSong.song.songInfo.webpage_url" target="_blank">
						<img src="/images/link.svg" alt="" class="w-3">
						Song link
					</a>

					<button class="flex items-center gap-2 text-sm" @click.prevent="conn.voteSkip()">
						<img src="/images/skip.svg" alt="" class="w-3">

						Vote skip
					</button>
				</div>
			</div>
        </div>

		<!-- TODO: @FE Ghetto hiding -->
        <div id="wave" ref="waveElement" class="overflow-hidden" :class="{ 'h-0': !props.currentSong, 'opacity-50': !isPlaying }"></div>

		<div class="flex justify-between w-full mb-2 mt-1" v-if="currentSongDuration">
			<div class="text-xs text-gray-500">
				{{ currentSongCurrentTimestamp }}
			</div>
			<div class="text-xs text-gray-500">
				{{ currentSongDuration }}
			</div>
		</div>

    </div>
</template>

<script setup lang="ts">
	import { onMounted, Ref, ref, watch, computed } from 'vue';
    import { PropType } from '@vue/runtime-core';

	import { CurrentSong, PrivateUserData, Song, User } from '../../ts/models/Room';

    import Button from '../parts/Button.vue';
	import getApi from '../../ts/helpers/getApi';

	import WaveSurfer from 'wavesurfer.js';
	import { RoomConnection } from '../../ts/RoomConnection';
	import { Config } from '../../ts/Config';
	import { formatDurationString } from '../../ts/helpers/functions';

	const emit = defineEmits<{
		(event: 'update:isPlaying', isPlaying: boolean): void,
	}>();

    const waveElement: Ref<HTMLElement|undefined> = ref(undefined);
	const currentSongAtSeconds = ref(0);

	// The wavesurfer instance.
	let waveSurfer: WaveSurfer;
	// ID of the currently loaded/loading waveform (if any)
	let currentLoadedWaveform: string|undefined = undefined;
	let playDelayTimeout: NodeJS.Timeout|undefined = undefined;

    const props = defineProps({
        'currentSong': Object as PropType<CurrentSong>,
		'conn': Object as PropType<RoomConnection>,
        'user': Object as PropType<PrivateUserData>,
		'users': Object as PropType<User[]>,
		'isPlaying': Boolean,
    });

	const currentRequestedBy = computed((publicId: string) => {
		const requestedBy = props.currentSong?.song.requestedBy;
		const user:User|undefined = props.users?.find(user => user.id === requestedBy);
		
		return user ? user.name : 'Unknown';
	});
	const currentSongCurrentTimestamp = computed(() => {
		if (!props.currentSong || !props.isPlaying || !props.currentSong?.song?.durationInSeconds) {
			return '-';
		} else {
			return formatDurationString( currentSongAtSeconds.value, props.currentSong.song.durationInSeconds);
		}
	});
	const currentSongDuration = computed(() => {
		if (!props.currentSong?.song?.durationInSeconds) {
			return undefined;
		} else {
			return formatDurationString( props.currentSong.song.durationInSeconds );
		}
	});
	const canSkipCurrentSong = computed(() => props.user?.admin || (
		props.currentSong?.song?.requestedBy && props.currentSong?.song?.requestedBy === props.user?.publicId
	));


	watch(() => props.currentSong, (newValue: CurrentSong|undefined, oldValue: CurrentSong|undefined) => {
		handlePlayingSong(newValue, oldValue)
	});
	watch(() => props.isPlaying, isPlaying => {
		if (isPlaying) {
			handlePlayingSong(props.currentSong, props.currentSong);
		} else {
			waveSurfer.pause();
		}
	});

	function handlePlayingSong(current: CurrentSong|undefined, previous: CurrentSong|undefined = undefined) {
		if (playDelayTimeout) {
			clearTimeout(playDelayTimeout);
		}

		if (!current) {
			// Nothing is playing. Wipe the waveform (if there's one).
			waveSurfer.empty();
			currentLoadedWaveform = undefined;
			return;
		}

		// Check if a new song should be loaded
		if (!previous || previous.song.key !== current.song.key) {
			waveSurfer.pause();
			waveSurfer.load(`${Config.getMediaHost()}/${current.song.key}.mp3`, [], 'auto', current.song.durationInSeconds);
			waveSurfer.stop();
		}
		// Check if a new Waveform is available that we've currently not loaded in yet.
		if (current.song.waveformGenerated && currentLoadedWaveform !== current.song.key) {
			currentLoadedWaveform = current.song.key;
			getApi({ Accept: 'application/json' }, `${Config.getMediaHost()}/${current.song.key}.json`).then(peaks => {
				waveSurfer.backend.setPeaks(peaks.data, current.song.durationInSeconds);
				waveSurfer.drawBuffer();
			});
		}

		// Calculate where we are currently in the track and where we should be
		const now = (new Date()).getTime();
		if (now + 750 < current.eventTimestamp) {
			console.log('Future...');
			// Event in the future... Wait for it.
			playDelayTimeout = setTimeout(() => {
				if (props.isPlaying) {
					waveSurfer.play(current.lastCurrentSeconds);
				} else {
					waveSurfer.skip(current.lastCurrentSeconds - waveSurfer.getCurrentTime());
					currentSongAtSeconds.value = waveSurfer.getCurrentTime();
				}

			}, now - current.eventTimestamp);
		} else {
			// Calculate the number of seconds passed since the event
			const secondsPassed = Math.max(0, Math.floor(( now - current.eventTimestamp ) / 1000 ));

			// Check where we should be in the song
			const shouldBeAtSeconds = current.lastCurrentSeconds + secondsPassed;

			// Check if more than a second difference (or not paying)
			const currentSeconds = waveSurfer.getCurrentTime();
			const secondsOffset = Math.abs(shouldBeAtSeconds - currentSeconds);
			if (secondsOffset > 1 || !waveSurfer.isPlaying()) {
				console.log('Skipping to', shouldBeAtSeconds);
				if (props.isPlaying) {
					waveSurfer.play(shouldBeAtSeconds);
				} else {
					waveSurfer.skip(shouldBeAtSeconds - waveSurfer.getCurrentTime());
					currentSongAtSeconds.value = waveSurfer.getCurrentTime();
				}
			}
		}
	}

    onMounted(() => {
		const element = waveElement.value;
		if (!element) {
			return;
		}

        waveSurfer = WaveSurfer.create({
            container: element,
            backend: 'MediaElement',
            barWidth: 1,
            barHeight: 1, // the height of the wave
            barGap: 2,
            progressColor: '#57ECED',
            waveColor: '#B4B7BC',
			height: 256,
            normalize: true,
			responsive: true,
			mediaControls: false,
			hideScrollbar: true,
			minPxPerSec: 1,
        });

		// Mount events
		waveSurfer.on('audioprocess', (args: number) => {
			currentSongAtSeconds.value = args;
		})

		waveSurfer.on('error', (args: any) => {
			console.log('error', args);
		})
		waveSurfer.on('finish', (args: any) => {
			console.log('finish', args);
		})
		waveSurfer.on('interaction', (args: any) => {
			console.log('interaction', args);
		})
		waveSurfer.on('loading', (args: any) => {
			console.log('loading', args);
		})
		waveSurfer.on('pause', (args: any) => {
			console.log('pause', args);
		})
		waveSurfer.on('play', (args: any) => {
			console.log('play', args);
		})
		waveSurfer.on('ready', (args: any) => {
			console.log('ready', args, waveSurfer.isPlaying(), waveSurfer.isReady);
		})
        
		waveSurfer.on('seek', (args: any) => {
			// We're gonna ignore any seeking if they aren't synced
			if (!props.isPlaying) {
				return;
			}

            if(props.user?.admin) {
                setTimeout(() => {
                    props.conn?.skipToTimestamp(waveSurfer.getCurrentTime());
                });
            } else {
				// Just force the user back to the current position
				handlePlayingSong(props.currentSong, props.currentSong);
            }
		})

		waveSurfer.on('scroll', (args: any) => {
			console.log('scroll', args);
		})
		waveSurfer.on('waveform-ready', (args: any) => {
			console.log('waveform-ready', args);
		})

		// Listen to 'media buttons' (keyboard, etc)
		navigator.mediaSession.setActionHandler('play', async function() {
			emit('update:isPlaying', true);
		});

		navigator.mediaSession.setActionHandler('pause', function() {
			emit('update:isPlaying', false);
		});


    });
</script>

<style>
#wave {
	max-height: 128px;
}
</style>
