<template>
    <div v-if="show" class="bus well">
		<span class="icon">
			<i class="fa fa-bus" aria-hidden="true"></i>
		</span>
		Neste bussavgang
		<span v-if="depature.fromNow < 60 && depature.fromNow > 0 && depature.lateMinutes == 0">
			om {{ depature.fromNow }} minutter
		</span>

		&ndash;

		<template v-if="depature.name">
			<span class="icon">
				<i class="fa fa-map-marker" aria-hidden="true"></i>
			</span>
			{{ depature.name }}
			&ndash;
		</template>

		<template v-if="depature.depature">
			<span class="icon">
				<i class="fa fa-clock-o" aria-hidden="true"></i>
			</span>
			{{ depature.depature }}
			<span v-if="depature.lateMinutes > 4" class="tag is-danger">
				&ndash;
				<span class="icon has-text-warning" style="color: yellow">
					<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
				</span>
				&nbsp;Meldt {{ depature.lateMinutes }} minutter forsinket
			</span>
		</template>
    </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import config from './config'

export default {
    name: 'nextbus',
    data: function () {
        return {
			show: false,
            depature: {}
        }
    },
    methods: {
        getDepature: function() {
            console.log(moment().format('h:mm:ss') + ' - Hentet ut data om neste bussavgang');

            const nowTime = moment().toISOString();
            axios({
                url: 'https://api.entur.io/journey-planner/v2/graphql',
                method: 'post',
                headers: {'ET-Client-Name': 'helge-vuedashboard'},
                data: {
                    query: `
                        query {
                        stopPlace(id: "NSR:StopPlace:`+config.entur.stopPlaceId+`") {
                            id
                            name
                            estimatedCalls(startTime:"`+nowTime+`" timeRange: 72100, numberOfDepartures: 1) {
                            realtime
                            aimedArrivalTime
                            aimedDepartureTime
                            expectedArrivalTime
                            expectedDepartureTime
                            actualArrivalTime
                            actualDepartureTime
                            date
                            forBoarding
                            forAlighting
                            destinationDisplay {
                                frontText
                            }
                            quay {
                                id
                            }
                            serviceJourney {
                                journeyPattern {
                                line {
                                    id
                                    name
                                    transportMode
                                }
                                }
                            }
                            }
                        }
                        }
                    `
                }
            }).then((result) => {
                const stopPlace = result.data.data.stopPlace;
                // Mold data
                let self = this;
                let temp = {
                    name: stopPlace.name
                };

                stopPlace.estimatedCalls.forEach(element => {
                    const aimedDepartureTime = moment(element.aimedDepartureTime);
                    const expectedDepartureTime = moment(element.expectedDepartureTime);
                    const nowTime = moment();

                    // Append data
                    temp['depature'] = moment(element.aimedDepartureTime).format('H:mm');
                    temp['destinationDisplay'] = element.destinationDisplay;
                    temp['lateMinutes'] = (expectedDepartureTime.diff(aimedDepartureTime, 'minutes'));
                    temp['fromNow'] = (aimedDepartureTime.diff(nowTime, 'minutes')) + 1;
                    temp['rawDepature'] = element.aimedDepartureTime;
                });

                self.depature = temp;
            }).catch(function (error) {
                console.log(moment().format('h:mm:ss') + ' - Feil ved uthenting av bussavgang');
                console.log(error);
            });
        },

        getDepaturePeriodic: function(ms) {
            setInterval(() => {
                console.log(moment().format('h:mm:ss') + ' - Oppdatert neste avgang for buss');
                this.getDepature();
            }, ms);
        },

        timeToNextDepature: function(ms) {
            setInterval(() => {
                console.log(moment().format('h:mm:ss') + ' - Oppdatert hvor lenge det er til bussen går');
                this.$nextTick(function() {
                    const self = this;
                    const temp = self.depature;
                    const newFromNow = (moment(temp.rawDepature).diff(moment(), 'minutes'));
                    self.depature.fromNow = newFromNow;
                })
            },ms);
        }
    },
    mounted() {
		if (config.entur.stopPlaceId > 0) {
			this.show = true;

			// Initial
			this.getDepature();

			// Periodic
			this.getDepaturePeriodic(300000); // 300000 = 5 minutes
			this.timeToNextDepature(60000); // 60000 = 1 minute

		}
    }
}
</script>
