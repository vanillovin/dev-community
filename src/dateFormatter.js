function dateFormatter(date, type, text = '') {
  if (type === 'created') {
    return `${date.split('T')[0]} ${date.split('T')[1].substring(0, 8)}${
      ' ' + text
    }`;
  }
  if (type === 'modified') {
    return ` ∙ ${date.split('T')[0]} ${date.split('T')[1].substring(0, 8)}${
      ' ' + text
    }`;
  }
}

export default dateFormatter;
