import { Program, web3 } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import { Keypair } from "@solana/web3.js";
import fs from "fs";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";

import {
  getGlobalPoolAddress,
  getGlobalState,
  getVaultAddress,
  GlobalPool,
  initProject,
  PROGRAM_ID,
} from "../sdk";

let solConnection: web3.Connection;
let provider: anchor.AnchorProvider;
let program: Program;

export const getGlobalInfo = async () => {
  const globalAuthority = await getGlobalPoolAddress(PROGRAM_ID);
  console.log("GlobalAuthority: ", globalAuthority.toBase58());

  const globalVault = await getVaultAddress(PROGRAM_ID);
  console.log("RewardVault: ", globalVault.toBase58());

  const globalPool: GlobalPool = await getGlobalState(program as Program);
  console.log(
    "GlobalPool Admin =",
    globalPool.superAdmin.toBase58(),
    globalPool.authoritySigner.toBase58()
  );
};

export const setClusterConfig = async (
  cluster: web3.Cluster,
  keypair: string,
  rpc?: string
) => {
  if (!rpc) {
    solConnection = new web3.Connection(web3.clusterApiUrl(cluster));
  } else {
    solConnection = new web3.Connection(rpc);
  }

  const walletKeypair = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync(keypair, "utf-8"))),
    { skipValidation: true }
  );
  const wallet = new NodeWallet(walletKeypair);

  // Configure the client to use the local cluster.
  provider = new anchor.AnchorProvider(solConnection, wallet, {
    skipPreflight: true,
    commitment: "confirmed",
  });
  anchor.setProvider(provider);

  console.log("Wallet Address: ", wallet.publicKey.toBase58());

  const idl = JSON.parse(
    fs.readFileSync(__dirname + "/../sdk/idl/goal_post.json", "utf8")
  );

  // Generate the program client from IDL.
  program = new anchor.Program(idl, PROGRAM_ID, provider);
  console.log("ProgramId: ", PROGRAM_ID.toBase58());
};

export const initialize = async () => {
  await initProject(program, provider);
};
