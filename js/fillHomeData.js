'use strict'
/* global $, chrome, fetch */
import { getExchangeRate } from './utils/exchanges.js'
import { getLastActiveAccount, getAllAccounts } from './utils/accounts.js'

const API = 'http://mainnetapi.bohrweb.org/v2.4.0/'

async function getAccountData () {
  let lastActive = await getLastActiveAccount()
  /* If for some reason last active account is not found, set the first one as active */
  if (!lastActive) {
    lastActive = (await getAllAccounts())[0]
  }
  if (!lastActive) {
    return { error: true, code: 'NO_ACCOUNT' }
  } else {
    chrome.storage.local.set({ 'lastActiveAccount': {
      name: lastActive.name,
      address: lastActive.address
    } })
  }
  const response = await fetch(API + 'account?address=' + lastActive.address)
  const addressData = await response.json()
  addressData.address = lastActive.address
  addressData.name = lastActive.name
  return addressData
}

async function fillAccount () {
  const accounts = await getAllAccounts()
  const data = await getAccountData()
  if (!data) {
    console.error('Cannot retrieve account data from the remote Bohr node.')
    return
  }
  if (data.error && data.code === 'NO_ACCOUNT') {
    window.location.href = 'welcome.html'
    return
  }

  const price = 1
  const availableBal = formatAmount(data.result.available)
  const usdAmount = (price * availableBal).toFixed(2)
  const lockedBal = formatAmount(data.result.locked)
  const formedAddress = formatAddress(data.address)

  let accountsHtml = ''
  for (let account of accounts) {
    accountsHtml +=
      `<option value="${addressEncode(account.address)}" data-name="${account.name}"` +
      `${account.address === data.address ? 'selected' : ''}>` +
      `${account.name} (${formatAddress(addressEncode(account.address))})</option>`
  }
  $('div.addressData select.activeAddress').append(accountsHtml)
  $('div.addressData p.hexAddress').text(addressEncode(formedAddress))
  $('div.addressData p.hexAddress').attr('data-address', addressEncode(data.address))
  $('p.bohrValue').text(availableBal.toFixed(4) + ' BR')
  if (!parseFloat(usdAmount)) {
    $('p.usdValue').hide()
  }
  $('.bohrLocked').prepend('<span>' + lockedBal.toFixed(3) + ' BR</span>')
  // getTxs
  if (data.result.transactionCount > 5) {
    const limitFrom = Number(data.result.transactionCount) - 5
    const limitTo = Number(data.result.transactionCount)
    const txsData = await getTxs(data.address, limitFrom, limitTo)
    console.log(txsData)
    fillTxs(txsData, data.address)
  } else if (data.result.transactionCount > 0) {
    const txsData = await getTxs(data.address, 0, 5)
    fillTxs(txsData, data.address)
  } else {
    $('.transactionList').append("<p class = 'noTxs gray'>No Transactions</p>")
  }
}

fillAccount()

// get Latest 5 txs
async function getTxs (address, limitFrom, limitTo) {
  const response = await fetch(API + 'account/transactions?address=' + address + '&from=' + limitFrom + '&to=' + limitTo)
  const data = await response.json()
  return data
}

async function fillTxs (data, address) {
  if (!data) return { error: true, reason: 'Node API Drop' }
  let html = ''
  let txArr = data.result.reverse();
  for (let tx of txArr) {
    let value = formatAmount(tx.value)
    const timestamp = tx.timestamp
    let type = tx.to === address ? 'in' : 'out'
    if (tx.from === tx.to) {
      type = 'internal'
    }
    value = type === 'out' ? '-' + value : '+' + value
    html +=
      `<div class='txElement'><div class='transactionItem'><div class='txDataType'>` +
      `<p class='tranasctionType'>${tx.type}</p>` +
      `<p class='transactionDate' style="color: #fff">${parseTimeUTC(parseInt(timestamp/1000),'{m}/{d} {h}:{i}')}</p>` +
      `</div>` +
      `<div class='transactionAmount tx-${type}'>${value} BR</div><div class='clearfix'></div></div>` +
      `<div class='transactionExpand' >` +
      `<div class='transactionExpandHeader'><p>Details:</p><p>` +
      `<img class="openExplorerHash" src ='../img/icons/share.png' width='22px' data-hash='${tx.hash}'/></p></div>` +
      `<div class='transactionExpandBody'>` +
      `<div class='tranasctionRow'><p>From: </p><p>${addressEncode(tx.from)}</p></div>` +
      `<div class='tranasctionRow'><p>To: </p><p>${addressEncode(tx.to)}</p></div>` +
      `<div class='tranasctionRow'><p>Amount: </p><p>${tx.value / Math.pow(10, 9)} BR </p></div>` +
      `<div class='tranasctionRow'><p>Fee: </p><p>${tx.fee / Math.pow(10, 9)} BR </p></div>` +
      `<div class='tranasctionRow'><p>Total: </p><p>${(tx.value / Math.pow(10, 9) + tx.fee / Math.pow(10, 9))} BR </p></div>` +
      `</div></div></div>`
  }
  $('.transactionList').append(html)
}

// MOVE TO SEPARATE FILE
function parseTimeUTC(time, cFormat) {
  const format = cFormat || '{y}-{m}-{d} '
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  let newt = ''+date.toUTCString();	//"Tue, 09 Feb 2021 22:05:53 GMT"
  //Feb-09-2021 01:14:14 PM +UTC
  newt = newt.split(",")[1].trim();
  let darr = newt.split(" ");

  let hms = darr[3];
  let hours = parseInt(hms.split(":")[0]) ;
  let minutes = parseInt(hms.split(":")[1]) ;

  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  hours = hours < 10 ? '0'+hours : hours;


  let result = darr[1]+"-"+darr[0]+"-"+darr[2]+" "+hours+":"+minutes+" "+ampm+" +UTC";
  return ''+result;
}

function formatDate (string) {
  let newDate = new Date()
  newDate.setTime(string)
  const month = newDate.getMonth() + 1
  const year = newDate.getFullYear()
  const day = newDate.getDay() + 1
  const minutes = newDate.getMinutes()
  const hours = newDate.getHours()
  const mmddyy = month + '/' + day + '/' + year + ' at ' + hours + ':' + minutes
  return mmddyy
}

function formatAddress (address, symbols) {
  // first 6 and last 4 symbols
  if (!symbols) symbols = 6
  const first = address.substring(0, symbols)
  const last = address.substring(address.length - symbols, address.length)
  const result = first + '...' + last
  return result
}

function formatAmount (string) {
  const digit = Number(string) / Math.pow(10, 9)
  return digit
}
