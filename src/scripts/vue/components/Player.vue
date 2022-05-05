<template>
    <div class="flex items-center gap-4 p-8 bg-grey-900">
        <div class="flex flex-col justify-between w-3/4 my-6">
            <div class="flex items-center gap-4 mb-8">
                <div>
                    <Button @click="pauseHandler()" v-if="isPlaying">Pause</Button>
                    <Button @click="playHandler()" v-else>Play</Button>
                </div>

                <div v-if="currentSong">
                    <span class="block">{{  currentSong.song.title }}</span>
                    <span class="block text-grey-500 text-sm">-</span>
                </div>
				<div v-if='!currentSong'>
					<span class="block">Nothing playing right now</span>
				</div>
            </div>

            <div class="mb-6" id="wave" ref="waveElement"></div>
            <audio ref="audioElement" style="display: none" preload="false" src="https://stoux.nl/music/MainConcernQBaseXtraRaw.mp3"></audio>
        </div>

        <figure class="w-1/4">
            <img src="/placeholders/cover.jpg" alt="" class="w-full">
        </figure>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
    import { PropType } from '@vue/runtime-core';

    import WaveSurfer from 'wavesurfer.js';
	import { CurrentSong, Song } from '../../ts/Modals';

    import Button from '../parts/Button.vue';
import getApi from '../../ts/helpers/getApi';
    
    const waveElement = ref(null);
    const audioElement = ref(null)
    const isPlaying = ref(false);

	let waveSurfer:WaveSurfer;
	let currentLoadedWaveform = '';
    
    const props = defineProps({
        'currentSong': Object as PropType<CurrentSong>
    });

	watch(() => props.currentSong, (newValue: CurrentSong|undefined, oldValue: CurrentSong|undefined) => {
		if (newValue) {
			if (!oldValue || oldValue.song.key !== newValue.song.key) {
				waveSurfer.load(`http://localhost:3555/songs/stream/${newValue.song.key}.mp3`);
				waveSurfer.play();
			}
			if (newValue.song.waveformGenerated && currentLoadedWaveform !== newValue.song.key) {
				currentLoadedWaveform = newValue.song.key;
				getApi({ Accept: 'application/json' }, `http://localhost:3555/songs/stream/${newValue.song.key}.mp3`).then(peaks => {
					waveSurfer.backend.setPeaks(peaks.data, newValue.song.durationInSeconds);
					waveSurfer.drawBuffer();
				});
			}
		}
	});


    function playHandler() {
        waveSurfer.play();
        isPlaying.value = true;
    }

    function pauseHandler() {
        waveSurfer.pause();
        isPlaying.value = false;
    }

    onMounted(() => {  
        waveSurfer = WaveSurfer.create({
            container: waveElement.value,
            backend: 'MediaElement',
            barWidth: 1,
            barHeight: 1, // the height of the wave
            barGap: 2,
            progressColor: '#57ECED',
            waveColor: '#B4B7BC',
            normalize: true
        }); 
        
        const headers = {
            Accept: 'application/json'
        }

        // getApi(headers, '/json/waveform.json').then(peaks => {
        //     waveSurfer.load('https://stoux.nl/music/MainConcernQBaseXtraRaw.mp3', [], 'metadata');

        //     setTimeout(() => {
        //         waveSurfer.backend.setPeaks(peaks.data, 100);
        //         waveSurfer.drawBuffer();
        //     }, 5000);

        //     // console.log(waveSurfer.getDuration());
            
        // }).catch((e) => {
        //     console.error('error', e);
        // });
    });
</script>
