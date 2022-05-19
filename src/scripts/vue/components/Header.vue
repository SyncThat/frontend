<template>
    <div class="px-8 py-4 text-sm bg-blue-600">
        <span class="opacity-75">Current room:</span> <strong>{{roomName}}</strong>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        'roomName': String,
    });
</script>
