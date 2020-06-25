<script>
export default {
    
}
</script>

<style scoped>

</style>

<template>
    <div class="m-4">
        <h1 class="text-2xl">Select your AWN .csv report</h1>
        <p>Start by running an AWN report and exporting the results to .csv</p>
        <p>Then, open that file with this tool.</p>
        <input type="file" id="awnReport" v-on:change="handleAwnReport($data, $event)">
    </div>
</template>