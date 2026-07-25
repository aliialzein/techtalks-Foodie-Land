import { OAuth2Client } from "google-auth-library";

const googleClientId = process.env.GOOGLE_CLIENT_ID;

if (!googleClientId) {
  throw new Error(
    "GOOGLE_CLIENT_ID is missing"
  );
}

const client = new OAuth2Client(googleClientId);

export async function verifyGoogleToken(token: string) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: googleClientId,
  });

  const payload = ticket.getPayload();

  if (!payload || !payload.email) {
    throw new Error("Invalid Google token");
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name ?? "",
    picture: payload.picture,
    emailVerified: payload.email_verified,
  };
}