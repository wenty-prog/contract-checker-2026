// 只能在伺服器端使用
import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";

// scrypt 參數：N=16384、r=8、p=1、輸出 64 bytes（OWASP 建議的最低強度以上）
const N = 16384;
const R = 8;
const P = 1;
const KEY_LENGTH = 64;

function scryptAsync(
  password: string,
  salt: Buffer,
  keyLength: number,
  options: ScryptOptions,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keyLength, options, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey);
    });
  });
}

/** 產生加鹽雜湊，格式：scrypt$N$r$p$salt(base64)$hash(base64) */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, KEY_LENGTH, { N, r: R, p: P });
  return ["scrypt", N, R, P, salt.toString("base64"), hash.toString("base64")].join("$");
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algorithm, n, r, p, saltB64, hashB64] = stored.split("$");
  if (algorithm !== "scrypt" || !saltB64 || !hashB64) return false;

  const expected = Buffer.from(hashB64, "base64");
  const actual = await scryptAsync(password, Buffer.from(saltB64, "base64"), expected.length, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
  });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// 帳號不存在時也跑一次雜湊，讓回應時間一致，避免被用來探測哪些 email 有註冊
const DUMMY_HASH_PROMISE = hashPassword("dummy-password-for-timing");
export async function fakeVerify(password: string): Promise<void> {
  await verifyPassword(password, await DUMMY_HASH_PROMISE);
}
