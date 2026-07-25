"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";

import { saveSession } from "@/lib/auth";
import { redirectAfterLogin } from "@/lib/redirects";


interface GoogleButtonProps {
  onError?: (message: string) => void;
}


export default function GoogleButton({
  onError,
}: GoogleButtonProps) {

  const router = useRouter();


  async function handleGoogleSuccess(
    credentialResponse: {
      credential?: string;
    }
  ) {

    try {

      if (!credentialResponse.credential) {
        throw new Error(
          "Google authentication failed"
        );
      }


      const res = await fetch(
        "/api/auth/google",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            credential:
              credentialResponse.credential,
          }),
        }
      );


      const data = await res.json();


      if (!res.ok) {
        throw new Error(
          data.message ??
          "Google login failed"
        );
      }


      saveSession(data);

      redirectAfterLogin(
        router,
        data.user
      );


    } catch (error) {

      onError?.(
        error instanceof Error
          ? error.message
          : "Google login failed"
      );

    }

  }



  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() =>
          onError?.(
            "Google authentication failed"
          )
        }
        width="100%"
      />
    </div>
  );
}