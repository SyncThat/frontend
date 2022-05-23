<template>
    <div class="flex items-center gap-4 px-8">
        <div class="flex flex-col justify-between w-3/4 my-6">
            <div class="flex items-center gap-4 mb-8">
                <div>
                    <Button @click="pauseHandler()" v-if="isPlaying">Pause</Button>
                    <Button @click="playHandler()" v-else>Play</Button>
                </div>

                <div v-if="currentSong">
					<span class="block">DJ: <span v-html="currentRequestedBy"></span></span>
                    <span class="block">{{ currentSong.song.title }}</span>
                    <span class="block text-grey-500 text-sm">{{ currentSong.song.songInfo?.uploader }}</span>
                </div>
				
				<div v-if='!currentSong'>
					<span class="block">Nothing playing right now</span>
				</div>
            </div>

            <div class="mb-6" id="wave" ref="waveElement"></div>
            <audio ref="audioElement" style="display: none" preload="false"></audio>
        </div>

        <figure class="w-1/4" v-if="currentSong?.song.songInfo?.thumbnail">
            <img :src="currentSong?.song.songInfo?.thumbnail" alt="" class="w-full">
        </figure>
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
    const audioElement = ref(null)
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
			waveSurfer.load(`${Config.getBackendHost('http')}/songs/stream/${current.song.key}.mp3`, [], 'auto', current.song.durationInSeconds);
		}
		// Check if a new Waveform is available that we've currently not loaded in yet.
		if (current.song.waveformGenerated && currentLoadedWaveform !== current.song.key) {
			currentLoadedWaveform = current.song.key;
			getApi({ Accept: 'application/json' }, `${Config.getBackendHost('http')}/songs/stream/${current.song.key}.json`).then(peaks => {
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
