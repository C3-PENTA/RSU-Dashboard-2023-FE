function changeKeyToKebab(obj: Record<string, any>): Record<string, any> {
  const kebabCaseObj: Record<string, any> = {};
  for (const key in obj) {
    const kebabCaseKey = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    kebabCaseObj[kebabCaseKey] = obj[key];
  }
  return kebabCaseObj;
}

export { changeKeyToKebab };
