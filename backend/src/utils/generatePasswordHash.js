// Script para generar hash de contraseñas
// Uso: node src/utils/generatePasswordHash.js <password>

const bcrypt = require('bcrypt');

const password = process.argv[2];

if (!password) {
  console.error('❌ Error: Debes proporcionar una contraseña');
  console.log('Uso: node src/utils/generatePasswordHash.js <password>');
  process.exit(1);
}

bcrypt.hash(password, 10)
  .then(hash => {
    console.log('✅ Hash generado:');
    console.log(hash);
    console.log('\n📋 Copia este hash y úsalo en el script SQL');
  })
  .catch(err => {
    console.error('❌ Error al generar hash:', err);
    process.exit(1);
  });

