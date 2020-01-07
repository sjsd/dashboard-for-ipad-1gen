import Vue from 'vue'
import _ from 'lodash';
import weather from './weather.vue';
import clock from './clock.vue';
import calendar from './calendar.vue';
import nextbus from './bus.vue';
import yr from './yr.vue';

new Vue({
	el: '#app',
	components: {
		weather,
		clock,
		calendar,
		nextbus,
		yr
	},
	methods: {
		toggleScreen(ms) {
            setInterval(() => {
				const hours = new Date().getHours()
				const isDayTime = hours > 6 && hours < 20;
				console.log(isDayTime);
			}, ms);
		}
	},
	mounted() {
		this.toggleScreen(300000);
	}
});
