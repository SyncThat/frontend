<template>
    <div class="p-8 flex flex-col justify-between h-full">
        <div>
            <h2 class="text-2xl font-bold mb-6">Users</h2>
            <div>
                <div class="mb-4 relative" v-for="(user, index) in users" :key="index">
                    <User :user="user" />
                    <span v-if="index === 0" class="absolute w-full h-px -top-2 bg-grey-700"></span>
                    <span class="absolute w-full h-px -bottom-2 bg-grey-700"></span>
                </div>
            </div>
        </div>
        <div class="flex">
            <Button>Login / Sign up</Button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import Button from '../parts/Button.vue';
    import User from '../parts/User.vue';

    const props = defineProps({
        'users': Object
    });
       
</script>
