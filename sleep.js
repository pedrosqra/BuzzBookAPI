const shell = require('shelljs');

const sleep = (seconds) => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

const main = async () => {
  const seconds = 1;
  if (process.platform === 'win32') {
    shell.exec(`timeout /t ${seconds} /nobreak`);
  } else {
    shell.exec(`sleep ${seconds}`);
  }
  await sleep(seconds);
  process.exit(0);
};

main();
