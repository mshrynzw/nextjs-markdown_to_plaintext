export function getUserFullName(family_name: string, first_name: string) {
  return `${family_name} ${first_name}`;
}

export function getUserNameById(
  userId: string,
  users: Array<{ id: string; family_name: string; first_name: string }>
) {
  const user = users.find((u) => u.id === userId);
  return user ? getUserFullName(user.family_name, user.first_name) : userId;
}
