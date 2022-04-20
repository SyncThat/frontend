<template>
    <button class="group [transform:translateZ(0)] cursor-pointer px-6 py-3 rounded-lg overflow-hidden bg-cyan-700 relative before:absolute before:bg-grey-200 before:top-1/2 before:left-1/2 before:h-8 before:w-8 before:-translate-y-1/2 before:-translate-x-1/2 before:rounded-full before:scale-[0] before:opacity-0 hover:before:scale-[6] hover:before:opacity-100 before:transition before:ease-in-out before:duration-500">
        <span class="relative z-0 text-white group-hover:text-gray-700 transition ease-in-out duration-500">
            <slot></slot>
        </span>
    </button>
    
</template>

<script setup lang="ts">

</script>
