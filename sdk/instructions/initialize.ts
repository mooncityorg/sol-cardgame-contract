import { AnchorProvider, Program } from "@project-serum/anchor";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";

import { getGlobalPoolAddress, getVaultAddress } from "../accounts";

export const initProject = async (
  program: Program,
  provider: AnchorProvider
) => {
  let tx = new Transaction();

  tx.add(await createInitIx(provider.publicKey, program));

  const txId = await provider.sendAndConfirm(tx, [], {
    commitment: "confirmed",
  });

  console.log("txHash =", txId);

  return true;
};

export const createInitIx = async (admin: PublicKey, program: Program) => {
  const globalAuthority = await getGlobalPoolAddress(program.programId);
  const globalVault = await getVaultAddress(program.programId);

  const ix = program.methods
    .initialize()
    .accounts({
      admin,
      globalAuthority,
      globalVault,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .signers([])
    .instruction();

  return ix;
};
