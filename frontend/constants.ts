import moment from "moment";

export const TODAY = moment().format("YYYY-MM-DD")

export const FIRSTDATE = moment().startOf("week")

let addDate = 0;

export const DATES_OF_WEEK: moment.Moment[] = []

while (addDate < 7) {
    const date = moment(FIRSTDATE).add(addDate, 'd')
    DATES_OF_WEEK.push(date)
    addDate++
}

export const NUM_PAGE = 10

export const WORDS = "abcdefghijklmnopqrstuvwxyz0123456789"

export const DAY_OF_WEEK = ["月", "火", "水", "木", "金", "土", "日"]