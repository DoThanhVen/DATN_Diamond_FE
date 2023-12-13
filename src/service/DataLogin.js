export const GetDataLogin = () => {
  const account = sessionStorage.getItem("accountLogin");
  if (account !== undefined) {
    try {
      const decodedString = decodeURIComponent(escape(atob(account)));
      const decodedObject = JSON.parse(decodedString);
      return decodedObject;
    } catch (error) {
      return null;
    }
  } else {
    return null;
  }
};
