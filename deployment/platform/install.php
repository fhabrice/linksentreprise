<?php
declare(strict_types=1);
require __DIR__ . '/platform-bootstrap.php';
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

// La page d'installation est privée. Elle ne doit plus afficher de formulaire MySQL.
if (platform_installed()) {
    header('Location: /admin/');
    exit;
}

// Sans configuration (cas théorique), ne jamais exposer les champs de la base.
http_response_code(503);
?><!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>LINKSTECH</title></head><body style="margin:0;font-family:Arial,sans-serif;background:#071a2c;min-height:100vh;display:grid;place-items:center"><main style="background:#fff;border-radius:14px;padding:36px;width:min(420px,92%);text-align:center"><h1 style="margin:0 0 10px;color:#071a2c">LINKSTECH</h1><p style="color:#60707f;line-height:1.6">La plateforme nécessite une configuration technique. Contactez votre administrateur.</p><a style="display:inline-block;margin-top:16px;background:#176bff;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:700" href="/admin/">Ouvrir l’espace administrateur</a></main></body></html>
