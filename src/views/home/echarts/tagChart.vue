<template>
	<div id="tag-chart" style="width:100%;height:300px;"></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
	props: ['data'],
	data() {
		return {
			// key: value
		}
	},
	mounted() {
		const chartDom = document.getElementById('tag-chart')
		const myChart = echarts.init(chartDom)
		const option = {
			tooltip: {
				trigger: 'item'
			},
			legend: {
				top: '5%',
				left: 'center'
			},
			series: [
				{
					name: '分类统计',
					type: 'pie',
					radius: ['30%', '50%'],
					avoidLabelOverlap: false,
					itemStyle: {
						borderRadius: 10,
						borderColor: '#fff',
						borderWidth: 2
					},
					label: {
						show: false,
						position: 'center'
					},
					emphasis: {
						label: {
							show: true,
							fontSize: '16',
							fontWeight: 'bold'
						}
					},
					labelLine: {
						show: false
					},
					data: this.data
				}
			]
		}

		option && myChart.setOption(option)
		setTimeout(function () {
			window.onresize = function () {
				myChart.resize()
			}
		}, 500)
	}
}
</script>

<style>
</style>