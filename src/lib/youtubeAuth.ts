import { OAuth2Client } from "google-auth-library";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET || "";
const REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI || "";

export const oauth2Client = new OAuth2Client(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

export function generateAuthUrl() {
  const scopes = [
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/youtube.force-ssl",
  ];
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });
}

export async function getTokens(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export function setCredentials(tokens: any) {
  oauth2Client.setCredentials(tokens);
}

export default oauth2Client;