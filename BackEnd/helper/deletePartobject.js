export function deletePartobject(user) {
  const value = user.toObject ? user.toObject() : user;
  return Object.fromEntries(
    ['_id', 'UserName', 'Name', 'Email', 'Country', 'ApiKey', 'createdAt']
      .filter((key) => value[key] !== undefined)
      .map((key) => [key, value[key]]),
  );
}
