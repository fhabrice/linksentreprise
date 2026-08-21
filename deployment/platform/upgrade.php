<?php
declare(strict_types=1);
require __DIR__ . '/platform-bootstrap.php';
if (!platform_installed()) { header('Location: /install.php'); exit; }
$error='';$success=false;
if($_SERVER['REQUEST_METHOD']==='POST'){
 verify_csrf();$email=strtolower(trim((string)($_POST['email']??'')));$password=(string)($_POST['password']??'');
 $q=db()->prepare('SELECT * FROM admins WHERE email=? LIMIT 1');$q->execute([$email]);$admin=$q->fetch();
 if(!$admin||!password_verify($password,$admin['password_hash']))$error='Identifiants administrateur incorrects.';
 else try{
  db()->exec("ALTER TABLE organizations MODIFY organization_type ENUM('company','startup','service_provider','ngo','association','funder','individual') NOT NULL");
  db()->exec("CREATE TABLE IF NOT EXISTS blog_posts (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,title VARCHAR(220) NOT NULL,slug VARCHAR(240) NOT NULL UNIQUE,excerpt TEXT NOT NULL,content LONGTEXT NOT NULL,cover_image VARCHAR(500) NULL,author_name VARCHAR(120) NOT NULL,status ENUM('draft','published') NOT NULL DEFAULT 'draft',published_at DATETIME NULL,created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,INDEX idx_blog_status_published(status,published_at)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
  $success=true;
 }catch(Throwable $e){$error='Mise à jour impossible : '.$e->getMessage();}
}
?><!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mise à jour LINKSTECH</title><style>body{background:#071a2c;font-family:Arial;margin:0;min-height:100vh;display:grid;place-items:center}.box{background:#fff;width:min(500px,92%);padding:35px;border-radius:15px}input{box-sizing:border-box;width:100%;padding:13px;margin:7px 0 15px;border:1px solid #ddd;border-radius:7px}button,a{display:inline-block;background:#176bff;color:white;padding:13px 18px;border:0;border-radius:7px;text-decoration:none}.error{color:#a21b1b}</style></head><body><main class="box"><h1>Mise à jour de la plateforme</h1><?php if($success):?><p>La section Blog et les profils Startup sont installés.</p><a href="/admin/">Ouvrir l’administration</a><?php else:?><p>Connectez-vous avec le compte administrateur pour appliquer la mise à jour.</p><?php if($error):?><p class="error"><?=e($error)?></p><?php endif;?><form method="post"><input type="hidden" name="csrf" value="<?=e(csrf_token())?>"><label>E-mail administrateur</label><input type="email" name="email" required><label>Mot de passe administrateur</label><input type="password" name="password" required><button>Mettre à jour</button></form><?php endif;?></main></body></html>
