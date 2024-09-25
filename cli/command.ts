import { program } from "commander";
import { getGlobalInfo, initialize, setClusterConfig } from "./scripts";

program.version("0.0.1");

programCommand("status")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .action(async (directory, cmd) => {
    const { env, keypair, rpc } = cmd.opts();
    console.log("Solana Env Config: ", env);
    console.log("Keypair Path: ", keypair);
    console.log("RPC URL: ", rpc);
    if (!keypair) {
      console.log("Error Config Data Input");
      return;
    }
    await setClusterConfig(env, keypair, rpc);

    await getGlobalInfo();
  });

programCommand("initialize")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .action(async (directory, cmd) => {
    const { env, keypair, rpc } = cmd.opts();
    console.log("Solana Env Config: ", env);
    console.log("Keypair Path: ", keypair);
    console.log("RPC URL: ", rpc);
    if (!keypair) {
      console.log("Error Config Data Input");
      return;
    }
    await setClusterConfig(env, keypair, rpc);

    await initialize();
  });

function programCommand(name: string) {
  return program
    .command(name)
    .requiredOption(
      "-e, --env <string>",
      "Solana cluster env name",
      "devnet" //mainnet-beta, testnet, devnet
    )
    .requiredOption(
      "-k, --keypair <string>",
      "Solana wallet Keypair Path"
      // '/home/ubuntu/fury/deploy-keypair.json',
    )
    .option(
      "-r, --rpc <string>",
      "Solana cluster RPC name"
      // 'https://api.devnet.solana.com',
    );
}

program.parse(process.argv);
