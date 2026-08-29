<?php
declare(strict_types=1);
require __DIR__ . '/platform-bootstrap.php';

$alreadyInstalled = platform_installed();
$error = '';
$success = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$alreadyInstalled) {
    verify_csrf();
    $host = clean_text($_POST['db_host'] ?? 'localhost', 190);
    $database = clean_text($_POST['db_name'] ?? '', 190);
    $user = clean_text($_POST['db_user'] ?? '', 190);
    $password = (string) ($_POST['db_password'] ?? '');
    $adminUsername = 'linkstech';
    $adminPassword = '091989';
    $adminEmail = 'contact@linksmartec.com';

    if (!$database || !$user) {
        $error = 'Renseignez la base de données et l’utilisateur MySQL.';
    } else {
        try {
            $pdo = new PDO(
                "mysql:host={$host};dbname={$database};charset=utf8mb4",
                $user,
                $password,
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false]
            );
            $schema = (string) file_get_contents(__DIR__ . '/schema.sql');
            foreach (array_filter(array_map('trim', preg_split('/;\s*(?:\r?\n|$)/', $schema) ?: [])) as $statement) {
                $pdo->exec($statement);
            }
            $statement = $pdo->prepare('INSERT INTO admins (name, username, email, password_hash) VALUES (?, ?, ?, ?)');
            $statement->execute(['LINKSTECH Administration', $adminUsername, $adminEmail, password_hash($adminPassword, PASSWORD_DEFAULT)]);

            $config = [
                'database' => ['host' => $host, 'name' => $database, 'user' => $user, 'password' => $password],
                'contact_email' => 'contact@linksmartec.com',
                'whatsapp_number' => '243976459970',
            ];
            $content = "<?php\n// Généré automatiquement par l’installation LINKSTECH.\nreturn "
                . var_export($config, true) . ";\n";
            if (file_put_contents(LINKSTECH_CONFIG_FILE, $content, LOCK_EX) === false) {
                throw new RuntimeException('Impossible d’écrire le fichier de configuration. Vérifiez les permissions du dossier.');
            }
            $success = true;
        } catch (Throwable $exception) {
            $error = 'Installation impossible : ' . $exception->getMessage();
        }
    }
}
?>
<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Installation — LINKSTECH</title><style>
*{box-sizing:border-box}body{margin:0;background:#071a2c;color:#0c1c2a;font-family:Arial,sans-serif;min-height:100vh;display:grid;place-items:center;padding:30px}.card{width:min(680px,100%);background:#fff;border-radius:18px;padding:36px;box-shadow:0 25px 70px #0005}h1{margin:0 0 8px;color:#071a2c}p{color:#60707f;line-height:1.6}.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.field{margin:14px 0}.field.full{grid-column:1/-1}label{display:block;font-size:13px;font-weight:700;margin-bottom:7px}input{width:100%;padding:13px;border:1px solid #dfe6eb;border-radius:8px}button,.button{display:inline-block;border:0;border-radius:8px;background:#176bff;color:white;padding:14px 20px;font-weight:700;text-decoration:none;cursor:pointer}.error{background:#fff0f0;color:#a21b1b;padding:12px;border-radius:8px}.ok{background:#edf9f1;color:#176b3a;padding:18px;border-radius:9px}@media(max-width:600px){.grid{grid-template-columns:1fr}.field.full{grid-column:auto}.card{padding:24px}}
</style></head><body><main class="card"><h1>Installation LINKSTECH</h1><p>Connectez la plateforme à la base MySQL créée dans cPanel.</p><p><strong>Accès administrateur</strong><br>Code d’accès : <code>091989</code></p>
<?php if ($alreadyInstalled || $success): ?><div class="ok"><strong>La plateforme est installée.</strong><p>Pour des raisons de sécurité, cette page ne peut plus relancer l’installation.</p><a class="button" href="/admin/">Ouvrir l’espace administrateur</a></div>
<?php else: ?><?php if ($error): ?><div class="error"><?= e($error) ?></div><?php endif; ?><form method="post"><input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>"><div class="grid"><div class="field full"><label>Hôte MySQL</label><input name="db_host" value="<?= e($_POST['db_host'] ?? 'localhost') ?>" required></div><div class="field"><label>Nom de la base</label><input name="db_name" value="<?= e($_POST['db_name'] ?? '') ?>" required></div><div class="field"><label>Utilisateur MySQL</label><input name="db_user" value="<?= e($_POST['db_user'] ?? '') ?>" required></div><div class="field full"><label>Mot de passe MySQL</label><input type="password" name="db_password" required></div></div><button type="submit">Installer la plateforme</button></form><?php endif; ?></main></body></html>
