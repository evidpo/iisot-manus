"use client";

import './globals.css'; // Добавьте эту строку в самое начало
import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { AuthProvider } from '../lib/auth';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <title>Ассистент по охране труда</title>
        <meta name="description" content="ИИ-ассистент по охране труда для специалистов, руководителей, HR и сотрудников предприятий" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
