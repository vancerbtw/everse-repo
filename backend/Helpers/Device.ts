import pg from "../Database/pg";
import { encrypt } from "./Pbkdf2";

export async function getUser(udid: string, model: string) {
  const hash = await encrypt(udid, model);

  try {
    return await pg("devices").select().innerJoin("accounts", "devices.user_id", "accounts.id").where({ hash }).first();
  } catch {
    return undefined;
  }
}

export async function getDevices(userID: number) {
  try {
    return await pg("devices").select().where({ user_id: userID });
  } catch {
    return undefined;
  }
}

export async function addDevice(device: { udid: string, model: string}, user_id: number) {
  const hash = await encrypt(device.udid, device.model);
  try {
    await pg("devices").insert({
      hash,
      model: device.model,
      user_id
    });
    return true;
  } catch(e) {
    console.log(e)
    return false;
  }
}

export async function removeDevice(deviceID: number) {
  try {
    await pg("devices").where({ device_id: deviceID }).del();
    return true;
  } catch {
    return false;
  }
}

export async function removeUserDevices(userID: number) {
  try {
    await pg("devices").where({ user_id: userID }).del();
    return true;
  } catch {
    return false;
  }
}