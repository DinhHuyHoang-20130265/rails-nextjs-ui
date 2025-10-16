import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";
import SWRProvider from "@/components/SWRProvider";
import AuthGuard from "@/components/AuthGuard";
import { RouterProvider } from "@/components/RouterProvider";

export const metadata: Metadata = {
  title: "Tweet UI",
  description: "Twitter-like application built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body>
        <SWRProvider>
          <AppProvider>
            <RouterProvider>
              <AuthGuard>
                <div className="d-flex flex-column align-items-center bg-background h-100">
                  {children}
                </div>
              </AuthGuard>
            </RouterProvider>
          </AppProvider>
        </SWRProvider>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" />
      </body>
    </html>
  );
}
