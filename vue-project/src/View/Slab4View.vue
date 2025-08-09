<template>
    <div class="min-h-screen flex flex-col md:flex-row bg-gray-100 font-inter text-gray-800">

        <!-- Left Flexible Div -->
        <!-- This div will grow to fill available space and shrink as needed -->
        <div class="flex-grow bg-white shadow-lg overflow-hidden md:w-1/4">
            <side-bar />
        </div>

        <!-- Right Fixed-Width, Scrollable Div -->
        <!-- This div maintains its width and becomes scrollable horizontally on smaller screens -->
        <div class="flex-shrink-0 w-full md:w-3/4 bg-white shadow-lg overflow-x-auto">
            <slab4 />
        </div>

    </div>
</template>

<script setup>
    import Slab4 from '@/Components/Slab4.vue';
    import SideBar from '@/Components/SideBar.vue';
</script>