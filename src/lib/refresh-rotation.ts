import { decryptValue, encryptValue, type EncryptedValue } from "@/lib/crypto";
import { OAuthTokenError } from "@/lib/oauth-error";
import type { TokenResponse } from "@/lib/oidc-types";

export type LockedRefreshRecord = EncryptedValue & { tokenVersion: number };
export type RefreshTransaction = (work: (record: LockedRefreshRecord, replace: (value: EncryptedValue) => Promise<void>, requireAuthorization: () => Promise<void>) => Promise<TokenResponse>) => Promise<TokenResponse>;

export async function rotateRefreshToken(transaction: RefreshTransaction, refresh: (token: string) => Promise<TokenResponse>, key: Buffer) {
  let invalidGrant = false;
  const result = await transaction(async (record, replace, requireAuthorization) => {
    try {
      const tokens = await refresh(decryptValue(record, key));
      if (tokens.refreshToken) await replace(encryptValue(tokens.refreshToken, key));
      return tokens;
    } catch (error) {
      if (error instanceof OAuthTokenError && error.code === "invalid_grant") {
        await requireAuthorization();
        invalidGrant = true;
        return { accessToken: "", expiresIn: 0 };
      }
      throw error;
    }
  });
  if (invalidGrant) throw new OAuthTokenError("invalid_grant");
  return result;
}
