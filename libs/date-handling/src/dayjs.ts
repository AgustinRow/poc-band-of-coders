import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isoWeek from 'dayjs/plugin/isoWeek'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import Week from 'dayjs/plugin/weekday'
import Duration from 'dayjs/plugin/duration'
import localeData from 'dayjs/plugin/localeData'

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(isoWeek)
dayjs.extend(Week)
dayjs.extend(Duration)
dayjs.extend(weekOfYear)
dayjs.extend(localeData)

export default dayjs
