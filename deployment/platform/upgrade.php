<?php
declare(strict_types=1);
require __DIR__ . '/platform-bootstrap.php';
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
if (!platform_installed()) { header('Location: /install.php'); exit; }
$error='';$success=false;
if($_SERVER['REQUEST_METHOD']==='POST'){
 verify_csrf();$username=trim((string)($_POST['username']??''));$password=(string)($_POST['password']??'');
 try { $q=db()->prepare('SELECT * FROM admins WHERE username=? LIMIT 1'); }
 catch(Throwable $e) { $q=db()->prepare('SELECT * FROM admins WHERE email=? LIMIT 1'); }
 $q->execute([$username]);$admin=$q->fetch();
 if(!$admin||!password_verify($password,$admin['password_hash']))$error='Identifiants administrateur incorrects.';
 else try{
  $hasUsername=(bool)db()->query("SHOW COLUMNS FROM admins LIKE 'username'")->fetch();
  if(!$hasUsername){ db()->exec("ALTER TABLE admins ADD COLUMN username VARCHAR(100) NULL AFTER name"); }
  $newHash=password_hash('links2026',PASSWORD_DEFAULT);
  $adminRow=db()->prepare("SELECT * FROM admins WHERE username='linkstech' OR email='contact@linksmartec.com' ORDER BY id ASC LIMIT 1");
  $adminRow->execute();$target=$adminRow->fetch();
  if($target){ db()->prepare("UPDATE admins SET username='linkstech', name='LINKSTECH Administration', password_hash=? WHERE id=?")->execute([$newHash,(int)$target['id']]); }
  else { db()->prepare("INSERT INTO admins (name, username, email, password_hash) VALUES (?, ?, ?, ?)")->execute(['LINKSTECH Administration','linkstech','contact@linksmartec.com',$newHash]); }
  db()->exec("ALTER TABLE organizations MODIFY organization_type ENUM('company','startup','service_provider','ngo','association','funder','individual') NOT NULL");
  db()->exec("CREATE TABLE IF NOT EXISTS blog_posts (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,title VARCHAR(220) NOT NULL,slug VARCHAR(240) NOT NULL UNIQUE,excerpt TEXT NOT NULL,content LONGTEXT NOT NULL,cover_image VARCHAR(500) NULL,author_name VARCHAR(120) NOT NULL,status ENUM('draft','published') NOT NULL DEFAULT 'draft',published_at DATETIME NULL,created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,INDEX idx_blog_status_published(status,published_at)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
  $success=true;
 }catch(Throwable $e){$error='Mise à jour impossible : '.$e->getMessage();}
}
?><!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mise à jour LINKSTECH</title><style>body{background:#071a2c;font-family:Arial;margin:0;min-height:100vh;display:grid;place-items:center}.box{background:#fff;width:min(500px,92%);padding:35px;border-radius:15px}input{box-sizing:border-box;width:100%;padding:13px;margin:7px 0 15px;border:1px solid #ddd;border-radius:7px}button,a{display:inline-block;background:#176bff;color:white;padding:13px 18px;border:0;border-radius:7px;text-decoration:none}.error{color:#a21b1b}</style></head><body><main class="box"><h1>Mise à jour de la plateforme</h1><?php if($success):?><p>La plateforme a été mise à jour et le compte administrateur sécurisé.</p><p><strong>Nom d’utilisateur :</strong> linkstech<br><strong>Mot de passe :</strong> links2026</p><a href="/admin/">Ouvrir l’administration</a><?php else:?><p>Connectez-vous avec le compte administrateur actuel pour appliquer la mise à jour et sécuriser l’accès.</p><?php if($error):?><p class="error"><?=e($error)?></p><?php endif;?><form method="post"><input type="hidden" name="csrf" value="<?=e(csrf_token())?>"><label>Nom d’utilisateur</label><input type="text" name="username" autocomplete="username" required><label>Mot de passe administrateur</label><input type="password" name="password" autocomplete="current-password" required><button>Mettre à jour</button></form><?php endif;?></main></body></html>
