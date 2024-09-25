import { AnchorProvider, BN, Program } from "@project-serum/anchor";
import { PublicKey, Signer, SystemProgram, Transaction } from "@solana/web3.js";

import {
  getGlobalPoolAddress,
  getGlobalState,
  getVaultAddress,
} from "../accounts";

export const withdraw = async (
  amount: number,
  authoritySigner: Signer,
  program: Program,
  provider: AnchorProvider
) => {
  let tx = new Transaction();

  tx.add(
    await createWithdrawIx(provider.publicKey, authoritySigner, amount, program)
  );

  tx.feePayer = provider.publicKey;
  tx.recentBlockhash = (
    await provider.connection.getLatestBlockhash()
  ).blockhash;
  tx.partialSign(authoritySigner);

  const txId = await provider.sendAndConfirm(tx, [], {
    commitment: "confirmed",
  });

  console.log("txHash =", txId);

  return true;
};

export const createWithdrawIx = async (
  player: PublicKey,
  authoritySigner: Signer,
  amount: number,
  program: Program
) => {
  const globalPool = await getGlobalState(program);
  if (!globalPool) throw "Program is not initialized";

  if (
    globalPool.superAdmin.toBase58() !== player.toBase58() &&
    globalPool.authoritySigner.toBase58() !==
      authoritySigner.publicKey.toBase58()
  )
    throw "Authority signer mismatch";

  const globalAuthority = await getGlobalPoolAddress(program.programId);
  const globalVault = await getVaultAddress(program.programId);

  const ix = program.methods
    .withdraw(new BN(amount * 1e9))
    .accounts({
      player,
      authoritySigner: authoritySigner.publicKey,
      globalAuthority,
      globalVault,
      systemProgram: SystemProgram.programId,
    })
    .signers([authoritySigner])
    .instruction();

  return ix;
};
