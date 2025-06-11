"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "flowbite-react"
import { Eye, EyeOff } from "lucide-react"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { signupUser } from "@/lib/auth"

import { Button } from "../ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { GoogleAuthButton } from "./google-auth-button"

const formSchema = z
  .object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type FormData = z.infer<typeof formSchema>

export function Signup() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  })

  const onSubmit = async (data: FormData) => {
    // Handle signup logic here
    try {
      // 1. Register the user with your API
      await signupUser(data.email, data.password)

      // 2. Sign in the user automatically after signup
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: true,
        callbackUrl: "/dashboard",
      })
    } catch (err: any) {
      // Parse error message if it's in JSON format
      if (err.message) {
        try {
          const errorObj = JSON.parse(err.message)
          if (errorObj.detail) {
            setError(errorObj.detail)
          } else {
            setError(err.message || "Failed to sign up")
          }
        } catch (parseError) {
          // If it's not valid JSON, use the original error message
          setError(err.message || "Failed to sign up")
        }
      } else {
        setError("Failed to sign up")
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    try {
      setLoading(true)
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (error: any) {
      console.error(error)
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-light">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
          Sign Up
        </h2>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-center">Error: {error}</p>
          </div>
        )}
        {loading && (
          <div className="p-3 w-full flex justify-center items-center gap-2">
            <Spinner size="md" color="info" />
            Signing in
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="*******"
                        {...field}
                        type={showPassword ? "text" : "password"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                      >
                        {showPassword ? (
                          <EyeOff className="size-5" />
                        ) : (
                          <Eye className="size-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="*******"
                      {...field}
                      type={showPassword ? "text" : "password"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full rounded-full bg-primary py-2 text-white transition-colors hover:bg-primary-hover"
              disabled={loading}
            >
              Sign Up
            </Button>
          </form>
        </Form>
        <GoogleAuthButton
          disabled={loading}
          title="Sign up with google"
          onClick={handleGoogleSignIn}
        />
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
