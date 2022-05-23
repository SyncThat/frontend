<template>
    <div class="flex flex-col gap-4 relative py-8 px-6 z-10 before:content[''] before:absolute before:bottom-0 before:left-0 before:h-[150%] before:w-full before:-z-10 before:bg-gradient-to-t before:from-cyan-900 before:to-cyan-900/0">
        <div class="flex items-center gap-4 w-full rounded-lg text-gray-200 ring-1 p-2 ring-gray-400">
            <div>
                <input type="text" id="song-url" name="song-url" placeholder="Paste your song URL…" v-model="songURL" class="pl-4 appearance-none w-full bg-transparent focus:outline-none"/>
            </div>

            <div class="shrink-0 ml-auto">
                <Button class="" @click="addSong">Sync</Button>
            </div>
        </div>
    </div>    
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    
    import Button from '../parts/Button.vue';

    const songURL = ref<String>('');
       
    const headers = {
        Accept: 'application/json'
    }

	const emit = defineEmits(['song'])
    
    function addSong() {
		const url = songURL.value;
		if (!url) {
			return;
		}

		emit('song', url);

    }
</script>
