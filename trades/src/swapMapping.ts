import { BigInt, Address, ethereum } from "@graphprotocol/graph-ts";

import { Swap as SwapEvent } from "../generated/Router/Router";

import { Swap, Transaction } from "../generated/schema";

function _getIdFromEvent(event: ethereum.Event): string {
  return event.transaction.hash.toHexString() + ":" + event.logIndex.toString();
}

export function handleSwap(event: SwapEvent): void {
  let id = _getIdFromEvent(event);
  let entity = new Swap(id);

  entity.tokenIn = event.params.tokenIn.toHexString();
  entity.tokenOut = event.params.tokenOut.toHexString();
  entity.account = event.params.account.toHexString();

  entity.amountIn = event.params.amountIn;
  entity.amountOut = event.params.amountOut;
  entity.transaction = event.transaction.hash.toHexString();
  entity.timestamp = event.block.timestamp.toI32();

  entity.save();
}
