import { BN } from "@project-serum/anchor";
import { Connection } from "@solana/web3.js";
import { getVaultAddress } from "./accounts";
import { PROGRAM_ID } from "./config";

export const getVaultBalance = async (connection: Connection) => {
  const globalVault = await getVaultAddress(PROGRAM_ID);
  console.log(globalVault);
  try {
    const balance = await connection.getBalance(globalVault);
    return balance;
  } catch (e) {
    console.log("Error while get vault balance");
    return 0;
  }
};

export function toBigInt(amount: BN): BigInt {
  return BigInt(amount.toString());
}

export function toBN(amount: BigInt): BN {
  const str = amount.toString();
  return new BN(str);
}
