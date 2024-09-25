import { AnchorProvider, Program } from "@project-serum/anchor";
import { PublicKey, Transaction } from "@solana/web3.js";

import { getGlobalPoolAddress } from "../accounts";

export const updateAuthority = async (
  newAuthority: PublicKey,
  program: Program,
  provider: AnchorProvider
) => {
  let tx = new Transaction();

  tx.add(
    await createUpdateAuthorityIx(provider.publicKey, newAuthority, program)
  );

  const txId = await provider.sendAndConfirm(tx, [], {
    commitment: "confirmed",
  });

  console.log("txHash =", txId);

  return true;
};

export const createUpdateAuthorityIx = async (
  admin: PublicKey,
  newAuthority: PublicKey,
  program: Program
) => {
  const globalAuthority = await getGlobalPoolAddress(program.programId);

  const ix = program.methods
    .updateAuthority(newAuthority)
    .accounts({
      admin,
      globalAuthority,
    })
    .signers([])
    .instruction();

  return ix;
};
