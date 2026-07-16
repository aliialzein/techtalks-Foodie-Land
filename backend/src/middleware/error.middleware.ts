import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@/generated/prisma/runtime/library";

import { NextResponse } from "next/server";


export function handlePrismaError(error: unknown) {

  if (error instanceof PrismaClientKnownRequestError) {

    switch (error.code) {

      // Unique constraint
      case "P2002":
        return NextResponse.json(
          {
            success: false,
            message: "A record with this value already exists",
            field: error.meta?.target,
          },
          {
            status: 409,
          }
        );


      // Record not found
      case "P2025":
        return NextResponse.json(
          {
            success: false,
            message: "Requested resource was not found",
          },
          {
            status: 404,
          }
        );

        case "P2014":
        return NextResponse.json(
        {
        success:false,
        message:"Cannot delete resource because related data exists"
        },
        {
        status:400
        }
        );
        
      // Foreign key
      case "P2003":
        return NextResponse.json(
          {
            success: false,
            message: "Invalid relationship reference",
          },
          {
            status: 400,
          }
        );


      default:
        return NextResponse.json(
          {
            success: false,
            message: "Database error",
          },
          {
            status: 500,
          }
        );
    }
  }


  if (error instanceof PrismaClientValidationError) {
    return NextResponse.json(
      {
        success:false,
        message:"Invalid database request",
      },
      {
        status:400,
      }
    );
  }


  return null;
}