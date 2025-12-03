import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: studentId } = await context.params;
  const formData = await req.formData();
  // Get the access token from cookies (NextAuth or custom auth)
  const token = req.cookies.get('authToken')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${BACKEND_URL}/students/${studentId}/projects`, {
    method: 'POST',
    body: formData,
    headers, // forward the auth header
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { error: text };
  }
  return NextResponse.json(data, { status: res.status });
} 