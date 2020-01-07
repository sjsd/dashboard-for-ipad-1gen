<template>
    <div class="time">
		<template v-if="childrensTv">
			<div class="text-center">
				<img src="src/assets/images/nrksuper.png" height="220" style="inline-block"/>
			</div>
			<span class="date">
				{{ time.clock }}
			</span>
		</template>
		<template v-else>
			<span class="clock">
				{{ time.clock }}
			</span>
			<span class="date">
				{{ time.day }} {{ time.date }} {{ time.month }} {{ time.year }}
			</span>
		</template>
    </div>
</template>

<script>
import moment from 'moment';
moment.locale('nb');

export default {
    name: 'clock',
    data: function() {
		return {
            time: {
                clock: moment().format('H:mm'),
                month: moment().format('MMMM'),
                day: moment().format('dddd'),
                date: moment().format('Do'),
                year: moment().format('YYYY')
			},
			childrensTv: false
		}
    },
    methods: {
        updateTime: function() {
            const self = this;
            setInterval(() => {
                self.time['clock'] = moment().format('H:mm');
                self.time['month'] = moment().format('MMMM');
                self.time['day'] = moment().format('dddd');
                self.time['date'] = moment().format('Do');
				self.time['year'] = moment().format('YYYY');

				if (self.time['clock'] == '18:00') {
					self.childrensTv = true;
				} else {
					self.childrensTv = false;
				}
			}, 5000);
        }
    },
    mounted () {
        this.updateTime();
    }
}
</script>

<style>
	.time {
		padding: 30px 0;
	}

	.clock,
	.date {
		display: block;
		width: 100%;
		text-align: center;
		color: #fff;
	}

	.clock {
		font-size: 200px;
		font-weight: 800;
		line-height: 1;
	}

	.date {
		font-size: 30px;
	}
</style>
