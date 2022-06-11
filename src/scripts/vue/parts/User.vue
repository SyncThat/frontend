<template>
    <div class="flex items-center" v-if='user' :class="{ 'opacity-75': !user.state.listening }">
        <figure class="relative mr-4">
			<!-- TODO: Emoticon image -->
            <div class="flex justify-center items-center w-14 h-14 rounded-full bg-white/10">
                <span class="text-3xl">{{ user.emoji ? user.emoji : '-' }}</span>
            </div>

            <span class="status absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-4 ring-grey-800" :class="statusIndicatorClasses"></span>
        </figure>
        <div class="flex flex-col">
            <span class="font-medium text-sm">
                {{user.name}}
            </span>

            <span class="text-sm text-white/75">
				{{ user.state.listening ? 'Sync' : 'Paused' }}
				<span class="text-white font-medium">{{ user.admin ? 'DJ' : 'Listener' }}</span>
			</span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { User } from '../../ts/models/Room';
    import { PropType } from '@vue/runtime-core';
	import { computed } from "vue";

    const props = defineProps({
        'user': Object as PropType<User>,
    });

	const statusIndicatorClasses = computed(() => {
		const user = props.user;
		if (!user) {
			return { 'bg-red-500': true };
		}

		return {
			"bg-red-500": !user.state.connected,
			"bg-amber-500": user.state.connected && !user.state.active,
			"bg-lime-500": user.state.connected && user.state.active,
		};
	});

</script>
