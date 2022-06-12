<template>
    <div class="p-8 flex flex-col flex-grow justify-between">
        <div class="flex-grow">
			<div v-if='currentPublicUser'>
				<div class="mb-4 relative">
					<UserItem :user="currentPublicUser" :vote="votes ? votes[currentPublicUser.id] : undefined" />
				</div>
			</div>

            <div>
				<div class="mb-4 relative" v-for="(user, index) in otherUsers" :key="index">
                    <UserItem :user="user" :vote="votes ? votes[user.id] : undefined" />
                    <span v-if="index === 0" class="absolute w-full h-px -top-2 bg-grey-700"></span>
                    <span class="absolute w-full h-px -bottom-2 bg-grey-700"></span>
                </div>
            </div>
        </div>

		<div class="flex flex-col pt-4" v-if="user">
			<input type="text" placeholder="Your name"
				   maxlength="40"
				   class="peer bg-transparent h-10 w-full rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-cyan-600 focus:outline-none focus:border-rose-600 mb-4"
				   v-model='nameValue'
				   @keydown.enter.prevent='onChangeName'
				   v-if='showNameField' />

			<Button @click="onChangeName">
				{{ showNameField ? 'Change name!' : 'Change name?' }}
			</Button>
		</div>

		<!-- TODO: Move this to song queue instead maybe? -->
        <div class="flex flex-col pt-4" v-if="user && !user.admin">
			<input type="text" placeholder="Password"
				   class="peer bg-transparent h-10 w-full rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-cyan-600 focus:outline-none focus:border-rose-600 mb-4"
				   v-model='passwordValue'
				   @keydown.enter.prevent='onBecomeAdmin'
				   v-if='showPasswordField' />

            <Button @click="onBecomeAdmin">
				{{ showPasswordField ? 'Power up!' : 'Become admin' }}
			</Button>
        </div>
	</div>
</template>

<script setup lang="ts">
    import { PropType } from '@vue/runtime-core';
    
    import Button from '../parts/Button.vue';
    import UserItem from '../parts/User.vue';
	import { CurrentSong, PrivateUserData, User } from "../../ts/models/Room";
	import { computed, ref, watch } from 'vue';
	import { RoomConnection } from '../../ts/RoomConnection';

    const props = defineProps({
		'votes': Object as PropType<{ [id: string]: boolean|undefined }>,
		'user': Object as PropType<PrivateUserData>,
        'users': Array as PropType<Array<User>>,
		'conn': Object as PropType<RoomConnection>,
    });

	const currentPublicUser = computed<User|undefined>(() => {
		return props.users?.find(user => user.id === props.user?.publicId);
	})
	const otherUsers = computed<User[]>(() => {
		const users = props.users ? props.users : [];
		return users.filter(user => user.id !== props.user?.publicId)
	});


	const showPasswordField = ref(false);
	const passwordValue = ref('');

	const showNameField = ref(false);
	const nameValue = ref('');

	// Update the name field on the user
	watch(() => props.user, user => {
		if (user) {
			nameValue.value = user.name
		}
	});

	function onChangeName() {
		if (showNameField.value) {
			if (props.user && props.user.name !== nameValue.value) {
				props.conn?.changeUser({
					name: nameValue.value,
				});
			}
			showNameField.value = false;
		} else {
			showNameField.value = true;
		}
	}

	function onBecomeAdmin() {
		if (!showPasswordField.value) {
			showPasswordField.value = true;
		} else {
			props.conn?.becomeAdmin(passwordValue.value);
		}
	}

       
</script>
