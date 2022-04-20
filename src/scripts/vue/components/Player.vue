<template>
    <div class="flex gap-4 p-8 bg-grey-900">
        <div class="flex flex-col justify-between w-2/3 my-6">
            <div class="flex gap-2 mb-6">
                <Button @click="playHandler()">Play</Button>

                <Button @click="pauseHandler()">Pause</Button>
            </div>

            <div class="mb-8">
                <span class="block">Rick Astley</span>
                <span class="block text-grey-500 text-sm">Never Gonna Give You Up</span>
            </div>

            <div class="mb-6" id="wave" ref="waveElement"></div>
        </div>

        <figure class="relative w-1/3">
            <img src="/placeholders/cover.jpg" alt="" class="w-full">
        </figure>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import WaveSurfer from 'wavesurfer.js';

    import getApi from '../../ts/helpers/getApi'; 

    import Button from '../parts/Button.vue';
    
    const waveElement = ref(null);

    let waveSurfer:WaveSurfer;

    function playHandler() {
        waveSurfer.play();
    }

    function pauseHandler() {
        waveSurfer.pause();
    }

    onMounted(() => {  
        waveSurfer = WaveSurfer.create({
            container: waveElement.value,
            backend: 'MediaElement',
            barWidth: 2,
            barHeight: 1, // the height of the wave
            barGap: 2,
            progressColor: '#0E7490',
            waveColor: '#B4B7BC'
        }); 
        
        const headers = {
            Accept: 'application/json'
        }

        getApi(headers, '/placeholder.json').then(peaks => {
            waveSurfer.load('https://stoux.nl/music/MainConcernQBaseXtraRaw.mp3', peaks.data, 'metadata')

            console.log(waveSurfer.getDuration());
            
        }).catch((e) => {
            console.error('error', e);
        });
    });
</script>
