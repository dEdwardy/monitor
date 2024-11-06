<script setup>
import { computed } from 'vue'
import cloneDeep from 'lodash-es/cloneDeep'
import merge from 'lodash-es/merge'
const defaultOption = {
    title: {
        text: '',
    },
    tooltip: {
        trigger: 'item',
    },
    legend: {
        orient: 'vertical',
    },
    series: [
        {
            name: 'Exception Type',
            type: 'pie',
            radius: '50%',
            legendHoverLink: false,
            hoverAnimation: false,
            data: [],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
            },
        },
    ],
}
const loadingOps = {
    text: 'loading',
    color: '#c23531',
    textColor: '#000',
    maskColor: 'rgba(255, 255, 255, 0.3)',
    zlevel: 0,

    // 字体大小。从 `v4.8.0` 开始支持。
    fontSize: 12,
    // 是否显示旋转动画（spinner）。从 `v4.8.0` 开始支持。
    showSpinner: true,
    // 旋转动画（spinner）的半径。从 `v4.8.0` 开始支持。
    spinnerRadius: 10,
    // 旋转动画（spinner）的线宽。从 `v4.8.0` 开始支持。
    lineWidth: 5,
    // 字体粗细。从 `v5.0.1` 开始支持。
    fontWeight: 'normal',
    // 字体风格。从 `v5.0.1` 开始支持。
    fontStyle: 'normal',
    // 字体系列。从 `v5.0.1` 开始支持。
    fontFamily: 'sans-serif',
}
const props = defineProps({
    title: {
        type: String,
        default: 'Exception Type',
    },
    name: {
        type: String,
        default: 'Exception Type',
    },
    data: {
        type: Array,
        default: () => [
            { name: 'c', value: 2 },
            { name: 'asasfasfaff', value: 22 },
            { name: 'asf', value: 22 },
            { name: 'zss', value: 12 },
        ],
    },
    loading: {
        type: Boolean,
        default: false,
    },
    autoresize: {
        type: Boolean,
        default: false,
    },
})
const emits = defineEmits(['handleClick'])
const option = computed(() => {
    console.error('props.data', props.daa)
    if (props.option) {
        return props.option
    } else {
        const options = cloneDeep(defaultOption)
        if (props.data) {
            const singleSeriesData = props.data
            const legendData = props.data.map((item) => item.name)
            // options.series[0].data = props.data;
            options.legend.data = legendData
            merge(options, {
                series: [{ data: singleSeriesData }],
                legend: { data: legendData },
            })
        }
        return options
    }
})
const handleClick = (e) => {
    emits('handleClick', { type: e?.data?.name })
}
</script>

<template>
    <v-chart :loading="props.loading" :option="option" :loading-options="loadingOps" :autoresize="props.autoresize" @click="handleClick" />
</template>
