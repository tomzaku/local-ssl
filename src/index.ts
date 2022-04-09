import commander from "commander";
import packageJson from "../package.json";
import { installRequirements } from "./installation";
import { proxySsl } from "./ssl-proxy";


const main = async () => {
  const welcome = String.raw`
  _    ___   ___   _   _       ___ ___ _    
 | |  / _ \ / __| /_\ | |  ___/ __/ __| |   
 | |_| (_) | (__ / _ \| |_|___\__ \__ \ |__ 
 |____\___/ \___/_/ \_\____|  |___/___/____|
                                            
  `;
  console.log(welcome);
  const program = new commander.Command()
    .version(packageJson.version)
    .description("A CLI tool to enable your local ssl just a single step")
    .option("-s, --source <port>", "Source port to enable ssl")
    .option("-t, --target <port>", "Target port")
    .option("-n, --hostname <hostname>", "Hostname to certificate such as: localhost, facebook.com")
    .option("-do, --disable-open", "Disable open the page")
    .option("-rh, --remove-hostname", "Remove hostname when exist")
    .option("-i, --install", "Install requirement packages")
    .parse(process.argv);
  const { install, source, target, hostname, disableOpen, removeHostname } = program.opts();
  if(install) {
    installRequirements()
  } else {
    await proxySsl({
      target: parseInt(target),
      source: isNaN(parseInt(source)) ? 443 : parseInt(source),
      hostname,
      disableOpenPage: disableOpen,
      shouldRemoveHostname: removeHostname,
    })
  }
};

main();
