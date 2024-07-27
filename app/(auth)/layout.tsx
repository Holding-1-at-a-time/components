import Image from "next/image";
import React from "react";
import "@/globals.css"
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className="relative h-screen w-full">
			<div className="absolute size-full">                    
			</div>
			{children}
		</main>
	);
}