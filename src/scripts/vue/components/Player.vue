<template>
    <div class="h-1/3 p-8">
        <h2 class="text-3xl font-bold">Player</h2>
        <div>
            <div class="mb-6" id="wave" ref="waveElement"></div>

            <div class="flex gap-2">
                <Button @click="playHandler()">Play</Button>

                <Button @click="pauseHandler()">Pause</Button>
            </div>
            
        </div>
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
        }).catch((e) => {
            console.error('error', e);
        });
    });
</script>
