import { ConversionMap } from './FunnelReducer'

export abstract class Stringer {
  protected abstract conversionMap: ConversionMap
  protected abstract conversionStages: Array<string>

  toString(): string {
    let conversionString = ''

    this.conversionMap.forEach((conversions: Array<number>, date: number) => {
      conversionString = `${conversionString}\nConversions for day ${date}:\n`

      conversions.forEach((total: number, index: number) => {
        let stageString = `${this.conversionStages[index]}: ${total}`

        if (index > 0) {
          let percent: number
          if (conversions[index - 1] === 0) {
            percent = 0
          } else {
            percent = total / conversions[index - 1]
          }
          percent = percent * 100

          stageString = `${stageString}, ${percent}%`
        }

        conversionString = `${conversionString}${stageString}\n`

        if (index === conversions.length - 1) {
          let totalConversions = conversions[index] / conversions[0] * 100
          if (Number.isNaN(totalConversions)) {
            totalConversions = 0
          }

          conversionString = `${conversionString}Final Conversion: ${totalConversions}%\n`
        }
      })
    })

    return conversionString
  }
}
