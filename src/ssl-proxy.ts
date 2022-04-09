import chalk from "chalk";
import path from "path";
import fs from "fs";
import proxy from "http-proxy";
import * as hostfileHelper from "./host-file";

import { exec } from "./util";

type Params = {
  hostname?: string;
  source?: number;
  target?: number;
  shouldRemoveHostname?: boolean;
  disableOpenPage?: boolean;
};

const createCertificate = async (hostname: string) => {
  const certPath = `${__dirname}/../cert`;
  await exec(`sh -c "cd ${certPath} && mkcert ${hostname}"`);
  return {
    certFile: path.join(certPath, `${hostname}.pem`),
    keyFile: path.join(certPath, `${hostname}-key.pem`),
  };
};

const isLocalhost = (host: string) => {
  return ["127.0.0.1", "localhost", "0.0.0.0"].includes(host);
};

const createServer = ({ hostname, target, keyFile, certFile, source }) =>
  proxy
    .createServer({
      xfwd: true,
      ws: true,
      target: {
        host: hostname,
        port: target,
      },
      ssl: {
        key: fs.readFileSync(keyFile, "utf8"),
        cert: fs.readFileSync(certFile, "utf8"),
      },
    })
    .on("error", function (error: any) {
      console.error(error);
    })
    .listen(source);

const catchEventExit = (
  hostname: string,
  shouldRemoveHostnameInHostFile: boolean
) => {
  const exitHandler = async () => {
    if (shouldRemoveHostnameInHostFile) {
      await hostfileHelper.remove(hostname);
    }
    process.exit();
  };
  //do something when app is closing
  process.on("exit", exitHandler);

  //catches ctrl+c event
  process.on("SIGINT", exitHandler);

  // catches "kill pid" (for example: nodemon restart)
  process.on("SIGUSR1", exitHandler);
  process.on("SIGUSR2", exitHandler);

  //catches uncaught exceptions
  process.on("uncaughtException", exitHandler);
};

const proxySsl = async ({
  hostname = "localhost",
  source = 443,
  target,
  shouldRemoveHostname,
  disableOpenPage,
}: Params) => {
  if (!target) {
    console.log(chalk.red("Please provide the --target param"));
    return "";
  }

  if (!isLocalhost(hostname)) {
    await hostfileHelper.set("0.0.0.0", hostname);
  }

  const { certFile, keyFile } = await createCertificate(hostname);
  console.log("Your cert file: ", certFile);
  console.log("Your key file: ", keyFile);


  createServer({
    hostname,
    source,
    target,
    keyFile,
    certFile,
  });

  const sourceUrl =
    source === 443 ? `https://${hostname}` : `https://${hostname}:${source}`;
  const targetUrl =
    target === 443 ? `https://${hostname}` : `https://${hostname}:${target}`;

  console.log(chalk.green(`Started proxy: ${sourceUrl} -> ${targetUrl}`));

  if (!disableOpenPage) {
    await exec(`open ${sourceUrl}`)
  }
  catchEventExit(hostname, shouldRemoveHostname);
};

export { proxySsl };
