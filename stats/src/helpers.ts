import { BigInt, TypedMap } from "@graphprotocol/graph-ts"
import {
  ChainlinkPrice,
  UniswapPrice
} from "../generated/schema"

export let BASIS_POINTS_DIVISOR = BigInt.fromI32(10000)
export let PRECISION = BigInt.fromI32(10).pow(30)

export let WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
export let BTC = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"
export let BTC_B = "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6"
export let AVAX = "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"
export let APE = "0x4d224452801aced8b2f0aebe155379bb5d594381"
// export let LINK = ""
// export let UNI = ""
// export let USDT = ""
// export let USDC = ""
export let MIM = "0x130966628846bfd36ff31a822705796e8cb8c18d"
// export let SPELL = ""
// export let SUSHI = ""
// export let FRAX = ""
// export let DAI = ""
export let GMX = "0x0798e09e85ac8ea0c5a346f15eab8a7270fa7036"
export let USDC = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
export let AAVE = "0x63a72806098bd3d9520cc43356dd78afe5d386d9"
export let LINK = "0x5947bb275c521040051d82396192181b413227a3"

export let USDT = "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"
export let DAI = "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063"
export let MAI = "0xa3fa99a148fa48d14ed51d610c367c61876997f1"
export let STMATIC = "0x3a58a54c066fdc0f2d55fc9c89f0415c92ebf3c4"


export function timestampToDay(timestamp: BigInt): BigInt {
  return timestampToPeriod(timestamp, "daily")
}

export function timestampToPeriod(timestamp: BigInt, period: string): BigInt {
  let periodTime: BigInt

  if (period == "daily") {
    periodTime = BigInt.fromI32(86400)
  } else if (period == "hourly") {
    periodTime = BigInt.fromI32(3600)
  } else if (period == "weekly" ){
    periodTime = BigInt.fromI32(86400 * 7)
  } else {
    throw new Error("Unsupported period " + period)
  }

  return timestamp / periodTime * periodTime
}

export function getTokenDecimals(token: String): u8 {
  if (token == BTC_B) {
    token = BTC
  }

  let tokenDecimals = new Map<String, i32>()
  tokenDecimals.set(WETH, 18)
  tokenDecimals.set(BTC, 8)
  tokenDecimals.set(MIM, 18)
  tokenDecimals.set(AVAX, 18)
  tokenDecimals.set(USDC, 6)
  tokenDecimals.set(GMX, 18)
  tokenDecimals.set(AAVE, 18)
  tokenDecimals.set(LINK, 18)
  tokenDecimals.set(USDT, 6)
  tokenDecimals.set(DAI, 18)
  tokenDecimals.set(MAI, 18)
  tokenDecimals.set(STMATIC, 18)
  tokenDecimals.set(APE, 18)



  return tokenDecimals.get(token) as u8
}

export function getTokenAmountUsd(token: String, amount: BigInt): BigInt {
  let decimals = getTokenDecimals(token)
  let denominator = BigInt.fromI32(10).pow(decimals)
  let price = getTokenPrice(token)
  return amount * price / denominator
}

export function getTokenPrice(token: String): BigInt {
  if (token == BTC_B) {
    token = BTC
  }

  if (token != GMX) {
    let chainlinkPriceEntity = ChainlinkPrice.load(token)
    if (chainlinkPriceEntity != null) {
      // all chainlink prices have 8 decimals
      // adjusting them to fit GMX 30 decimals USD values
      return chainlinkPriceEntity.value * BigInt.fromI32(10).pow(22)
    }
  }

  if (token == GMX) {
    let uniswapPriceEntity = UniswapPrice.load(GMX)

    if (uniswapPriceEntity != null) {
      return uniswapPriceEntity.value
    }
  }

  let prices = new TypedMap<String, BigInt>()
  prices.set(WETH, BigInt.fromI32(4000) * PRECISION)
  prices.set(BTC, BigInt.fromI32(50000) * PRECISION)
  prices.set(AVAX, BigInt.fromI32(100) * PRECISION)
  prices.set(MIM, PRECISION)
  prices.set(USDC, PRECISION)
  prices.set(GMX, BigInt.fromI32(30) * PRECISION)
  prices.set(AAVE, BigInt.fromI32(60) * PRECISION)
  prices.set(LINK, BigInt.fromI32(6) * PRECISION)
  prices.set(USDT, PRECISION)
  prices.set(DAI, PRECISION)
  prices.set(MAI, PRECISION)
  prices.set(STMATIC, BigInt.fromI32(60) * PRECISION)
  prices.set(APE, BigInt.fromI32(4) * PRECISION)

  return prices.get(token) as BigInt
}
