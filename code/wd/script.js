function calculateCumulativeDistribution(arr1, arr2) {
  const uniqueValues = [...new Set([...arr1, ...arr2])];
  const frequencies1 = uniqueValues.map(value => {
    return arr1.filter(x => x === value).length
  });
  const frequencies2 = uniqueValues.map(value => {
    return arr2.filter(x => x === value).length
  });
  const cumulativeFrequencies1 = frequencies1.reduce((acc, val) => {
    if (acc.length === 0) {
      return [val];
    } else {
      return [...acc, acc[acc.length - 1] + val];
    }
  }, []);
  const cumulativeFrequencies2 = frequencies2.reduce((acc, val) => {
    if (acc.length === 0) {
      return [val];
    } else {
      return [...acc, acc[acc.length - 1] + val];
    }
  }, []);

  const distribution1 = uniqueValues.reduce((obj, value, index) => {
    obj[value] = cumulativeFrequencies1[index] / cumulativeFrequencies1[cumulativeFrequencies1.length - 1];
    return obj;
  }, {});
  const distribution2 = uniqueValues.reduce((obj, value, index) => {
    obj[value] = cumulativeFrequencies2[index] / cumulativeFrequencies2[cumulativeFrequencies2.length - 1];
    return obj;
  }, {});
  
  return [distribution1, distribution2];
}

// Example usage:
const arr1 = [1, 2, 3, 3, 4];
const arr2 = [2, 3, 3, 4, 5];
const [distribution1, distribution2] = calculateCumulativeDistribution(arr1, arr2);
console.log(distribution1);
console.log(distribution1);