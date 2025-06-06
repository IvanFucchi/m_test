import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "ui/card";
import { Input } from "ui/input";
import { Button } from "ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "../context/AuthContext";

import bgImage from "@/assets/pittura-di-lascaux-orig.png";

export default function SignupPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  //reinderizza se l'utente è già autenticato
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validazione
    if (formData.password !== formData.confirmPassword) {
      setError("Le password non corrispondono");
      return;
    }

    if (formData.password.length < 6) {
      setError("La password deve essere di almeno 6 caratteri");
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await register(formData.username, formData.email, formData.password);
      if (success) {
        // La registrazione è andata a buon fine, il reindirizzamento sarà gestito dall'effetto useEffect
      }
    } catch (err) {
      setError(err.response?.data?.message || "Errore durante la registrazione");
    } finally {
      setIsSubmitting(false);
    }
  };



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


                {/* Mostra eventuali errori */}
        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}


        {/* Form di registrazione */}
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
          <div className="flex flex-col">
            <label htmlFor="username" className="text-sm font-medium mb-1">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="yourusername"
              className="bg-gray-800 text-white border-gray-700"
              value={formData.username}
              onChange={handleChange}
              required
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
              value={formData.email}
              onChange={handleChange}
              required
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
              value={formData.password}
              onChange={handleChange}
              required
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
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>


  <Button 
            type="submit" 
            className="w-full bg-white text-black hover:bg-gray-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registrazione in corso..." : "Sign up"}
          </Button>
        </form>
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
