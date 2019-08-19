import { FunnelMapper } from './FunnelMapper'
import { FunnelReducer } from './FunnelReducer'

export interface FunnelEntry {
  sessionID: number
  timestamp: number
  action: string
}
export type FunnelArray = Array<FunnelEntry>
export type FunnelMap = Map<number, FunnelArray>

const entriesMap = new FunnelMapper('sampleData.csv').map()
console.log(new FunnelReducer(entriesMap).toString())
