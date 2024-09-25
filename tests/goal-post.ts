import * as anchor from "@project-serum/anchor";
import { AnchorProvider, Program } from "@project-serum/anchor";
import assert from "assert";
import {
  deposit,
  getGlobalState,
  getVaultBalance,
  initProject,
  updateAuthority,
  withdraw,
} from "../sdk";

import { GoalPost } from "../target/types/goal_post";
import { createNewTester, getMinRent } from "./utils";

describe("goal-post", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider: AnchorProvider = anchor.getProvider() as AnchorProvider;

  let userProvider: AnchorProvider;
  let authorityProvider: AnchorProvider;

  const adminSigner = (provider.wallet as anchor.Wallet).payer;
  let authoritySigner;

  const program = anchor.workspace.GoalPost as Program<GoalPost>;

  before(async () => {
    userProvider = await createNewTester(provider as AnchorProvider);
    authorityProvider = await createNewTester(provider as AnchorProvider);
    authoritySigner = (authorityProvider.wallet as anchor.Wallet).payer;
  });

  it("Is initialized!", async () => {
    await initProject(program as Program, provider as AnchorProvider);

    const globalStateInfo = await getGlobalState(program as Program);

    assert.equal(
      globalStateInfo.superAdmin.toString(),
      provider.publicKey.toString()
    );

    assert.equal(
      globalStateInfo.authoritySigner.toString(),
      provider.publicKey.toString()
    );
  });

  it("Update authority as admin", async () => {
    await updateAuthority(
      authorityProvider.publicKey,
      program as Program,
      provider as AnchorProvider
    );

    const globalStateInfo = await getGlobalState(program as Program);

    assert.equal(
      globalStateInfo.superAdmin.toString(),
      provider.publicKey.toString()
    );

    assert.equal(
      globalStateInfo.authoritySigner.toString(),
      authorityProvider.publicKey.toString()
    );
  });

  it("Deposit as user", async () => {
    // Deposit 1 SOL.
    await deposit(1, program as Program, userProvider as AnchorProvider);
    const vaultBalance = await getVaultBalance(userProvider.connection);
    const rent = await getMinRent(userProvider.connection);

    assert.equal(vaultBalance, 1e9 + rent, "Vault balance is not 1 SOL");
  });

  it("Withdraw as admin", async () => {
    // Withdraw 0.1 SOL.
    await withdraw(
      0.1,
      adminSigner,
      program as Program,
      provider as AnchorProvider
    );
    const vaultBalance = await getVaultBalance(provider.connection);
    const rent = await getMinRent(provider.connection);

    assert.equal(
      vaultBalance,
      0.9 * 1e9 + rent,
      "Vault balance is not 0.9 SOL"
    );
  });

  it("Withdraw as user with authority", async () => {
    // Withdraw 0.3 SOL.
    await withdraw(
      0.3,
      authoritySigner,
      program as Program,
      userProvider as AnchorProvider
    );
    const vaultBalance = await getVaultBalance(userProvider.connection);
    const rent = await getMinRent(userProvider.connection);

    assert.equal(
      vaultBalance,
      0.6 * 1e9 + rent,
      "Vault balance is not 0.6 SOL"
    );
  });
});
