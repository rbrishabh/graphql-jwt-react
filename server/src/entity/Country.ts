import { Field, ObjectType } from 'type-graphql'

// type CurrencyType = { code: string, name: string, symbol: string }

@ObjectType()
export class CurrencyType {
  @Field()
  code: string
  @Field()
  name: string
  @Field()
  symbol: string
  @Field()
  exchangeRateToSEK: number
  @Field()
  exchangeRateFromSEK: number
}

@ObjectType()
export class Country {
  @Field()
  name: string
  @Field()
  population: string
  @Field()
  alpha3Code: string
  @Field(() => [CurrencyType])
  currencies: CurrencyType[]
}
