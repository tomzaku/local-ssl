import util from "util";
import * as child from "child_process";

const exec = async (cmd: string) => {
  const { stdout } = await util.promisify(child.exec)(cmd);
  return stdout.split("\n").filter(Boolean);
};

export { exec };

