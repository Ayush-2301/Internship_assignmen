import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().min(1, "Please enter your email").email(),
    password: z.string().min(1, "Please enter your password"),
  }),
});

export const userRegisterSchema = z.object({
  body: z.object({
    userEmail: z.string().email().min(1, "Please enter your email"),
    location: z.string(),
    userInfo: z.object({
      userName: z.string().min(1, "Please enter your name"),
      userAvatarUrl: z.string().optional(),
    }),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
});

export const dealershipRegisterSchema = z.object({
  body: z.object({
    dealershipEmail: z.string().email().min(1, "Please enter your email"),
    dealershipLocation: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    dealershipInfo: z.object({
      dealershipName: z.string().min(1, "Please enter your name"),
      dealershipAvatarUrl: z.string().optional(),
    }),
  }),
});

export const checkEmailSchema = z.object({
  body: z.object({
    email: z.string().min(1, "Please enter your email").email(),
  }),
});

export const sendEmailSchema = z.object({
  body: z.object({
    email: z.string().min(1, "Please enter your email").email(),
  }),
});

export const verifyOTPschema = z.object({
  body: z.object({
    email: z.string().min(1, "please provide email").email(),
    otp: z.string().min(6),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().min(1, "Please provide email").email(),
    newPassword: z.string().min(8),
  }),
});
