<template>
    <div class="row calendar">
		<template v-for="(event,index) in events">
			<div class="col-xs-12 col-sm-4" :key="index">
				<div class="panel panel-default">
					<div v-if="event.summary" class="panel-heading">
						{{ event.summary }}
					</div>
					<div class="panel-body">
						<!-- Starter om / slutter om -->
						<p v-if="event.time.start.fromnow">
							Begynner om {{event.time.start.fromnow}}
						</p>
						<p v-else-if="event.time.end.fromnow">
							Slutter om {{event.time.end.fromnow}}
						</p>
						<!-- // Starter om / slutter om -->

						<!-- Dato -->
						<p>
							<i class="fa fa-calendar" aria-hidden="true"></i>
							<span v-if="event.time.start.day">{{ event.time.start.day }},</span>
							<span v-if="event.time.start.date">{{ event.time.start.date }}</span>
							<span v-if="event.time.start.month">{{ event.time.start.month }}</span>
							<span v-if="event.time.start.year">{{ event.time.start.year }}</span>
						</p>
						<!-- // Dato -->

						<!-- Klokkeslett start / slutt -->
						<p v-if="event.time.start.clock">
							<i class="fa fa-clock-o" aria-hidden="true"></i>
							<span v-if="event.time.start.clock">{{ event.time.start.clock }}</span>
							<span v-if="event.time.end.clock"> <i class="fa fa-long-arrow-right" aria-hidden="true"></i> {{ event.time.end.clock }}</span>
						</p>
						<!-- // Klokkeslett start / slutt -->

						<!-- Adresse -->
						<p v-if="event.location">
							<i class="fa fa-map-marker" aria-hidden="true"></i>
							{{ event.location }}
						</p>
						<!-- // Adresse -->
					</div>
				</div>
			</div>
			<div v-if="index === 2" class="clearfix"></div>
		</template>
    </div>
</template>

<script>
import config from './config'
import axios from 'axios';
import moment from 'moment';
moment.locale('nb');

export default {
    name: 'calendar',
    data: function() {
        return {
            events: {}
        }
    },
    methods: {
        getEvents: function() {
            const self = this;
            const googleCalendar_alwaysIncludeEmail = 'false';
            const googleCalendar_orderBy = 'startTime';
            const googleCalendar_showDeleted = 'false';
            const googleCalendar_singleEvents = 'true';
            const googleCalendar_fields = 'items(colorId,creator,description,end,id,location,start,summary)';
            const googleCalendar_maxResults = 6;
            const googleCalendar_timeMin = moment().toISOString();
            const googleCalendar_timeMax = moment().add(30, 'days').toISOString();

            // Build URL
            const url = encodeURI('https://www.googleapis.com/calendar/v3/calendars/' + config.googleCalendar.calendarId + '/events?alwaysIncludeEmail='+ googleCalendar_alwaysIncludeEmail +'&maxResults='+ googleCalendar_maxResults + '&timeMax=' + googleCalendar_timeMax + '&timeMin='+ googleCalendar_timeMin +'&orderBy='+ googleCalendar_orderBy +'&showDeleted='+ googleCalendar_showDeleted +'&singleEvents='+ googleCalendar_singleEvents +'&fields='+ googleCalendar_fields +'&key=' + config.googleCalendar.apiKey);

            axios.get(url).then(function (response) {
                const arrEventsTemp = response.data.items;
				let events = [];

                arrEventsTemp.forEach(element => {
                    // Rebuild start time and end time cause data from Google API sucks
                    let time = {
                        start: {
                            clock: null,
                            month: null,
                            day: null,
                            date: null,
                            year: null,
                            fromnow: null,
                            datestart: null
                        },
                        end: {
                            clock: null,
                            month: null,
                            day: null,
                            date: null,
                            year: null,
                            fromnow: null,
                            dateend: null
                        }
                    };

                    if (element.start.date) {
                        const dateStart = element.start.date;
                        time['start']['clock'] = null;
                        time['start']['month'] = moment(dateStart).format('MMMM');
                        time['start']['day'] = moment(dateStart).format('dddd');
                        time['start']['date'] = moment(dateStart).format('Do');
                        time['start']['year'] = moment(dateStart).format('YYYY');
                    }

                    if (element.start.dateTime) {
                        const dateStart = element.start.dateTime;
                        time['start']['clock'] = moment(dateStart).format('H:mm');
                        time['start']['month'] = moment(dateStart).format('MMMM');
                        time['start']['day'] = moment(dateStart).format('dddd');
                        time['start']['date'] = moment(dateStart).format('Do');
                        time['start']['year'] = moment(dateStart).format('YYYY');
                        time['start']['datestart'] = dateStart;

                        moment().calendar(dateStart, {
                            sameDay: function (now) {
                                if (this.isBefore(now)) {
                                    time['start']['fromnow'] = moment(dateStart).fromNow(true);
                                }
                            }
                        });
                    }

                    if (element.end.date) {
                        const dateEnd = element.end.date;
                        time['end']['clock'] = null;
                        time['end']['month'] = moment(dateEnd).format('MMMM');
                        time['end']['day'] = moment(dateEnd).format('dddd');
                        time['end']['date'] = moment(dateEnd).format('Do');
                        time['end']['year'] = moment(dateEnd).format('YYYY');
                    }

                    if (element.end.dateTime) {
                        const dateEnd = element.end.dateTime;
                        time['end']['dateend'] = dateEnd;
                        time['end']['clock'] = moment(dateEnd).format('H:mm');
                        time['end']['month'] = moment(dateEnd).format('MMMM');
                        time['end']['day'] = moment(dateEnd).format('dddd');
                        time['end']['date'] = moment(dateEnd).format('Do');
                        time['end']['year'] = moment(dateEnd).format('YYYY');

                        moment().calendar(dateEnd, {
                            sameDay: function (now) {
                                if (this.isBefore(now)) {
                                    time['end']['fromnow'] = moment(dateEnd).fromNow(true);
                                }
                            }
                        });
                    }

                    // Push Vue-data
                    events.push({
                        'id': element.id,
                        'time': time,
                        'summary': element.summary,
                        'location': element.location,
                        'creator': element.creator
                    });
                });

                self.events = events;
            });
        },

        getEventsPeriodic: function(ms) {
            setInterval(() => {
                this.getEvents();
            }, ms);
        },

        updateFromNow: function() {
            setInterval(() => {
                this.$nextTick(function() {
                    let arrEventsTemp = this.events;
                    arrEventsTemp.forEach(event => {
                        if (event.time.end.fromnow) {
                            moment().calendar(event.time.end.dateend, {
                                sameDay: function (now) {
                                    if (this.isBefore(now)) {
                                        event.time.end.fromnow = moment(event.time.end.dateend).fromNow(true);
                                    }
                                }
                            });
                        }
                    })
                })
            },15000);
        }
    },
    mounted () {
        // Initial get calendar events
        this.getEvents();

        // Periodic get calendar events
        this.getEventsPeriodic(900000); // 3600000 = 1 hour. 900000 = 15 minutes

        this.updateFromNow();
    }
}
</script>

<style>
	.calendar,
	.panel-default>.panel-heading {
		color: #fff;
	}

	.panel-default>.panel-heading {
		font-weight: bold;
	}
</style>
