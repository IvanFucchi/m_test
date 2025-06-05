import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "ui/card";
import { Input } from "ui/input";
import { Button } from "ui/button";
import { cn } from "@/lib/utils";

import bgImage from "@/assets/pittura-di-lascaux-orig.png"; 

export default function SignupPage() {
    return (
        <div className="flex min-h-screen">
            {/* Lato sinistro - form di registrazione */}
            <div className="w-1/2 bg-black text-white flex flex-col justify-center px-8">
                <div className="mb-8">
                    {/* Logo (può essere un SVG o un componente Icon) */}
                    <span className="flex items-center text-2xl font-semibold">
                        <svg /* …icona SVG… */ className="h-6 w-6 mr-2" />
                        MUSA ~ Discover Art
                    </span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Create a new account</h2>
        <p className="text-sm text-gray-400 mb-6">
          Enter your details to register a new account
        </p>
        {/* Form di registrazione */}
        <div className="space-y-4 w-full max-w-sm">
          <div className="flex flex-col">
            <label htmlFor="username" className="text-sm font-medium mb-1">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="yourusername"
              className="bg-gray-800 text-white border-gray-700"
            />
          </div>
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
            <label htmlFor="password" className="text-sm font-medium mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-gray-800 text-white border-gray-700"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="text-sm font-medium mb-1">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="bg-gray-800 text-white border-gray-700"
            />
          </div>
          <Button className="w-full bg-white text-black hover:bg-gray-200">
            Sign up
          </Button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="underline text-white hover:text-gray-300">
            Login
          </Link>
        </p>
      </div>

      <div className="w-1/2 bg-gray-800">
        <img
          src={bgImage}
          alt="Illustrazione login"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
