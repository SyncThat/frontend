<template>
    <div class="flex items-center" v-if='user'>
        <figure class="relative mr-4">
			<!-- TODO: Emoticon image -->
            <div class="flex justify-center items-center w-14 h-14 rounded-full bg-white/10">
                <span class="text-3xl">{{ user.emoji ? user.emoji : '-' }}</span>
            </div>

            <span class="status absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-4 ring-grey-800" :class="{ 'bg-red-500': !user.connected, 'bg-lime-500': user.connected }"></span>
        </figure>
        <div class="flex flex-col">
            <span class="font-medium text-sm">
                {{user.name}}
            </span>

            <span class="text-sm text-white/75">Sync <span class="text-white font-medium" v-html="user.admin ? 'DJ' : 'Listener'"></span></span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { User } from '../../ts/models/Room';
    import { PropType } from '@vue/runtime-core';

    const props = defineProps({
        'user': Object as PropType<User>
    });
</script>
