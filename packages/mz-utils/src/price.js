export function convertPrice(value) {
  if (value === undefined || value === null) {
    value = 0;
  }
  let result = (Number(value) / 100).toFixed(2);
  if (result.split('.')[1] === '00') {
    result = result.split('.')[0];
  }
  return result;
}

export function redoPrice(value) {
  let a = Number(value) * Math.pow(10, 2);
  return Math.round(a);
}

export function converRate(value) {
  return value ? Number(value.toFixed(4)) : '';
}

export function priceConversion(value) {
  if (!value) return 0;
  return Math.round((Number(value) / 100) * Math.pow(10, 2)) / Math.pow(10, 2);
}

export function pricetoFix2Conversion(value) {
  if (!value) return `0.00`;
  let res =
    Math.round((Number(value) / 100) * Math.pow(10, 2)) / Math.pow(10, 2);
  return res.toFixed(2);
}
