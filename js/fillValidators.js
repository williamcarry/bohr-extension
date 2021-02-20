'use strict'
/* global $, fetch */

//const API_VALIDOTS = 'http://mainnetapi.bohrweb.org/v2.4.0/validators'
const API_VALIDOTS = 'http://mainnetapi.bohrweb.org/v2.4.0/delegates'

async function fillValidators () {
  const data = await fetch(API_VALIDOTS)
  const json = await data.json()
  if (json.success) {
    var html = ''
    const validators = json.result
    for (let i = 0; i < validators.length; i++) {
      html += `<option data-address=${validators[i].address}>${formatAddress(addressEncode(validators[i].address))}  ${validators[i].name}</option>`
    }
    $('select.validatorsList').html(html)
  }
}

fillValidators()

function formatAddress (address) {
  // first 6 and last 4 symbols
  const first = address.substring(0, 6)
  const last = ''// address.substring(address.length - 9, address.length)
  const result = first + '...  ' + last
  return result
}
