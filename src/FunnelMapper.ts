import fs from 'fs'
import { FunnelArray, FunnelEntry, FunnelMap } from './index'

export class FunnelMapper<T> {
  protected fileText: string
  protected data: FunnelArray = []

  constructor(protected path: string) {
    this.fileText = fs.readFileSync(path, 'utf-8')
    this.data = this.parse()
  }

  parse(): FunnelArray {
    return this.fileText
      .split('\n')
      .map(function(line: string, index: number) {
        if (index === 0) {
          return {
            sessionID: -1,
            timestamp: -1,
            action: ''
          }
        }

        let [sessionID, timestamp, action] = line.split(', ')

        action = action.replace(/\'/g, '')

        return {
          sessionID: parseInt(sessionID),
          timestamp: parseInt(timestamp),
          action
        }
      })
      .filter((entry: FunnelEntry) => entry.sessionID !== -1)
  }

  map(): FunnelMap {
    return this.data.reduce(function(
      acc: FunnelMap,
      entry: FunnelEntry
    ): FunnelMap {
      const date = parseUTCIntoDateString(entry.timestamp)

      let entriesArray: FunnelArray
      if (acc.has(date)) {
        entriesArray = <FunnelArray>acc.get(date)
      } else {
        entriesArray = []
      }

      entriesArray.push(entry)
      acc.set(date, entriesArray)

      return acc
    },
    new Map())
  }
}

function parseUTCIntoDateString(timestamp: number): number {
  return Math.floor(timestamp / 10)
}
