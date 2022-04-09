import { exec } from './util'
import prompts from "prompts";

export const installRequirements = async () => {
  console.log("Installing mkcert... ")
  await exec("brew install mkcert")

  const {hasFirefox} = await prompts({
    type: 'toggle',
    value: 'hasFirefox',
    message: 'Are you using firefox?',
    initial: false,
    active: 'yes',
    inactive: 'no'
  })

  console.log("Installing nss...")
  if (hasFirefox) {
    await exec("brew install nss")
  }
  await exec('mkcert -install')
}
