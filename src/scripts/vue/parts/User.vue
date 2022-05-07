<template>
    <div class="flex items-center" v-if='user'>
        <figure class="relative mr-3">
            <img src="/placeholders/user.jpg" alt="" class="w-10 h-10 rounded-full">
            <span class="status absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-4 ring-grey-800"
				  :class="{ 'bg-red-500': !user.connected, 'bg-lime-500': user.connected }"></span>
        </figure>
        <span>{{user.name}}</span>
    </div>
</template>

<script setup lang="ts">
    import { User } from '../../ts/Modals';
    import { PropType } from '@vue/runtime-core';

    const props = defineProps({
        'user': Object as PropType<User>
    });
</script>
