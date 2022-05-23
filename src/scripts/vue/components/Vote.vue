<template>
    <div class="flex gap-4 p-4">
        <button class="flex gap-2 justify-center items-center w-1/2 p-2 rounded-md text-green-500 border border-green-500" @click="voteOnSong(true)">
            <span>
                <img src="/images/green-arrow-up.svg" alt="" class="w-3">
            </span>

            <span>Yay</span>
        </button>

        <button class="flex gap-2 justify-center items-center w-1/2 p-2 rounded-md text-red-500 border border-red-500" @click="voteOnSong(false)">
            <span>
                <img src="/images/red-arrow-down.svg" alt="" class="w-3">
            </span>

            <span>Nay</span>
        </button>
    </div>
</template>

<script setup lang="ts">
    const emit = defineEmits(['vote-on-current-song']);

    function voteOnSong(vote: boolean|undefined) {
        console.log('vote on song', vote);
        
		emit('vote-on-current-song', vote);
    }
</script>
