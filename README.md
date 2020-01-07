# Dashboard for 1.gen iPad
A simple project that shows a personal dashboard. The code and stylesheet are designed to appear on the 1st gen iPad and its old Safari browser. Don't expect modern code in this repo.


Most of the code is also written during a period where I learned javascript and Vue.js. So don't expect any good code either. The code was then found again during a cleanup on my computer over a year later. So I can't answer why I did as I did. If I get time to refine the code, I will check in newer versions. So stay tuned. Or not.

> For Norwegian users, see more info at [https://www.helgejohnsen.no/skriverier/dashboard-for-i-pad/](https://www.helgejohnsen.no/skriverier/dashboard-for-i-pad/)


## Config
To make the calendar and bus schedules to show, you need some API-keys and stop place ID. The calendar must be public.

- [Google Calendar API](https://developers.google.com/calendar)
- [Developer Entur.org](https://developer.entur.org/pages-journeyplanner-journeyplanner)

Rename _./src/config/index.template.js_ to _./src/config/index.js_ and fill inn API-keys and stuff.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```
