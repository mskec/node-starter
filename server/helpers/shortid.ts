/** Create a random string with the given length */
export default (length = 6) => {
  const charArr = [];
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1) {
    charArr.push(possible.charAt(Math.floor(Math.random() * possible.length)));
  }

  return charArr.join('');
};
