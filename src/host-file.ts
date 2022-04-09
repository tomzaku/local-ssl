import { exec } from './util'
import path from 'path'

const hostileFile = path.join(__dirname,`/../node_modules/.bin/hostile`)

export const checkIsHostnameExist = async (hostname: string) => {
  try {
    const result = await exec(`cat /etc/hosts | grep ${hostname}`)
    return Boolean(result)
  } catch(err) {
    return false
  }
}

export const set = async (ip: string, hostname: string) => {
  const isHostnameExist = await checkIsHostnameExist(hostname)
  if(!isHostnameExist) {
    console.log(`Adding ${hostname} in host file and it might require your root privileges`)
    await exec(`sudo ${hostileFile} set ${ip} ${hostname}`)
  }
} 

export const remove = async (hostname: string) => {
  const isHostnameExist = await checkIsHostnameExist(hostname)
  if(isHostnameExist) {
    console.log(`Removing ${hostname} in host file and it might require your root privileges`)
    await exec(`sudo ${hostileFile} remove ${hostname}`)
  }
}
