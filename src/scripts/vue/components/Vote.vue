<template>
    <div class="flex gap-4 p-4" :class="{ 'opacity-25': !currentSong }">
        <button class="flex gap-2 justify-center items-center w-1/2 p-2 rounded-md border text-green-500 border-green-500"
				:class="{ 'shadow-lg shadow-green-500': currentVote === true }"
				@click="voteOnSong(true)">
            <span>
                <img src="/images/green-arrow-up.svg" alt="" class="w-3">
            </span>

            <span>Yay</span>
        </button>

        <button class="flex gap-2 justify-center items-center w-1/2 p-2 rounded-md text-red-500 border border-red-500"
				:class="{ 'shadow-lg shadow-red-500': currentVote === false }"
				@click="voteOnSong(false)">
            <span>
                <img src="/images/red-arrow-down.svg" alt="" class="w-3">
            </span>

            <span>Nay</span>
        </button>
    </div>
</template>

<script setup lang="ts">
    import { PropType } from "@vue/runtime-core";
	import { CurrentSong, PrivateUserData } from "../../ts/models/Room";
	import { computed } from "vue";

	const emit = defineEmits<{
		(event: 'vote-on-current-song', vote: boolean|undefined): void,
	}>();

	const props = defineProps({
		'currentSong': Object as PropType<CurrentSong>,
		'user': Object as PropType<PrivateUserData>,
	});

	const currentVote = computed<boolean|undefined>(() => {
		if (!props.currentSong?.song?.likedDisliked || !props.user) {
			return undefined;
		}

		return props.currentSong.song.likedDisliked[props.user.publicId];
	});

    function voteOnSong(vote: boolean|undefined) {
		emit('vote-on-current-song', vote);
    }
</script>
