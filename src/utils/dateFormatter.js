function dateFormatter(date, type, text = '') {
  // 중복제거 & tolocalstring
  const base = `${new Date(date).toLocaleString('ko-kr')} ${text}`;
  if (type === 'created') {
    return base;
  }
  if (type === 'modified') {
    return ' ∙ ' + base;
  }
  return undefined;
}

export default dateFormatter;
