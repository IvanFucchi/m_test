// src/components/shad-ui/login-01/page.jsx
import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "ui/card";
import { Input } from "ui/input";
import { Button } from "ui/button";
import { cn } from "@/lib/utils";
import bgImage from "@/assets/1caverna_chauvet_.png"; 

export default function Login01Page() {
    return (
        <div className="flex min-h-screen">
            {/* Lato sinistro - form di login */}
            <div className="w-1/2 bg-black text-white flex flex-col justify-center px-8">
                <div className="mb-8">
                    {/* Logo (può essere un SVG o un componente Icon) */}
                    <span className="flex items-center text-2xl font-semibold">
                        <svg /* …icona SVG… */ className="h-6 w-6 mr-2" />
                        MUSA ~ Discover Art
                    </span>
                </div>
                <h2 className="text-2xl font-bold mb-2">Login to your account</h2>
                <p className="text-sm text-gray-400 mb-6">
                    Enter your email below to login to your account
                </p>
                {/* Form */}
                <div className="space-y-4 w-full max-w-sm">
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-sm font-medium mb-1">
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            className="bg-gray-800 text-white border-gray-700"
                        />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="password" className="text-sm font-medium">
                                Password
                            </label>
                            <a href="/forgot" className="text-xs text-gray-400 hover:text-gray-300">
                                Forgot your password?
                            </a>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="bg-gray-800 text-white border-gray-700"
                        />
                    </div>
                    <Button className="w-full bg-white text-black hover:bg-gray-200">
                        Login
                    </Button>
                    <div className="relative flex items-center">
                        <div className="flex-grow border-t border-gray-600" />
                        <span className="mx-3 text-xs text-gray-400 uppercase">Or continue with</span>
                        <div className="flex-grow border-t border-gray-600" />
                    </div>
                    <Button variant="outline" className="w-full text-white border-gray-600 hover:border-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path
                                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                fill="currentColor"
                            />
                        </svg>
                        Login with Google
                    </Button>
                    <p className="text-xs text-gray-400 text-center">
                        Don&apos;t have an account?{" "}
                        <a href="/register" className="underline text-white hover:text-gray-300">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>

            
            <div className="w-1/2 bg-gray-800">
                <img
                    src={bgImage}
                    alt="Illustrazione login"
                    className="w-full h-full object-cover"
                /></div>
        </div>
    );
}
