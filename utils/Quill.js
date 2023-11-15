export const deltaToPlainText = (delta) => {
  if (!delta || !delta.ops) {
    return '';
  }

  return delta.ops
    .map(op => {
      if (op.insert) return op.insert
      return '';
    })
    .join('');
}