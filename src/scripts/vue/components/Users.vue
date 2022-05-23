<template>
    <div class="p-8 flex flex-col flex-grow justify-between">
        <div>
			<h2 class="text-2xl font-bold mb-6" v-if='currentPublicUser'>You</h2>
			<div v-if='currentPublicUser'>
				<div class="mb-4 relative">
					<UserItem :user="currentPublicUser" />
				</div>
			</div>
            <h2 class="text-2xl font-bold mb-6">Users</h2>
            <div>
                <div class="mb-4 relative" v-for="(user, index) in otherUsers" :key="index">
                    <UserItem :user="user" />
                    <span v-if="index === 0" class="absolute w-full h-px -top-2 bg-grey-700"></span>
                    <span class="absolute w-full h-px -bottom-2 bg-grey-700"></span>
                </div>
            </div>
        </div>

        <div class="flex flex-col" v-if="!user || !user.admin">
			<input type="text" placeholder="Password"
				   class="peer bg-transparent h-10 w-full rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-cyan-600 focus:outline-none focus:border-rose-600 mb-4"
				   v-model='passwordValue'
				   v-if='showPasswordField' />

            <Button @click="onBecomeAdmin">
				{{ showPasswordField ? 'Power up!' : 'Become admin' }}
			</Button>
        </div>

		<!-- TODO: Ability to change username -->
    </div>
</template>

<script setup lang="ts">
    import { PropType } from '@vue/runtime-core';
    
    import Button from '../parts/Button.vue';
    import UserItem from '../parts/User.vue';
	import { PrivateUserData, User } from '../../ts/models/Room';
	import { computed, ref } from 'vue';
	import { RoomConnection } from '../../ts/RoomConnection';

    const props = defineProps({
		'user': Object as PropType<PrivateUserData>,
        'users': Array as PropType<Array<User>>,
		'conn': Object as PropType<RoomConnection>,
    });

	const currentPublicUser = computed(() => {
		return props.users?.find(user => user.id === props.user?.publicId);
	})
	const otherUsers = computed(() => {
		const users = props.users ? props.users : [];
		return users.filter(user => user.id !== props.user?.publicId)
	});


	const showPasswordField = ref(false);
	const passwordValue = ref('');

	function onBecomeAdmin() {
		if (!showPasswordField.value) {
			showPasswordField.value = true;
		} else {
			props.conn?.becomeAdmin(passwordValue.value);
		}
	}

       
</script>
