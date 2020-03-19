'use strict'

module.exports.responseCodes = {
  '00': 'APPROVED',

  '01': 'REFER TO CARD ISSUER',
  '02': 'REFER TO CARD ISSUER',
  '03': 'INVALID MERCHANT',
  '04': 'PICK-UP CARD',
  '05': 'DO NOT HONOR',
  '06': 'ERROR',
  '07': 'PICK-UP CARD SPECIAL CONDITION',
  7: 'CONTACT CARD ISSUER',
  10: 'PARTIAL APPROVAL, PRIVATE LABEL',
  11: 'VIP APPROVAL',
  12: 'INVALID TRANSACTION',
  13: 'INVALID AMOUNT',
  14: 'DATA NOT AVAILABLE',
  15: 'BILL REFERENCE NOT FOUND',
  19: 'REENTER TRANSACTION',
  21: 'NO ACTION TAKEN',
  25: 'DECLINE',
  27: 'INVALID VALUE',
  28: 'FILE IS TEMPORARILY UNAVAILABLE',
  30: 'FORMAT ERROR',
  31: 'BANK NOT SUPPORTED BY SWITCH',
  33: 'EXPIRED CARD',
  34: 'SUSPECTED FRAUD',
  35: 'CARD ACCEPTOR CONTACT ACQUIRER',
  36: 'RESTRICTED CARD',
  37: 'CARD ACCEPTOR CONTACT ACQUIRER',
  38: 'ALLOWABLE PIN TRIES EXCEEDED',
  39: 'NO CREDIT ACCOUNT',
  40: 'REQUESTED FUNCTION NOT SUPPORTED',
  41: 'LOST CARD',
  43: 'STOLEN CARD PICK UP',
  51: 'INSUFFICIENT FUND',
  52: 'NO CHECKING ACCOUNT',
  53: 'NO SAVINGS ACCOUNT',
  54: 'EXPIRED CARD',
  55: 'INCORRECT PIN',
  57: 'TXN NOT PERMITTED TO CARDHOLDER',
  58: 'TXN NOT PERMITTED TO TERMINAL',
  61: 'LIMIT AMOUNT EXCEEDED',
  62: 'UNAUTHORIZED USAGE',
  63: 'SECURITY VIOLATION',
  64: 'ORIGINAL AMOUNT',
  65: 'LIMIT USAGE EXCEEDED',
  67: 'PICK-UP CARD',
  68: 'RESPONSE RECEIVE TOO LATE',
  75: 'ALLOWABLE OF PIN TRIES EXCEEDED',
  76: 'NUMBER/ID WRONG OR UNREGISTERED',
  77: 'NO SHARING',
  80: 'INVALID DATE',
  81: 'PIN CRYPTOGRAPHIC ERROR FOUND',
  82: 'ALREADY REGISTERED',
  83: 'UNABLE TO VERIFY PIN',
  84: 'TIME LIMIT',
  85: 'NO REASON TO DECLINE A REQUEST FOR ACCOUNT NUMBER VERIFICATION OR ADDRESS VERIFICATION',
  86: 'NO STATEMENT INFORMATION',
  87: 'NO STATEMENT INFORMATION',
  88: 'BILL ALREADY PAID',
  89: 'DATABASE PROBLEM',
  91: 'ISSUER OR SWITCH INOPERATIVE',
  92: 'UNABLE TO PROCESS - INVALID ROUTING',
  93: 'TRANSACTION CANNOT BE COMPLETED - VIOLATION OF LAW',
  94: 'DUPLICATE TRANSACTION',
  95: 'RECONCILE ERROR',
  96: 'SYSTEM MALFUNCTION',
  97: 'INVALID ARQC/ARPC',
  99: 'OUTSTANDING EXIST',
  A0: 'APPROVED W/',
  N0: 'FORCE STIP',
  N7: 'DECLINE FOR CVV2 FAILURE',
  P0: 'INVALID MERCHANT',
  P1: 'INVALID TRANSACTION',
  P2: 'INVALID AMOUNT',
  P3: 'CARD NOT EXIST',
  P4: 'CARD BLACKLISTED',
  P5: 'CARD EXPIRED',
  P6: 'CARD NOT ACTIVE',
  P7: 'DECLINED',
  P8: 'LIMIT EXCEEDED',
  LE: 'TERMINAL LINE ENCRYPTION ERROR'
}
