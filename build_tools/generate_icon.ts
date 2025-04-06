const {exec} = require('child_process');

function main() {
  console.log('generate icon start');
  exec(
    'yarn react-native-bootsplash generate src/assets/logo/logo.png --platforms=android,ios,web --background=F5FCFF --logo-width=100 --assets-output=assets/bootsplash ',
  );
  console.log('generate icon end');
}

main();
