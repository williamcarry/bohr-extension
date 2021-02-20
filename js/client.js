'use strict'
/* global $, chrome */

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

$('.goToHomePage').on('click', function (e) {
  e.preventDefault()
  chrome.storage.local.set({ 'txData': {} })
  window.location.href = 'home.html'
})

$('select.activeAddress').on('change', function (e) {
  e.preventDefault()
  chrome.storage.local.set({ 'lastActiveAccount': {
    name: $(this).data('name'),
    address: $(this).val()
  } })
  window.location.href = 'home.html'
})

$('li.goToNewAccPage').on('click', function (e) {
  e.preventDefault()
  window.location.href = 'newAccount.html#create-tab'
})

$('li.goToImportAccPage').on('click', function (e) {
  e.preventDefault()
  window.location.href = 'newAccount.html#import-tab'
})

$('li.goToHardwarePage').on('click', function (e) {
  e.preventDefault()
  window.location.href = 'newAccount.html#connect-tab'
})

$('a.copyAddress').on('click', function (e) {
  const address = $('.activeAddress').val()
  navigator.clipboard.writeText(address)
})

$('a.openExplorer').on('click', function (e) {
  let address = $('.activeAddress').val()
  if(address.indexOf("0x") == 0){
    address = addressEncode2(address);
  }
  chrome.tabs.create({ url: 'http://explorer.bohrweb.org/addressDetail.html?address=' + address })
})

$('a.showQR').on('click', function (e) {
  e.preventDefault()
  window.location.href = 'accountDetails.html'
})

$('.transactionList').on('click', ".openExplorerHash", function (e) {
  // var hash = $(".openExplorerHash").attr("data-hash");
  var hash = e.target.dataset.hash;
  chrome.tabs.create({ url: 'http://explorer.bohrweb.org/txnsDetails.html?transaction=' + hash })
})

$('div.goToNewAccPage, button.goToNewAccPage').on('click', function (e) {
  e.preventDefault()
  window.location.href = 'newAccount.html'
})

$('a.goToSendPage, div.goToSendPage').on('click', function (e) {
  e.preventDefault()
  window.location.href = 'send.html'
})

$('a.goToVotePage').on('click', function (e) {
  e.preventDefault()
  window.location.href = 'vote.html'
})

$('button.btn-cancel').on('click', function (e) {
  e.preventDefault()
  chrome.storage.local.set({ 'txData': {} })
  window.location.href = 'home.html'
})

$('div.transactionList').on('click', 'div.transactionItem', function (e) {
  e.preventDefault()

  $(this).parent().find('div.transactionExpand').slideToggle()
})

$('select.selectImportType').on('change', function (e) {
  e.preventDefault()
  var type = $('.selectImportType option:selected').val()
  if (type === 'privateKey') {
    // add ledger here
    $('.importKey').show()
    $('span.error').text('')
    $('.importJson, .connectLedger').hide()
  } else {
    $('.importJson').show()
    $('span.error').text('')
    $('.importKey, .connectLedger').hide()
  }
})

$('button.goToExplorer').on('click', function (e) {
  let address = $('div.hexAddress span').text()
  if(address.indexOf("0x") == 0){
    address = addressEncode2(address);
  }
  chrome.tabs.create({ url: 'http://explorer.bohrweb.org/addressDetail.html?address=' + address })
})

$('button.exportPrivateKey').on('click', function (e) {
  e.preventDefault()
})

var url = document.location.toString()
if (url.match('#')) {
  const tab = url.split('#')[1]
  $('.nav-tabs a[href="#' + tab + '"]').tab('show')
}
