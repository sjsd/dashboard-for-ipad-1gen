<template>
	<div class="yr" v-if="loaded">
		<div class="temperature">
			<div class="forecast text-center">
				<img :src="icon" />
				{{ temperature.value }}&deg;C
			</div>
			<div class="text-center symbolname">
				{{ symbol.name }}
			</div>
		</div>

		<div class="wind text-center">
			{{ windDirection.name }} <i class="fa fa-long-arrow-up" aria-hidden="true" :style="direction"></i> {{ windSpeed.name }}
		</div>
	</div>
</template>

<script>
var convert = require('xml-js');
import config from './config'
import axios from 'axios';
import moment from 'moment';

export default {
	name: "yr",
	data() {
		return {
			temperature: null,
			windDirection: null,
			windSpeed: null,
			symbol: null,
			loaded: false
		}
	},
	methods: {
		loadWeather() {
			console.log(moment().format('h:mm:ss') + ' - Henter ut værdata fra Yr.no');
			const self = this;
			axios('https://cors-anywhere.herokuapp.com/'+config.yr.urlXml)
				.then(results => {
					const xml = results.data;

					let json = convert.xml2json(xml, {compact: true, spaces: 4});
					json = JSON.parse(json);

					const forecast = json['weatherdata']['forecast']['tabular']['time'];
					self.temperature = forecast['0']['temperature']['_attributes'];
					self.windDirection = forecast['0']['windDirection']['_attributes'];
					self.windSpeed = forecast['0']['windSpeed']['_attributes'];
					self.symbol = forecast['0']['symbol']['_attributes'];
					self.loaded = true;
				})
			.catch(error => {
				console.log(moment().format('h:mm:ss') + ' - En feil i uthenting av værdata fra Yr.no: ');
				console.log(error);
			});
		},

        loadWeatherPeriodic: function(ms) {
            setInterval(() => {
                this.loadWeather();
            }, ms);
        },
	},
	computed: {
		direction() {
			const self = this;
			let deg = 0;
			if (self.windDirection !== null) {
				deg = self.windDirection.deg;
			}

			const style = "transform: rotate("+ deg +"deg)"
			return style
		},
		icon() {
			const self = this;
			let image;
			if (self.symbol !== null) {
				const icon = self.symbol.var;
				image = "src/assets/images/yr/png/100/"+ icon +".png";
			}
			return image;
		}
	},
	mounted() {
		// Initial
		this.loadWeather();

		// Periodic load new weather data
		this.loadWeatherPeriodic(900000) // 900 000 = 15 minutes
	}
}
</script>


<style>
	.yr {
		color: #fff;
		padding-top: 25px;
	}


	.yr .forecast img {
		width: 160px;
		display: inline-block;
	}

	.yr .forecast {
		font-size: 110px;
		font-weight: bold;
	}

	.yr .wind i {
		margin: 0 10px;
	}

	.yr .symbolname,
	.yr .wind {
		font-size: 20px;
	}
</style>
