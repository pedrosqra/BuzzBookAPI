const sleep = (seconds) => {
  return new Promise((resolve) =>
    setTimeout(resolve, seconds * 1000)
  );
};

const main = async () => {
  const seconds = 2;
  await sleep(seconds);
  process.exit(0);
};

main();
