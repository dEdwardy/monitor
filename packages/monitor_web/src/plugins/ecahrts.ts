import { SVGRenderer } from 'echarts/renderers'
import { TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components'
import { PieChart, BarChart } from 'echarts/charts'
import { use } from 'echarts/core'
import ECharts from 'vue-echarts'
import { App } from 'vue'

export function install(app: App) {
    use([SVGRenderer, TitleComponent, TooltipComponent, LegendComponent, PieChart, BarChart])
    app.component('VChart', ECharts)
}
