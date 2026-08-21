import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const attempts = new Map();
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 5;
const allowedServices = new Set([
  'Construction & Génie civil',
  'Solution informatique',
  'Étude & accompagnement',
  "Digitalisation d'entreprise",
  'Connexion aux marchés & services',
  'Connexion ONG / bailleurs de fonds',
  'Outils de suivi de projets',
  'Formation & encadrement des équipes',
  'Autre demande',
]);

function clean(value, maxLength) {
  return String(value ?? '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, maxLength);
}

function getClientIp(request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (attempts.get(ip) || []).filter(time => now - time < WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);
  return recent.length > MAX_ATTEMPTS;
}

async function saveRequest(entry) {
  const dataDirectory = path.join(process.cwd(), 'data');
  const dataFile = path.join(dataDirectory, 'contact-requests.json');
  await mkdir(dataDirectory, { recursive: true });
  let requests = [];
  try {
    requests = JSON.parse(await readFile(dataFile, 'utf8'));
    if (!Array.isArray(requests)) requests = [];
  } catch (error) {
    if (error.code !== 'ENOENT') console.error('Lecture des contacts impossible:', error);
  }
  requests.push(entry);
  await writeFile(dataFile, JSON.stringify(requests, null, 2), 'utf8');
}

export async function POST(request) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Trop de demandes. Veuillez réessayer dans une minute.' },
      { status: 429 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Données invalides.' }, { status: 400 });
  }

  const name = clean(body.name, 100);
  const phone = clean(body.phone, 40);
  const service = clean(body.service, 100);
  const message = clean(body.message, 1500);

  if (name.length < 2 || phone.length < 7 || message.length < 10) {
    return NextResponse.json(
      { error: 'Veuillez renseigner un nom, un téléphone et un message valides.' },
      { status: 422 },
    );
  }
  if (!allowedServices.has(service)) {
    return NextResponse.json({ error: 'Le service sélectionné est invalide.' }, { status: 422 });
  }

  const entry = {
    id: randomUUID(),
    name,
    phone,
    service,
    message,
    createdAt: new Date().toISOString(),
  };

  try {
    await saveRequest(entry);
  } catch (error) {
    // Certains hébergeurs serverless ont un système de fichiers en lecture seule.
    // La demande reste transmissible via WhatsApp même si l'archivage local échoue.
    console.error('Archivage du contact impossible:', error);
  }

  const whatsappNumber = process.env.WHATSAPP_NUMBER || '243976459970';
  const whatsappText = [
    `Bonjour Linkstech, je suis ${name} (${phone}).`,
    '',
    `Service : ${service}`,
    '',
    message,
  ].join('\n');

  return NextResponse.json(
    {
      success: true,
      requestId: entry.id,
      whatsappUrl: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`,
    },
    { status: 201 },
  );
}
