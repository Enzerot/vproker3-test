import { calculateOrderPayment, PaymentType } from 'utils'

describe('payment../Appulation', () => {
  it('work shift', () => {
    const pay = calculateOrderPayment(new Date("2019-01-01"), new Date("2019-01-01"), [{ day: 800, workShift: 500 }, { day: 800, workShift: 500 }])
    expect(pay).toStrictEqual(1000)
  })
  
  it('on another day', () => {
    const pay = calculateOrderPayment(
      new Date("2019-01-01 18:30"),
      new Date("2019-01-02 09:00"),
      [{ day: 800, workShift: 500 }],
      5,
      100,
      [{amount: 4.5, price: 100}]
    )
    expect(pay).toStrictEqual(1230)
  })

  it('1 day', () => {
    const pay = calculateOrderPayment(new Date("2019-01-01"), new Date("2019-01-02"), [{ day: 800, workShift: 500 }])
    expect(pay).toStrictEqual(800)
  })

  it('3 days', () => {
    const pay = calculateOrderPayment(new Date("2019-01-01 10:00"), new Date("2019-01-04 10:00"), [{ day: 800, workShift: 500 }])
    expect(pay).toStrictEqual(2240)
  })

  it('6 days', () => {
    const pay = calculateOrderPayment(new Date("2019-01-01 10:00"), new Date("2019-01-07 10:00"), [{ day: 800, workShift: 500 }])
    expect(pay).toStrictEqual(4080)
  })

  it('9 days', () => {
    const pay = calculateOrderPayment(new Date("2019-01-01 10:00"), new Date("2019-01-10 10:00"), [{ day: 800, workShift: 500 }])
    expect(pay).toStrictEqual(5680)
  })

  it('12 days', () => {
    const pay = calculateOrderPayment(new Date("2019-01-01 10:00"), new Date("2019-01-13 10:00"), [{ day: 800, workShift: 500 }])
    expect(pay).toStrictEqual(7040)
  })

  it('15 days', () => {
    const pay = calculateOrderPayment(new Date("2019-01-01 10:00"), new Date("2019-01-16 10:00"), [{ day: 800, workShift: 500 }])
    expect(pay).toStrictEqual(8160)
  })

  it('1 hour delay', () => {
    const pay = calculateOrderPayment(new Date("2019-01-01 12:30"), new Date("2019-01-02 12:40"), [{ day: 800, workShift: 500, hour: 100 }])
    expect(pay).toStrictEqual(900)
  })

  it('2 hours delay', () => {
    const pay = calculateOrderPayment(new Date("2019-01-01 11:30"), new Date("2019-01-02 12:40"), [{ day: 800, workShift: 500, hour: 100 }])
    expect(pay).toStrictEqual(1000)
  })

  it('3 hours delay', () => {
    const pay = calculateOrderPayment(new Date("2019-01-01 10:00"), new Date("2019-01-02 13:00"), [{ day: 800, workShift: 500, hour: 100 }])
    expect(pay).toStrictEqual(1100)
  })

  it('4 hours is MAX delay, then days increased', () => {
    const pay = calculateOrderPayment(new Date("2019-01-01 10:00"), new Date("2019-01-02 15:00"), [{ day: 800, workShift: 500, hour: 100 }])
    expect(pay).toStrictEqual(1600)
  })

  it('no hour delay at the same day', () => {
    const pay = calculateOrderPayment(new Date("2019-01-06 22:20"), new Date("2019-01-07 02:00"), [{ day: 770, workShift: 670, hour: 150 }])
    expect(pay).toStrictEqual(770)
  })
})