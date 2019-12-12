import db from '../data/db.json'

const DEFAULT_ITEMS_PER_PAGE = 3

export default {
  getEventsTotal() {
    return parseInt(db.events && db.events.length, 10) || 0
  },
  getEventsPage(page, itemsPerPage = DEFAULT_ITEMS_PER_PAGE) {
    const dbEventsLength = this.getEventsTotal()

    if (dbEventsLength === 0)
      return []

    if (dbEventsLength <= itemsPerPage)
      return db.events

    const skipCount = itemsPerPage * (page - 1) 
    const pageSize = skipCount + itemsPerPage
    const eventsPage = db.events.slice(skipCount, pageSize) 

    return eventsPage
  },
  findById(id) {
    id = parseInt(id, 10)
    return (db.events || []).find(item => item.id === id)
  },
  async getEvents(itemsPerPage, page) {
    const events = this.getEventsPage(itemsPerPage, page)

    return new Promise((resolve, reject) => {	
      setTimeout(() => {
        if (events)
          resolve({ data: events })
        else
        reject({ response: 'Unable to obtain events.' })
      }, 1000)
    })
  },
  async getEvent(id) {
    id = parseInt(id, 10)

    const specificEvent = this.findById(id)
    return new Promise((resolve, reject) => {	
      setTimeout(() => {
        if (specificEvent)
          resolve({ data: specificEvent })
        else
          reject({ response: `Unable to find event ID '${id}'.` })
      }, 500)
    })
  },
  async postEvent(event) {
    event.id = Math.floor(Math.random() * 10000000)
    db.events.push(event)

    const savedEvent = this.findById(event.id)

    return new Promise((resolve, reject) => {	
      setTimeout(() => {
        if (savedEvent)
          resolve({ data: savedEvent })
        else
          reject({ response: 'Unable to save event.' })
      }, 1000)
    });    
  }
}