'use client';
import { useState } from 'react';
import Image from 'next/image';

export const OrbitalFlowLogo = ({ isDark }: { isDark: boolean }) => {
    const [imageError, setImageError] = useState(false);

    return (
        <div className="flex items-center gap-3">
            <div className="relative w-8 h-8">
                {!imageError ? (
                    <Image
                        src="/icons/orbital-flow-logo.png"
                        alt="Orbital Flow Logo"
                        width={32}
                        height={32}
                        className="rounded-lg"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <>
                        <div className="absolute inset-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 via-pink-500 to-rose-500 animate-pulse"></div>
                        <div
                            className="absolute inset-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 via-pink-500 to-rose-500 animate-spin opacity-50"
                            style={{ animationDuration: '3s' }}
                        ></div>
                    </>
                )}
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                Orbital Flow
            </h1>
        </div>
    );
};
