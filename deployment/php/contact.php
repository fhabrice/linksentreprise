<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function respond(int $status, array $payload): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, ['error' => 'Méthode non autorisée.']);
}

$raw = file_get_contents('php://input');
if ($raw === false || strlen($raw) > 20000) {
    respond(413, ['error' => 'La demande est trop volumineuse.']);
}

$data = json_decode($raw, true);
if (!is_array($data)) {
    respond(400, ['error' => 'Données invalides.']);
}

function clean(mixed $value, int $maxLength): string
{
    $text = trim((string) ($value ?? ''));
    $text = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', ' ', $text) ?? '';
    return mb_substr($text, 0, $maxLength);
}

// Champ invisible pouvant être ajouté ultérieurement au formulaire comme piège anti-robot.
if (clean($data['website'] ?? '', 100) !== '') {
    respond(201, ['success' => true]);
}

$name = clean($data['name'] ?? '', 100);
$phone = clean($data['phone'] ?? '', 40);
$service = clean($data['service'] ?? '', 100);
$message = clean($data['message'] ?? '', 1500);

$allowedServices = [
    'Construction & Génie civil',
    'Solution informatique',
    'Étude & accompagnement',
    "Digitalisation d'entreprise",
    'Connexion aux marchés & services',
    'Autre demande',
];

if (mb_strlen($name) < 2 || mb_strlen($phone) < 7 || mb_strlen($message) < 10) {
    respond(422, ['error' => 'Veuillez renseigner un nom, un téléphone et un message valides.']);
}
if (!in_array($service, $allowedServices, true)) {
    respond(422, ['error' => 'Le service sélectionné est invalide.']);
}

// Limitation simple : cinq demandes par adresse IP et par minute.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateFile = sys_get_temp_dir() . '/linkstech-rate-' . hash('sha256', $ip) . '.json';
$now = time();
$attempts = [];
if (is_file($rateFile)) {
    $stored = json_decode((string) file_get_contents($rateFile), true);
    if (is_array($stored)) {
        $attempts = array_values(array_filter($stored, static fn ($time) => is_int($time) && $now - $time < 60));
    }
}
if (count($attempts) >= 5) {
    respond(429, ['error' => 'Trop de demandes. Veuillez réessayer dans une minute.']);
}
$attempts[] = $now;
@file_put_contents($rateFile, json_encode($attempts), LOCK_EX);

$requestId = bin2hex(random_bytes(8));
$createdAt = gmdate('c');
$record = [
    'id' => $requestId,
    'name' => $name,
    'phone' => $phone,
    'service' => $service,
    'message' => $message,
    'createdAt' => $createdAt,
];

// Archivage local protégé dans un dossier masqué.
$privateDirectory = __DIR__ . '/.private';
if (!is_dir($privateDirectory)) {
    @mkdir($privateDirectory, 0750, true);
    @file_put_contents($privateDirectory . '/.htaccess', "Require all denied\nDeny from all\n");
}
@file_put_contents(
    $privateDirectory . '/contact-requests.log',
    json_encode($record, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . PHP_EOL,
    FILE_APPEND | LOCK_EX
);

$emailBody = "Nouvelle demande LINKSTECH\n\n"
    . "Référence : {$requestId}\n"
    . "Nom : {$name}\n"
    . "Téléphone : {$phone}\n"
    . "Service : {$service}\n\n"
    . "Message :\n{$message}\n";

$emailSent = @mail(
    'contact@linksmartec.com',
    'Nouvelle demande depuis linksmartec.com',
    $emailBody,
    [
        'From' => 'Site LINKSTECH <noreply@linksmartec.com>',
        'Content-Type' => 'text/plain; charset=UTF-8',
        'X-Mailer' => 'PHP/' . PHP_VERSION,
    ]
);

$whatsappText = "Bonjour Linkstech, je suis {$name} ({$phone}).\n\n"
    . "Service : {$service}\n\n{$message}";

respond(201, [
    'success' => true,
    'requestId' => $requestId,
    'emailSent' => $emailSent,
    'whatsappUrl' => 'https://wa.me/243976459970?text=' . rawurlencode($whatsappText),
]);
