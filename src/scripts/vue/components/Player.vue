<template>
    <div class="h-1/3 p-8">
        <h2 class="text-3xl font-bold">Player</h2>
        <div>
            <div id="wave" ref="waveElement"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import WaveSurfer from 'wavesurfer.js';

    import getApi from '../../ts/helpers/getApi'; 
    
    const waveElement = ref(null);

    let waveSurfer:WaveSurfer;

    onMounted(() => {
        
        waveSurfer = WaveSurfer.create({
            container: waveElement.value,
            backend: 'MediaElement'
        }); 
        
        const headers = {
            Accept: 'application/json'
        }

        getApi(headers, '/placeholder.json').then(peaks => {
            waveSurfer.load('https://stoux.nl/music/MainConcernQBaseXtraRaw.mp3', peaks.data, 'metadata')

            waveSurfer.on('ready', function () {                
                // waveSurfer.play();
            });
        })
        .catch((e) => {
            console.error('error', e);
        });
    });
</script>
