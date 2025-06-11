"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "flowbite-react"
import { Eye, EyeOff } from "lucide-react"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"

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

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
})

type FormData = z.infer<typeof formSchema>

export function Login() {
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  })

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: true,
        callbackUrl: "/dashboard",
      })
    } catch (error) {
      console.error(error)
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
          Log In
        </h2>
        {loading && (
          <div className="p-3 w-full flex justify-center items-center gap-2">
            <Spinner size="md" color="info" />
            Signing in
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <Button
              disabled={loading}
              type="submit"
              className="w-full rounded-full bg-primary py-2 text-white transition-colors hover:bg-primary-hover"
            >
              Log In
            </Button>
          </form>
        </Form>
        <GoogleAuthButton
          disabled={loading}
          title="Signin with google"
          onClick={handleGoogleSignIn}
        />
        <p className="mt-4 text-center text-sm text-gray-600">
          Don&#39;t have an account?{" "}
          <Link href="/auth/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
