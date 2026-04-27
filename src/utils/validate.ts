export function validatePhone(
  phone: string,
): { valid: boolean; message: string } {
  if (!phone) {
    return { valid: false, message: '手机号不能为空' };
  }
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return { valid: false, message: '请输入正确的手机号' };
  }
  return { valid: true, message: '' };
}

export function validatePassword(
  pw: string,
): { valid: boolean; message: string } {
  if (!pw) {
    return { valid: false, message: '密码不能为空' };
  }
  if (pw.length < 6) {
    return { valid: false, message: '密码长度不能少于6位' };
  }
  return { valid: true, message: '' };
}

export function validateRequired(
  value: string,
  fieldName: string,
): { valid: boolean; message: string } {
  if (!value || value.trim().length === 0) {
    return { valid: false, message: `${fieldName}不能为空` };
  }
  return { valid: true, message: '' };
}

export function validatePositiveNumber(
  value: number,
  fieldName: string,
): { valid: boolean; message: string } {
  if (value === undefined || value === null || isNaN(value)) {
    return { valid: false, message: `${fieldName}必须为数字` };
  }
  if (value <= 0) {
    return { valid: false, message: `${fieldName}必须大于0` };
  }
  return { valid: true, message: '' };
}
