<script setup lang="ts">
    import { ref } from 'vue'

    defineProps<{ msg: string }>()

    const count = ref(0)
</script>

<template>
    <div class="grid grid-cols-4 gap-4">
        <div>
            <h1 class="text-3xl font-bold">Queue</h1>
        </div>
        
        <div>
            <h1 class="text-3xl font-bold">Chat</h1>

            <div>
                <input class="bg-gray-200 text-black py-2 px-4 rounded" type="text" placeholder="Type your message">

                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Click me</button>
            </div>
        </div>

        <div>
            <h1 class="text-3xl font-bold">People</h1>
        </div>
    </div>
</template>
