const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'node_modules', 'react-native-randombytes', 'android', 'build.gradle');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/compile /g, 'implementation ');
content = content.replace(/compileSdkVersion 23/g, 'compileSdkVersion 34');
content = content.replace(/buildToolsVersion "23.0.1"/g, 'buildToolsVersion "34.0.0"');
content = content.replace(/targetSdkVersion 23/g, 'targetSdkVersion 34');
content = content.replace(/minSdkVersion 16/g, 'minSdkVersion 21');

fs.writeFileSync(filePath, content);
console.log('Fixed react-native-randombytes');