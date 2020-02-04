import { Duration } from 'luxon'

export const roundDate = date => {
    date.setSeconds(0)
    if (date.getMinutes() < 10) {
        date.setMinutes(0)
        return date
    }
    if (date.getMinutes() < 40) {
        date.setMinutes(30)
        return date
    }
    date.setMinutes(60)
    return date
}

export const PaymentType = {
    WorkShift: 0,
    Days: 1,
    DaysAndHours: 2
}

export const calculateOrderPayment = (startDate, endDate, prices, clientOrders = 0, clientDiscount = 0, rigPrices, consumables) => {
    const getDayDiscount = days => {
        switch (true) {
            case days < 3: return 0
            case days >= 3 && days <= 5: return .2
            case days >= 6 && days <= 8: return .3
            case days >= 9 && days <= 11: return .4
            case days >= 12 && days <= 14: return .5
            case days >= 15: return .6
            default: return 0
        }
    }
    const getDiscount = (allDays, curDays) => {
        const max = Math.max(getDayDiscount(allDays), clientOrders > 4 ? 0.15 : 0, clientDiscount)
        return max === getDayDiscount(curDays) ? getDayDiscount(curDays) : max
    }

    const calculateByDays = (totalDays, dayPrice) => {
        if(!dayPrice) {
            throw new Error("DayPrice is undefined")
        }

        totalDays < 1 && (totalDays = 1)

        let payment = 0
        for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
            const discount = dayPrice * getDiscount(dayNum)
            payment += dayPrice - discount
        }

        return payment
    }

    if (!startDate || !endDate || !prices || !prices.length || !prices.reduce((sum, item) => sum && !!item.day, true))
        return 0

    const duration = Duration.fromObject({
        years: endDate.getFullYear() - startDate.getFullYear(),
        months: endDate.getMonth() - startDate.getMonth(),
        days: endDate.getDate() - startDate.getDate(),
        hours: endDate.getHours() - startDate.getHours(),
        minutes: endDate.getMinutes() - startDate.getMinutes(),
    }).normalize()
    const totalDays = Math.floor(duration.as('days'))
    const hourDelay = duration.hours + (duration.minutes > 30 ? 1 : 0)
    const roundedDays = Math.ceil(duration.as('days'))
    
    return prices.reduce((sum, price) => {
        if (
            startDate.getFullYear() === endDate.getFullYear() && //
            startDate.getMonth() === endDate.getMonth() && //
            startDate.getDate() === endDate.getDate() && // check equality of the dates
            price.workShift &&
            endDate.getHours() < 18
        ) return sum + price.workShift
    
        // by days + hour delay
        if (hourDelay >= 0 && hourDelay <= 4 && price.hour > 0 && totalDays > 0)
            return sum + calculateByDays(totalDays, price.day) + (price.hour * hourDelay)
    
        // by days
        return sum + calculateByDays(roundedDays, price.day)
    }, 0) + (rigPrices || []).reduce((sum, item) => sum + item * roundedDays, 0) + (consumables || []).reduce((sum, consumable) => sum + consumable.amount * consumable.consumable.sellingPrice, 0)
}