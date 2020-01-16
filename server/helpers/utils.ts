
/**
 * Maps an array to an object based on key property of array item.
 * Array item should be an object
 */
function mapByKey(array, key = 'id') {
  const object = {};
  array.forEach(item => {
    if (!item || !item[key]) {
      return;
    }
    object[item[key]] = item;
  });
  return object;
}

export default {
  mapByKey,
};
