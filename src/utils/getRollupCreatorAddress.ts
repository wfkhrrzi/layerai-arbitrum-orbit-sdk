import { Client, Transport, Chain, ChainContract, Address } from 'viem';

import { rollupCreatorAddress } from '../contracts/RollupCreator';
import { validateParentChain } from '../types/ParentChain';
import { getCustomParentChains } from '../chains';

export function getRollupCreatorAddress<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
): Address {
  const { chainId: parentChainId, isCustom: parentChainIsCustom } = validateParentChain(client);

  if (parentChainIsCustom) {
    const customChains = getCustomParentChains().filter(({ id }) => parentChainId == id)[0];

    const contract = customChains.contracts?.rollupCreator as ChainContract | undefined;
    const address = contract?.address;

    if (typeof address === 'undefined') {
      throw new Error(
        `Address for RollupCreator is missing on custom parent chain with id ${parentChainId}`,
      );
    }

    return address;
  }

  return rollupCreatorAddress[parentChainId];
}
