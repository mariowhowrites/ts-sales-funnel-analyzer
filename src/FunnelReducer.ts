import { FunnelMap, FunnelArray, FunnelEntry } from './index'
import { Stringer } from './Stringer'

export type ConversionMap = Map<number, Array<number>>
export type CustomerMap = Map<number, number>

export class FunnelReducer extends Stringer {
  protected conversionMap: ConversionMap = new Map()
  protected customerMap: CustomerMap = new Map()

  constructor(protected funnelMap: FunnelMap) {
    super()

    this.funnelMap.forEach((dailyEntries: FunnelArray, date: number) => {
      this.calculateEntriesForDate(dailyEntries, date)
    })
  }

  protected conversionStages = [
    'product_view',
    'purchase_click',
    'purchase_credit_card',
    'purchase_complete'
  ]

  /**
   * Calculates entries for a given date value. Loops through each entry,
   * leaves the entry logic to calculateConversionsForEntry.
   *
   * Resets the customer map for each new day, preventing multiday sequences.
   *
   * @param entries FunnelArray
   * @param date number
   */
  protected calculateEntriesForDate(entries: FunnelArray, date: number): void {
    this.customerMap = new Map()
    let conversions: Array<number> = new Array(
      this.conversionStages.length
    ).fill(0)

    entries.forEach((entry: FunnelEntry) => {
      this.calculateConversionsForEntry(conversions, entry)
    })

    this.conversionMap.set(date, conversions)
  }

  /**
   * Calculates the conversions for a given entry. Decides whether or not
   * a given entry advances a customer sequence, discarding it otherwise.
   *
   * @param conversions Array<number>
   * @param entry FunnelEntry
   */
  protected calculateConversionsForEntry(
    conversions: Array<number>,
    entry: FunnelEntry
  ): void {
    const [customerStage, eventStage] = this.calculateStages(entry)

    if (this.isInvalid(customerStage, eventStage)) {
      return
    }

    if (this.invalidatesCustomer(customerStage, eventStage)) {
      this.customerMap.delete(entry.sessionID)
      return
    }

    conversions[eventStage]++
    this.customerMap.set(entry.sessionID, eventStage)
  }

  /**
   * Finds the event and customer stage of a given entry.
   *
   * The customer stage could either be a number, indicating an existing customer sequence, or undefined.
   * The event stage will always exist assuming properly-formatted data.
   *
   * @param entry FunnelEntry
   */
  protected calculateStages(entry: FunnelEntry): [number | undefined, number] {
    const customerStage = this.customerMap.get(entry.sessionID)

    const eventStage = this.conversionStages.findIndex(function(stage: string) {
      return stage === entry.action
    })

    return [customerStage, eventStage]
  }

  /**
   * Determines whether an entry is invalid. entries are invalid if:
   * a) we don't have such a customer in our map; and
   * b) we aren't adding one with eventStage === 0
   *
   * @param customerStage number
   * @param eventStage number
   *
   * @returns boolean
   */
  protected isInvalid(
    customerStage: number | undefined,
    eventStage: number
  ): boolean {
    return customerStage === undefined && eventStage !== 0
  }

  /**
   * Determines whether an event invalidates a customer sequence. This happens if:
   * a) we have a customer; and
   * b) our current entry doesn't advance the customer's sequence
   *
   * @param customerStage number
   * @param eventStage number
   *
   * @returns boolean
   */
  protected invalidatesCustomer(
    customerStage: number | undefined,
    eventStage: number
  ): boolean {
    return <boolean>(customerStage && eventStage !== customerStage + 1)
  }
}
