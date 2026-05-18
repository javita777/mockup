"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Coffee } from "lucide-react";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const result = await auth.login(username, password);

        if (result.success) {
            router.push("/dashboard");
        } else {
            setError(result.error || "Error de inicio de sesión");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 text-foreground">
            <Card className="w-full max-w-md shadow-lg border-primary/10">
                <CardHeader className="space-y-3 text-center pb-6">
                    <div className="flex justify-center mb-2">
                        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary shadow-sm">
                            <Coffee className="w-8 h-8 text-primary-foreground" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Iniciar Sesión</CardTitle>
                    <CardDescription className="text-base">
                        Ingresa tus credenciales para administrar tu cafetería
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md border border-destructive/20 text-center font-medium">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="username">Usuario</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="vibratos"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-11"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-11 text-base font-medium mt-2"
                            disabled={loading}
                        >
                            {loading ? "Cargando..." : "Ingresar"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col border-t bg-muted/30 px-6 py-4">
                    <div className="text-sm text-muted-foreground text-center">
                        Usuarios de prueba MVP: <br />
                        <span className="font-medium text-foreground">vibratos</span>,
                        <span className="font-medium text-foreground ml-1">cafe2</span>,
                        <span className="font-medium text-foreground ml-1">cafe3</span> <br />
                        (Pass: demo123)
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
