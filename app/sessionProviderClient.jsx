"use client"

import "bootstrap/dist/js/bootstrap"
import { SessionProvider } from "next-auth/react"


export default function SessionProviderClient({ children }) {
    return <SessionProvider>{children}</SessionProvider>
};
