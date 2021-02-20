/* global chrome */

/**
 */
export function getExchangeRate (ticker = 'usdt') {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('exchangeRates', (result) => {
      const rates = result.exchangeRates
      if (rates && rates[ticker]) {
        return resolve(rates[ticker])
      }
      resolve(null)
    })
  })
}
