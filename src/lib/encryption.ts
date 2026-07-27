import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const SECRET_KEY = process.env.ENCRYPTION_SECRET || "prism_secure_vault_secret_32bytes_key!!";

// Ensure 32 bytes key length
const getKey = (): Buffer => {
  return crypto.createHash("sha256").update(SECRET_KEY).digest();
};

export function encrypt(text: string): string {
  if (!text) return "";
  const iv = crypto.randomBytes(12);
  const key = getKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  if (!encryptedText) return "";
  try {
    const parts = encryptedText.split(":");
    if (parts.length !== 3) return "";
    
    const iv = Buffer.from(parts[0], "hex");
    const authTag = Buffer.from(parts[1], "hex");
    const encrypted = parts[2];
    const key = getKey();
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    return "";
  }
}
