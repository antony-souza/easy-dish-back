export function generateAlphanumeric() {
  const randomStr = Math.random().toString(36).substring(2, 8);
  return randomStr
}
