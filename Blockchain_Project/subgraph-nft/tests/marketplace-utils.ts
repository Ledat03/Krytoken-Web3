import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  AddOffer,
  CancelOffer,
  FeeUpdated,
  MatchedOffer,
  OrderAdded,
  OrderCancel,
  OrderMatched,
  OwnershipTransferred
} from "../generated/Marketplace/Marketplace"

export function createAddOfferEvent(
  buyer: Address,
  price: BigInt,
  tokenTransfer: Address,
  tokenId: BigInt
): AddOffer {
  let addOfferEvent = changetype<AddOffer>(newMockEvent())

  addOfferEvent.parameters = new Array()

  addOfferEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  addOfferEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  addOfferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenTransfer",
      ethereum.Value.fromAddress(tokenTransfer)
    )
  )
  addOfferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return addOfferEvent
}

export function createCancelOfferEvent(
  buyer: Address,
  tokenId: BigInt,
  index: BigInt
): CancelOffer {
  let cancelOfferEvent = changetype<CancelOffer>(newMockEvent())

  cancelOfferEvent.parameters = new Array()

  cancelOfferEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  cancelOfferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  cancelOfferEvent.parameters.push(
    new ethereum.EventParam("index", ethereum.Value.fromUnsignedBigInt(index))
  )

  return cancelOfferEvent
}

export function createFeeUpdatedEvent(
  feeByDecimal: BigInt,
  feeRate: BigInt
): FeeUpdated {
  let feeUpdatedEvent = changetype<FeeUpdated>(newMockEvent())

  feeUpdatedEvent.parameters = new Array()

  feeUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "feeByDecimal",
      ethereum.Value.fromUnsignedBigInt(feeByDecimal)
    )
  )
  feeUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "feeRate",
      ethereum.Value.fromUnsignedBigInt(feeRate)
    )
  )

  return feeUpdatedEvent
}

export function createMatchedOfferEvent(
  buyer: Address,
  seller: Address,
  price: BigInt,
  tokenId: BigInt
): MatchedOffer {
  let matchedOfferEvent = changetype<MatchedOffer>(newMockEvent())

  matchedOfferEvent.parameters = new Array()

  matchedOfferEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  matchedOfferEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  matchedOfferEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  matchedOfferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return matchedOfferEvent
}

export function createOrderAddedEvent(
  orderId: BigInt,
  buyer: Address,
  seller: Address,
  price: BigInt,
  tokenTransfer: Address,
  tokenId: BigInt
): OrderAdded {
  let orderAddedEvent = changetype<OrderAdded>(newMockEvent())

  orderAddedEvent.parameters = new Array()

  orderAddedEvent.parameters.push(
    new ethereum.EventParam(
      "orderId",
      ethereum.Value.fromUnsignedBigInt(orderId)
    )
  )
  orderAddedEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  orderAddedEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  orderAddedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  orderAddedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenTransfer",
      ethereum.Value.fromAddress(tokenTransfer)
    )
  )
  orderAddedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return orderAddedEvent
}

export function createOrderCancelEvent(orderId: BigInt): OrderCancel {
  let orderCancelEvent = changetype<OrderCancel>(newMockEvent())

  orderCancelEvent.parameters = new Array()

  orderCancelEvent.parameters.push(
    new ethereum.EventParam(
      "orderId",
      ethereum.Value.fromUnsignedBigInt(orderId)
    )
  )

  return orderCancelEvent
}

export function createOrderMatchedEvent(
  orderId: BigInt,
  buyer: Address,
  price: BigInt,
  tokenTransfer: Address,
  tokenId: BigInt,
  seller: Address
): OrderMatched {
  let orderMatchedEvent = changetype<OrderMatched>(newMockEvent())

  orderMatchedEvent.parameters = new Array()

  orderMatchedEvent.parameters.push(
    new ethereum.EventParam(
      "orderId",
      ethereum.Value.fromUnsignedBigInt(orderId)
    )
  )
  orderMatchedEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  orderMatchedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  orderMatchedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenTransfer",
      ethereum.Value.fromAddress(tokenTransfer)
    )
  )
  orderMatchedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  orderMatchedEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )

  return orderMatchedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}
