<template>
    <div class="p-12">
        <div class="flex flex-col">
			<div class="mb-4">
				<Button @click="pauseHandler()" v-if="isPlaying">Stop listening</Button>
				<Button @click="playHandler()" v-else>Start listening</Button>
								
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
			
			<div class="flex justify-end w-full mb-8">
				<div class="flex shrink-0 gap-4">
					<a class="flex items-center gap-2 text-sm" href="#" target="_blank">
						<img src="/images/link.svg" alt="" class="w-3">

						Song link
					</a>

					<button class="flex items-center gap-2 text-sm" href="#" target="_blank">
						<img src="/images/skip.svg" alt="" class="w-3">

						Vote skip
					</button>
				</div>
			</div>
        </div>

        <div id="wave" ref="waveElement"></div>
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

    const waveElement: Ref<HTMLElement|undefined> = ref(undefined);
    const isPlaying = ref(false);

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
    });

	const currentRequestedBy = computed((publicId: string) => {
		const requestedBy = props.currentSong?.song.requestedBy;
		const user:User|undefined = props.users?.find(user => user.id === requestedBy);
		
		return user ? user.name : 'Unknown';
	});

	watch(() => props.currentSong, (newValue: CurrentSong|undefined, oldValue: CurrentSong|undefined) => {
		console.log('current song changed');
		
		handlePlayingSong(newValue, oldValue)
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
			waveSurfer.stop();
			waveSurfer.load(`${Config.getMediaHost()}/${current.song.key}.mp3`, [], 'auto', current.song.durationInSeconds);
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
				waveSurfer.play(current.lastCurrentSeconds);
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
				waveSurfer.play(shouldBeAtSeconds);
			}
		}
	}

    function playHandler() {
        isPlaying.value = true;
		handlePlayingSong(props.currentSong, props.currentSong);
    }

    function pauseHandler() {
        waveSurfer.pause();
        isPlaying.value = false;
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
            normalize: true,
			responsive: true,
			mediaControls: true,
        }); 

		// Mount events
		waveSurfer.on('audioprocess', (args: any) => {
			// console.log('audioprocess', args);
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
            if(props.user?.admin) {
                setTimeout(() => {
                    props.conn?.skipToTimestamp(waveSurfer.getCurrentTime());
                });
            } else {
                playHandler();
            }
		})

		waveSurfer.on('scroll', (args: any) => {
			console.log('scroll', args);
		})
		waveSurfer.on('waveform-ready', (args: any) => {
			console.log('waveform-ready', args);
		})
    });
</script>
