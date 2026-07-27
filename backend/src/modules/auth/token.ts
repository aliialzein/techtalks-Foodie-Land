import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

/**
 * Access token used for authenticated application requests.
 */
export function createAccessToken(
  userId: string,
  email: string,
  role: string,
) {
  return jwt.sign(
    {
      id: userId,
      email,
      role,
      type: "ACCESS",
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
}


/**
 * Read and validate normal access token.
 */
export function readAccessToken(token: string) {
  const payload = jwt.verify(
    token,
    JWT_SECRET,
  ) as {
    id: string;
    email: string;
    role: "CUSTOMER" | "OWNER" | "ADMIN";
    type: "ACCESS";
  };

  if (payload.type !== "ACCESS") {
    throw new Error("Invalid access token");
  }

  return payload;
}

/**
 * Password reset token.
 *
 * This token MUST NOT be used for API authentication.
 * It only allows completing the password reset flow.
 */
export function createResetToken(
  userId: string,
) {
  return jwt.sign(
    {
      id: userId,
      type: "PASSWORD_RESET",
    },
    JWT_SECRET,
    {
      expiresIn: "5m",
    },
  );
}


/**
 * Validate password reset token.
 */
export function readResetToken(token: string) {
  const payload = jwt.verify(
    token,
    JWT_SECRET,
  ) as {
    id: string;
    type: string;
  };


  if (payload.type !== "PASSWORD_RESET") {
    throw new Error("Invalid reset token");
  }


  return payload;
}