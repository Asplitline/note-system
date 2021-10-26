<template>
	<div class="home-container">
		<!-- <div class="home-text">name: {{ name }}</div> -->
		<!-- <el-row :gutter="20" class="panel-group"> -->
		<el-row :gutter="20" class="panel-group">
			<el-col :span="6" class="panel-card">
				<div class="panel-card__item">
					<div class="panel-card__item--left">
						<span class="number">{{info.noteTotal}}</span>
						<span class="title">博客总数</span>
					</div>
					<div class="panel-card__item--right">
						<i class="fa fa-cube" aria-hidden="true"></i>
					</div>
				</div>
			</el-col>
			<el-col :span="6" class="panel-card">
				<div class="panel-card__item">
					<div class="panel-card__item--left">
						<span class="number">{{info.tagsTotal}}</span>
						<span class="title">标签总数</span>
					</div>
					<div class="panel-card__item--right">
						<i class="fa fa-tag" aria-hidden="true"></i>
					</div>
				</div>
			</el-col>
			<el-col :span="6" class="panel-card">
				<div class="panel-card__item">
					<div class="panel-card__item--left">
						<span class="number">{{info.typeTotal}}</span>
						<span class="title">文章分类</span>
					</div>
					<div class="panel-card__item--right">
						<i class="fa fa-calendar" aria-hidden="true"></i>
					</div>
				</div>
			</el-col>
			<el-col :span="6" class="panel-card">
				<div class="panel-card__item">
					<div class="panel-card__item--left">
						<span class="number">{{info.commentTotal}}</span>
						<span class="title">留言条数</span>
					</div>
					<div class="panel-card__item--right">
						<i class="fa fa-comments-o" aria-hidden="true"></i>
					</div>
				</div>
			</el-col>
		</el-row>

		<el-row class="echarts-group" :gutter="30">
			<el-col :span="12">
				<div class="echarts-item">
					<h3>分类统计</h3>
					<typeChart :data="types" v-if="notEmpty(types)"></typeChart>
					<myEmpty bg="transparent" v-else></myEmpty>
				</div>
			</el-col>
			<el-col :span="12">
				<div class="echarts-item">
					<h3>标签统计</h3>
					<!-- <tagChart v-if="notEmpty(tags)" :data="tags"></tagChart> -->
					<tagChart v-if="notEmpty(tags)" :data="tags"></tagChart>
					<myEmpty bg="transparent" v-else></myEmpty>
				</div>
			</el-col>
		</el-row>

		<el-row class="info-group" :gutter="30">
			<el-col :span="12">
				<div class="info-item">
					<h3>最新笔记</h3>
					<noteCard></noteCard>
				</div>
			</el-col>
			<el-col :span="12">
				<div class="info-item">
					<h3>最新评论</h3>
					<commentCard></commentCard>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOther, getAllList, API, API_OTHER } from '@/api'
import tagChart from './echarts/tagChart.vue'
import typeChart from './echarts/typeChart.vue'
import commentCard from './card/commentCard.vue'
import noteCard from './card/noteCard.vue'
import { notEmpty } from '@/utils'

export default {
	name: 'Home',
	computed: {
		...mapGetters(['name'])
	},
	components: {
		tagChart,
		typeChart,
		commentCard,
		noteCard
	},
	data() {
		return {
			info: {},
			types: [],
			tags: []
		}
	},
	methods: {
		notEmpty,
		async fetchInfo() {
			const { data } = await getOther(API_OTHER.STATISTICAL)
			this.info = data
		},
		async fecthTypes() {
			const { data: noteType } = await getAllList(API.NOTE_TYPE)
			const types = noteType.map((i) => ({ name: i.name, id: i.id }))
			const { data: notes } = await getAllList(API.NOTE)
			this.types = types.map((i) => {
				const num = notes.filter((j) => i.id === j.lx)
				return { value: num.length, name: i.name }
			})
			// const notes = types.filter(i=>i.id==);
			// console.log(object)
			// this.types = data.map((i) => {})
		},
		async fetchTags() {
			const { data } = await getOther(API_OTHER.STATISTICAL_TAGS)
			this.tags = data.map((i) => {
				console.log(i[i.tag_id])
				return { name: i[i.tag_id], value: i.count }
			})
		}
	},
	mounted() {
		this.fetchInfo()
		this.fecthTypes()
		this.fetchTags()
	}
}
</script>

<style lang="scss" scoped>
.home {
	&-container {
		margin: 30px;
	}
}
.panel {
	&-group {
		/* background-color: #f0f0f0; */
	}
	&-card {
		transition: all 0.5s;
		&__item {
			box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
			border-radius: 0.625rem;
			width: 100%;
			/* height: 108px; */
			padding: 1.4rem 0;
			cursor: pointer;
			font-size: 12px;
			position: relative;
			overflow: hidden;
			color: #666;
			background: #fff;
			border-color: rgba(0, 0, 0, 0.05);
			transition: all 0.5s;
			display: flex;
			align-items: center;
			text-align: center;
			/* justify-content: center; */
			&--left {
				flex: 3;
				display: flex;
				flex-direction: column;
				.number {
					font-size: 2.375rem;
					font-weight: 700;
					line-height: 1.65857;
				}
				.title {
					font-size: 1.125rem;
					color: #bab8b8;
				}
			}
			&--right {
				flex: 2;
				.fa {
					font-size: 3.75rem;
				}
			}
		}
		&:hover {
			transform: translateY(4px);
		}
	}
}
.echarts-group {
	margin-top: 20px;
	.echarts-item {
		height: 100%;
		h3 {
			margin: 0;
			padding: 8px 0 10px;
			border-bottom: 1px solid #f0f0f0;
		}
		padding: 10px;
		background-color: #fff;
		border-radius: 10px;
		height: 320px;
	}
}
.info-group {
	margin-top: 20px;
	.info-item {
		height: 100%;
		h3 {
			margin: 0;
			padding: 8px 0 10px;
			border-bottom: 1px solid #f0f0f0;
		}
		padding: 10px;
		background-color: #fff;
		border-radius: 10px;
	}
}
</style>
