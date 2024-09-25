import { AnchorProvider, Program } from "@project-serum/anchor";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

import { getVaultAddress } from "../accounts";
import { toBN } from "../utils";

export const deposit = async (
  amount: number,
  program: Program,
  provider: AnchorProvider
) => {
  let tx = new Transaction();

  tx.add(await createDepositIx(provider.publicKey, amount, program));

  const txId = await provider.sendAndConfirm(tx, [], {
    commitment: "confirmed",
  });

  console.log("txHash =", txId);

  return true;
};

export const createDepositIx = async (
  player: PublicKey,
  amount: number,
  program: Program
) => {
  const globalVault = await getVaultAddress(program.programId);

  const ix = program.methods
    .deposit(toBN(BigInt(amount * 1e9)))
    .accounts({
      player,
      globalVault,
      systemProgram: SystemProgram.programId,
    })
    .signers([])
    .instruction();

  return ix;
};
