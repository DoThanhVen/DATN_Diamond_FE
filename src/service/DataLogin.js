export const GetDataLogin = () => {
  const account = sessionStorage.getItem("accountLogin");

  if (account !== undefined) {
    try {
      const decodedCookie = decodeURIComponent(account);
      const decodedString = window.atob(decodedCookie);
      const parsedAccount = JSON.parse(decodedString);
      return parsedAccount;
    } catch (error) {
      return null;
    }
  }else{
    return null;
  }
};
