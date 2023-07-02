const getTableNameByUserRole = (role) => {
  return role === 'pks' ? 'pabrikKelapaSawit' : role;
};

export default getTableNameByUserRole;
