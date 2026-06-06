import { NextResponse } from "next/server";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

const prisma = new PrismaClient();

const registerSchema = z.object({
  role: z.string(),
  name: z.string(),
  email: z.string().email(),
  mobile: z.string(),
  password: z.string().min(8),
  outletName: z.string(),
  outletAddress: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  pincode: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    const {
      role,
      name,
      email,
      mobile,
      password,
      outletName,
      outletAddress,
      city,
      state,
      country,
      pincode,
    } = validatedData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const fullAddress = `${outletAddress}, ${city}, ${state}, ${country} - ${pincode}`;

    // Validate the role against Prisma enum
    if (!(role in Role)) {
       return NextResponse.json(
        { message: "Invalid role selected" },
        { status: 400 }
      );
    }

    // Use a transaction to create outlet and user
    const user = await prisma.$transaction(async (tx) => {
      const outlet = await tx.outlet.create({
        data: {
          name: outletName,
          location: fullAddress,
        },
      });

      const isApproved = role === "OWNER" || role === "SUPER_ADMIN";

      const createdUser = await tx.user.create({
        data: {
          name,
          email,
          phone: mobile,
          password: hashedPassword,
          role: role as Role,
          outlets: {
            connect: { id: outlet.id },
          },
        },
      });

      if (isApproved) {
        await tx.$executeRaw`UPDATE "User" SET "isApproved" = true WHERE id = ${createdUser.id}`;
      }

      return createdUser;
    });

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input data", errors: error.errors }, { status: 400 });
    }
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}