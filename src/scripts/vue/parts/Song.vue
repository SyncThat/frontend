<template>
    <div class="flex items-center" v-if='song'>
        <figure class="relative mr-3">
            <img src="/placeholders/cover.jpg" alt="" class="w-14 h-14">
        </figure>
        <div>
<!--            <span class="block">{{song.artist}}</span>-->
            <span class="block text-grey-500 text-sm">{{song.title}}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { PropType } from '@vue/runtime-core';
    import {Song} from '../../ts/Modals';
    
    const props = defineProps({
        'song': Object as PropType<Song>
    });
</script>
