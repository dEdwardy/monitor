<script setup>
import { reactive, ref } from 'vue'
import PieChart from '@/components/PieChart.vue'
import { getAnalysisData } from '@/api'
const query = reactive({
    type: '',
    date: [],
})
const pieData = reactive({
    data: [],
    loading: false,
})
const pieData2 = reactive({
    data: [],
    loading: false,
})
const getChartData = () => {
    pieData.loading = true
    return getAnalysisData({
        type: query.type,
        startDate: query.date[0] ? query.date[0] : undefined,
        endDate: query.date[1] ? query.date[1] : undefined,
    })
        .then(({ data }) => {
            pieData.data = data?.map(({ name, count }) => ({ name, value: count })) ?? []
        })
        .finally(() => {
            pieData.loading = false
        })
}
const handleDetail = ({ type }) => {
    pieData2.loading = true
    return getAnalysisData({
        type,
        startDate: query.date[0] ? query.date[0] : undefined,
        endDate: query.date[1] ? query.date[1] : undefined,
    })
        .then(({ data }) => {
            pieData2.data = data?.map(({ name, count }) => ({ name, value: count })) ?? []
        })
        .finally(() => {
            pieData2.loading = false
        })
}
getChartData()
</script>

<template>
    <div class="charts">
        <div class="item">
            <PieChart
                name="t1"
                :loading="pieData.loading"
                :data="pieData.data"
                style="min-width: 400px; height: 400px; flex: 1"
                autoresize
                @handle-click="handleDetail"
            />
        </div>
        <div class="item">
            <PieChart
                v-if="pieData2.data.length > 0"
                name="t2"
                :loading="pieData2.loading"
                :data="pieData2.data"
                autoresize
                style="min-width: 400px; height: 400px; flex: 1"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.charts {
    display: flex;
    align-items: center;
    .item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
