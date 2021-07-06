import { Country, CurrencyType } from './../entity/Country'
import { Arg, Mutation, Resolver, UseMiddleware } from 'type-graphql'
import countryAxiosInstance from '../helpers/countryAxiosInstance'
import currencyAxiosInstance from '../helpers/currencyAxiosInstance'
import { client } from './../helpers/redis'
import moment from 'moment'
import { isAuth } from './../isAuth'

@Resolver()
export class CountryResolver {
  @Mutation(() => [Country])
  @UseMiddleware(isAuth)
  async searchCountry(
    @Arg('searchQuery', () => String) searchQuery: string
  ): Promise<Country[]> {
    try {
      const response = await countryAxiosInstance.get(`name/${searchQuery}`)
      return response!.data!.map(
        (res: { name: string; alpha3Code: String }) => {
          return {
            name: res.name,
            alpha3Code: res.alpha3Code
          }
        }
      )
    } catch (e) {
      return []
    }
  }

  @Mutation(() => Country)
  @UseMiddleware(isAuth)
  async searchData(
    @Arg('countryCode', () => String) countryCode: string
  ): Promise<Country> {
    const { data: res } = await countryAxiosInstance.get(`alpha/${countryCode}`)
    let exchangeRatesString = await client.get('exchangeRates')
    let finalData: any
    if (!exchangeRatesString) {
      const { data: res } = await currencyAxiosInstance.get('')
      finalData = res.rates
      let dateToExpire = Number(moment().endOf('day').valueOf()) / 1000
      await client.set('exchangeRates', JSON.stringify(res.rates))
      await client.expireat('exchangeRates', dateToExpire)
    } else {
      finalData = JSON.parse(exchangeRatesString)
    }

    res.currencies.forEach((c: CurrencyType) => {
      c.exchangeRateToSEK = +(finalData!.SEK / finalData![c.code]).toFixed(2)
      c.exchangeRateFromSEK = +(finalData![c.code] / finalData!.SEK).toFixed(2)
    })

    return {
      name: res.name,
      population: res.population,
      currencies: res.currencies,
      alpha3Code: res.alpha3Code
    }
  }
}
