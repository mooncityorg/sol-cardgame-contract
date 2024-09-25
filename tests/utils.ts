import { AnchorProvider } from "@project-serum/anchor";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { Connection, Keypair } from "@solana/web3.js";

export async function createNewTester(provider: AnchorProvider) {
  const newUserWallet = Keypair.generate();
  const wallet = new NodeWallet(newUserWallet);

  // Configure the client to use the local cluster.
  await provider.connection.confirmTransaction(
    await provider.connection.requestAirdrop(wallet.publicKey, 10 * 1e9),
    "confirmed"
  );

  const provider2 = new AnchorProvider(provider.connection, wallet, {
    commitment: "confirmed",
  });

  return provider2;
}

export async function getMinRent(connection: Connection) {
  return await connection.getMinimumBalanceForRentExemption(0);
}
