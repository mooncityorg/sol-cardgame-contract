import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

export const GLOBAL_AUTHORITY_SEED = "global-authority";
export const VAULT_AUTHORITY_SEED = "vault-authority";

export interface GlobalPool {
  superAdmin: PublicKey; // 32
  authoritySigner: PublicKey; // 32
}

export const getGlobalState = async (
  program: Program
): Promise<GlobalPool | null> => {
  const [globalAuthority] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    program.programId
  );

  try {
    let globalState = await program.account.globalPool.fetch(globalAuthority);
    return globalState as unknown as GlobalPool;
  } catch {
    return null;
  }
};

export const getGlobalPoolAddress = async (
  programId: PublicKey
): Promise<PublicKey> => {
  const [globalAuthority] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    programId
  );
  return globalAuthority;
};

export const getVaultAddress = async (
  programId: PublicKey
): Promise<PublicKey> => {
  const [globalVault] = await PublicKey.findProgramAddress(
    [Buffer.from(VAULT_AUTHORITY_SEED)],
    programId
  );
  return globalVault;
};
