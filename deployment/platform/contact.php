<?php
declare(strict_types=1);
require __DIR__ . '/platform-bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    json_response(405, ['error' => 'Méthode non autorisée.']);
}
if (!platform_installed()) {
    json_response(503, ['error' => 'La plateforme doit être installée par l’administrateur.']);
}

$raw = file_get_contents('php://input');
if ($raw === false || strlen($raw) > 20000) {
    json_response(413, ['error' => 'La demande est trop volumineuse.']);
}
$data = json_decode($raw, true);
if (!is_array($data)) {
    json_response(400, ['error' => 'Données invalides.']);
}

$name = clean_text($data['name'] ?? '', 100);
$phone = clean_text($data['phone'] ?? '', 40);
$service = clean_text($data['service'] ?? '', 120);
$message = clean_text($data['message'] ?? '', 1500);
$allowed = [
    'Construction & Génie civil', 'Solution informatique', 'Étude & accompagnement',
    "Digitalisation d'entreprise", 'Connexion aux marchés & services',
    'Connexion ONG / bailleurs de fonds', 'Outils de suivi de projets',
    'Formation & encadrement des équipes', 'Création d’entreprise technique / startup', 'Autre demande',
];
if (mb_strlen($name) < 2 || mb_strlen($phone) < 7 || mb_strlen($message) < 10) {
    json_response(422, ['error' => 'Veuillez renseigner un nom, un téléphone et un message valides.']);
}
if (!in_array($service, $allowed, true)) {
    json_response(422, ['error' => 'Le service sélectionné est invalide.']);
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateFile = sys_get_temp_dir() . '/linkstech-rate-' . hash('sha256', $ip) . '.json';
$now = time();
$attempts = is_file($rateFile) ? (json_decode((string) file_get_contents($rateFile), true) ?: []) : [];
$attempts = array_values(array_filter($attempts, static fn ($time) => is_int($time) && $now - $time < 60));
if (count($attempts) >= 5) {
    json_response(429, ['error' => 'Trop de demandes. Veuillez réessayer dans une minute.']);
}
$attempts[] = $now;
@file_put_contents($rateFile, json_encode($attempts), LOCK_EX);

$reference = strtoupper(bin2hex(random_bytes(6)));
$statement = db()->prepare('INSERT INTO contact_requests (reference_code, name, phone, service, message) VALUES (?, ?, ?, ?, ?)');
$statement->execute([$reference, $name, $phone, $service, $message]);

$config = platform_config();
$emailBody = "Nouvelle demande LINKSTECH\nRéférence : {$reference}\nNom : {$name}\nTéléphone : {$phone}\nService : {$service}\n\n{$message}";
@mail($config['contact_email'], 'Nouvelle demande LINKSTECH — ' . $reference, $emailBody, [
    'From' => 'Site LINKSTECH <noreply@linksmartec.com>',
    'Content-Type' => 'text/plain; charset=UTF-8',
]);
$whatsappText = "Bonjour Linkstech, je suis {$name} ({$phone}).\n\nService : {$service}\n\n{$message}\n\nRéférence : {$reference}";
json_response(201, [
    'success' => true,
    'requestId' => $reference,
    'whatsappUrl' => 'https://wa.me/' . $config['whatsapp_number'] . '?text=' . rawurlencode($whatsappText),
]);
