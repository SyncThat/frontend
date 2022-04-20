<template>
    <div class="flex items-center">
        <figure class="relative mr-3">
            <img src="/placeholders/cover.jpg" alt="" class="w-14 h-14">
        </figure>
        <div>
            <span class="block">{{song.artist}}</span>
            <span class="block text-grey-500 text-sm">{{song.name}}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
    
    const props = defineProps({
        'song': Object
    });
</script>
