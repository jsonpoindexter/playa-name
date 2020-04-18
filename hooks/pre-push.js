const {exec} = require('../util/exec');

const branchName = exec('git rev-parse --abbrev-ref HEAD', {trim: true});
if (branchName === 'master') {
    console.log('Deploying to firebase')
    exec('npm run deploy');
}


