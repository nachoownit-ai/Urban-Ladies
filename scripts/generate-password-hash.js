const bcrypt = require('bcryptjs');

// Uso: node generate-password-hash.js tu_contraseña

const password = process.argv[2];

if (!password) {
  console.log('❌ Error: Debes proporcionar una contraseña');
  console.log('Uso: node generate-password-hash.js tu_contraseña');
  process.exit(1);
}

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error:', err);
    process.exit(1);
  }

  console.log('✅ Hash generado:');
  console.log(hash);
  console.log('\nCopia este hash en tu SQL INSERT');
});
