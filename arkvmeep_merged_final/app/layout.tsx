import "@/styles/app.sass";
import { headers } from "next/headers";
import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";

const rubik = Rubik({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
    display: "block",
    variable: "--font-rubik",
});

export const metadata: Metadata = {
    title: "Bento Cards: SimpleList",
    description: "Minimal to-do list app UI design kit + landing page",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                {/* Description no longer than 155 characters */}
                <meta name="description" content="Bento Cards: SimpleList" />
                {/* Product Name */}
                <meta name="product-name" content="Bento Cards: SimpleList" />
                {/* Twitter Card data */}
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:site" content="@ui8" />
                <meta name="twitter:title" content="Bento Cards: SimpleList" />
                <meta
                    name="twitter:description"
                    content="Minimal to-do list app UI design kit + landing page"
                />
                <meta name="twitter:creator" content="@ui8" />
                {/* Twitter Summary card images must be at least 120x120px */}
                <meta
                    name="twitter:image"
                    content="%PUBLIC_URL%/twitter-card.png"
                />

                {/* Open Graph data for Facebook */}
                <meta property="og:title" content="Bento Cards: SimpleList" />
                <meta property="og:type" content="Article" />
                <meta
                    property="og:url"
                    content="https://ui8.net/ui8/products/bento-cards-simplelist"
                />
                <meta
                    property="og:image"
                    content="%PUBLIC_URL%/fb-og-image.png"
                />
                <meta
                    property="og:description"
                    content="Minimal to-do list app UI design kit + landing page"
                />
                <meta
                    property="og:site_name"
                    content="Bento Cards: SimpleList"
                />
                <meta property="fb:admins" content="132951670226590" />

                {/* Open Graph data for LinkedIn */}
                <meta property="og:title" content="Bento Cards: SimpleList" />
                <meta
                    property="og:url"
                    content="https://ui8.net/ui8/products/bento-cards-simplelist"
                />
                <meta
                    property="og:image"
                    content="%PUBLIC_URL%/linkedin-og-image.png"
                />
                <meta
                    property="og:description"
                    content="Minimal to-do list app UI design kit + landing page"
                />

                {/* Open Graph data for Pinterest */}
                <meta property="og:title" content="Bento Cards: SimpleList" />
                <meta
                    property="og:url"
                    content="https://ui8.net/ui8/products/bento-cards-simplelist"
                />
                <meta
                    property="og:image"
                    content="%PUBLIC_URL%/pinterest-og-image.png"
                />
                <meta
                    property="og:description"
                    content="Minimal to-do list app UI design kit + landing page"
                />
            </head>
            <body className={rubik.className}>{children}</body>
        </html>
    );
}

export async function generateViewport(): Promise<Viewport> {
    const userAgent = headers().get("user-agent");
    const isiPhone = /iphone/i.test(userAgent ?? "");
    return isiPhone
        ? {
              width: "device-width",
              initialScale: 1,
              maximumScale: 1, // disables auto-zoom on ios safari
          }
        : {};
}
