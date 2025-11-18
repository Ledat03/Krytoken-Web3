import {
  AddOffer as AddOfferEvent,
  CancelOffer as CancelOfferEvent,
  FeeUpdated as FeeUpdatedEvent,
  MatchedOffer as MatchedOfferEvent,
  OrderAdded as OrderAddedEvent,
  OrderCancel as OrderCancelEvent,
  OrderMatched as OrderMatchedEvent,
  OwnershipTransferred as OwnershipTransferredEvent
} from "../generated/Marketplace/Marketplace"
import {
  AddOffer,
  CancelOffer,
  FeeUpdated,
  MatchedOffer,
  OrderAdded,
  OrderCancel,
  OrderMatched,
  OwnershipTransferred
} from "../generated/schema"

export function handleAddOffer(event: AddOfferEvent): void {
  let entity = new AddOffer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.buyer = event.params.buyer
  entity.price = event.params.price
  entity.tokenTransfer = event.params.tokenTransfer
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCancelOffer(event: CancelOfferEvent): void {
  let entity = new CancelOffer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.buyer = event.params.buyer
  entity.tokenId = event.params.tokenId
  entity.index = event.params.index

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFeeUpdated(event: FeeUpdatedEvent): void {
  let entity = new FeeUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.feeByDecimal = event.params.feeByDecimal
  entity.feeRate = event.params.feeRate

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMatchedOffer(event: MatchedOfferEvent): void {
  let entity = new MatchedOffer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.buyer = event.params.buyer
  entity.seller = event.params.seller
  entity.price = event.params.price
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOrderAdded(event: OrderAddedEvent): void {
  let entity = new OrderAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.orderId = event.params.orderId
  entity.buyer = event.params.buyer
  entity.seller = event.params.seller
  entity.price = event.params.price
  entity.tokenTransfer = event.params.tokenTransfer
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOrderCancel(event: OrderCancelEvent): void {
  let entity = new OrderCancel(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.orderId = event.params.orderId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOrderMatched(event: OrderMatchedEvent): void {
  let entity = new OrderMatched(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.orderId = event.params.orderId
  entity.buyer = event.params.buyer
  entity.price = event.params.price
  entity.tokenTransfer = event.params.tokenTransfer
  entity.tokenId = event.params.tokenId
  entity.seller = event.params.seller

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
