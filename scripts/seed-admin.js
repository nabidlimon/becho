const fs = require('fs');
const bcrypt = require('bcryptjs');

const storePath = '.data/becho_store.json';
if (fs.existsSync(storePath)) {
  const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));
  const hash = bcrypt.hashSync('admin123', 10);
  store.users = [
    {
      id: 'user-admin-01',
      name: 'NanoLez Admin',
      email: 'admin@nanolez.tech',
      passwordHash: hash,
      avatarUrl: 'https://mbot.nanolez.tech/logo.svg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
  console.log('Successfully seeded admin user with hash:', hash);
} else {
  console.log('Store file does not exist');
}
