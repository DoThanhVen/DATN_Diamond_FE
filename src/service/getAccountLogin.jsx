import Cookies from "js-cookie";

export default function getAccountFromCookie() {
  const accountCookie = Cookies.get("accountLogin");
  if (accountCookie !== undefined) {
    try {
      const data = JSON.parse(
        decodeURIComponent(escape(window.atob(accountCookie)))
      );
      return data;
    } catch (error) {
      console.error("Error parsing account data:", error);
      return null;
    }
  } else {
    return null;
  }
}
