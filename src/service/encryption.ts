import crypto from "crypto";
import { random, secret } from "@/config/envConfig";

const algorithm = "aes-256-cbc";
const secretKey = crypto
  .createHash("sha256")
  .update(String(secret()))
  .digest("base64")
  .substring(0, 32); 

// --- Utility to make base64 URL-safe ---
function base64UrlEncode(buffer: Buffer): string {
  return buffer.toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(str: string): Buffer {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4 !== 0) str += "=";
  return Buffer.from(str, "base64");
}

// 🔐 Encrypt: Safe for URLs
export function encrypt(text: string | number): string {
  const iv = crypto.randomBytes(16); 
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([
    cipher.update(String(text), "utf8"),
    cipher.final(),
  ]);
  return `${base64UrlEncode(iv)}.${base64UrlEncode(encrypted)}`;
}

// 🔓 Decrypt: From encrypted string used in URL
export function decrypt(encryptedText: string | number): string {
  const [ivStr, encryptedStr] = String(encryptedText).split(".");
  if (!ivStr || !encryptedStr) throw new Error("Invalid encrypted string");

  const iv = base64UrlDecode(ivStr);
  const encrypted = base64UrlDecode(encryptedStr);

  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
