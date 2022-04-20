<template>
    <div class="flex flex-col justify-between h-full">
        <h2 class="px-8 py-4 text-3xl font-bold bg-grey-900">Playlist</h2>
        <div class="h-full px-8 pt-4 overflow-auto">
            <div class="mb-6 relative" v-for="index in 20" :key="index">
                <Song />
                <span class="absolute w-full h-px -bottom-3 bg-grey-700"></span>
            </div>
        </div>
        <div class="flex py-4 px-8 bg-grey-900">
            <Button>Sync that!</Button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import Button from '../parts/Button.vue';
    import Song from '../parts/Song.vue';
</script>
