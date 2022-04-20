<template>
    <div class="p-8 flex flex-col justify-between h-full">
        <div>
            <h2 class="text-3xl font-bold mb-8">Playlist</h2>
            <div>
                <div class="mb-6 relative" v-for="index in 10" :key="index">
                    <Song />
                    <span v-if="index === 1" class="absolute w-full h-px -top-3 bg-grey-700"></span>
                    <span class="absolute w-full h-px -bottom-3 bg-grey-700"></span>
                </div>
            </div>
        </div>
        <div class="flex">
            <Button :title="'Sync that!'"/>
        </div>
    </div>
</template>

<script setup lang="ts">
    import Button from '../parts/Button.vue';
    import Song from '../parts/Song.vue';
</script>
