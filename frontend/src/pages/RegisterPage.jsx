import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Input } from "ui/input";
import { Button } from "ui/button";
import bgImage from "@/assets/pittura-di-lascaux-orig.png"; 

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");
        
        try {
            // Verifica che le password corrispondano
            if (formData.password !== formData.confirmPassword) {
                setError("Le password non corrispondono");
                setIsSubmitting(false);
                return;
            }
            
            const response = await register(formData.username, formData.email, formData.password);
            
            if (response) {
                setSuccess(true);
                setSuccessMessage("Registrazione completata! Controlla la tua email per verificare il tuo account.");
                // Non facciamo il redirect automatico per permettere all'utente di leggere il messaggio
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
                    {/* Logo */}
                    <span className="flex items-center text-2xl font-semibold">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mr-2">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
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

                {/* Mostra messaggio di successo */}
                {success && (
                    <div className="bg-green-500 bg-opacity-10 border border-green-500 text-green-500 px-4 py-3 rounded mb-4">
                        {successMessage}
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
                        {isSubmitting ? "Registrazione in corso..." : "Registrati"}
                    </Button>

                    <div className="text-center text-sm text-gray-400">
                        Hai già un account?{" "}
                        <Link to="/login" className="text-white hover:underline">
                            Accedi
                        </Link>
                    </div>
                </form>
            </div>

            {/* Lato destro - immagine */}
            <div 
                className="w-1/2 bg-cover bg-center" 
                style={{ 
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="h-full w-full bg-black bg-opacity-40 flex items-center justify-center p-12">
                    <div className="text-white max-w-md">
                        <h1 className="text-4xl font-bold mb-4">Scopri l'arte intorno a te</h1>
                        <p className="text-xl">
                            MUSA ti aiuta a trovare opere d'arte, musei, gallerie ed eventi culturali vicino a te.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
