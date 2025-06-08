import Permission from '../models/Permission';
import Role from '../models/Role';
import dotenv from 'dotenv';

dotenv.config();

// On suppose que mongoose est déjà connecté via index.ts

const permissions = [
  // User
  { name: 'user:canView', description: 'Voir les utilisateurs' },
  { name: 'user:canCreate', description: 'Créer un utilisateur' },
  { name: 'user:canUpdate', description: 'Modifier un utilisateur' },
  { name: 'user:canDelete', description: 'Supprimer un utilisateur' },
  // Dashboard
  { name: 'dashboard:canView', description: 'Voir les dashboards' },
  { name: 'dashboard:canCreate', description: 'Créer un dashboard' },
  { name: 'dashboard:canUpdate', description: 'Modifier un dashboard' },
  { name: 'dashboard:canDelete', description: 'Supprimer un dashboard' },
  // Widget
  { name: 'widget:canView', description: 'Voir les widgets' },
  { name: 'widget:canCreate', description: 'Créer un widget' },
  { name: 'widget:canUpdate', description: 'Modifier un widget' },
  { name: 'widget:canDelete', description: 'Supprimer un widget' },
  // DataSource
  { name: 'datasource:canView', description: 'Voir les sources de données' },
  { name: 'datasource:canCreate', description: 'Créer une source de données' },
  { name: 'datasource:canUpdate', description: 'Modifier une source de données' },
  { name: 'datasource:canDelete', description: 'Supprimer une source de données' },
  // Role
  { name: 'role:canView', description: 'Voir les rôles' },
  { name: 'role:canCreate', description: 'Créer un rôle' },
  { name: 'role:canUpdate', description: 'Modifier un rôle' },
  { name: 'role:canDelete', description: 'Supprimer un rôle' },
];

export async function initPermissions() {
  for (const perm of permissions) {
    await Permission.updateOne(
      { name: perm.name },
      { $set: perm },
      { upsert: true }
    );
  }
  console.log('Permissions initialisées.');
}

export async function initPermissionsAndRoles() {
  // Permissions
  await initPermissions();
  // Récupérer toutes les permissions
  const allPerms = await Permission.find({});
  // Permissions pour admin : toutes
  const adminPerms = allPerms.map(p => p._id);
  // Permissions pour user : tout sauf gestion des users et rôles
  const userPerms = allPerms.filter(p =>
    !p.name.startsWith('user:') && !p.name.startsWith('role:')
  ).map(p => p._id);
  // Crée ou met à jour le rôle admin
  await Role.updateOne(
    { name: 'admin' },
    { $set: { name: 'admin', description: 'Administrateur (tous droits)', permissions: adminPerms } },
    { upsert: true }
  );
  // Crée ou met à jour le rôle user
  await Role.updateOne(
    { name: 'user' },
    { $set: { name: 'user', description: 'Utilisateur standard', permissions: userPerms } },
    { upsert: true }
  );
  console.log('Rôles admin et user initialisés.');
  // Assigner le rôle admin à tous les utilisateurs existants (pour test)
  // const adminRole = await Role.findOne({ name: 'admin' });
  // if (adminRole) {
  //   const User = (await import('../models/User')).default;
  //   await User.updateMany({}, { $set: { roleId: adminRole._id } });
  //   console.log('Tous les utilisateurs existants ont reçu le rôle admin (test).');
  // }
}

// Pour usage programmatique (ex: dans index.ts)
// import { initPermissions } from './data/initPermissions';
// await initPermissions();
