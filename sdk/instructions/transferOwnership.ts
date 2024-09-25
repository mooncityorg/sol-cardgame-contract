import { AnchorProvider, Program } from "@project-serum/anchor";
import { PublicKey, Transaction } from "@solana/web3.js";

import { getGlobalPoolAddress } from "../accounts";

export const transferOwnership = async (
  newAdmin: PublicKey,
  program: Program,
  provider: AnchorProvider
) => {
  let tx = new Transaction();

  tx.add(
    await createTransferOwnershipIx(provider.publicKey, newAdmin, program)
  );

  const txId = await provider.sendAndConfirm(tx, [], {
    commitment: "confirmed",
  });

  console.log("txHash =", txId);

  return true;
};

export const createTransferOwnershipIx = async (
  admin: PublicKey,
  newAdmin: PublicKey,
  program: Program
) => {
  const globalAuthority = await getGlobalPoolAddress(program.programId);

  const ix = program.methods
    .transferOwnership(newAdmin)
    .accounts({
      admin,
      globalAuthority,
    })
    .signers([])
    .instruction();

  return ix;
};
