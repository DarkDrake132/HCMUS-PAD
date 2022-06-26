export async function isAccountKYC(account) {
  let res = await fetch("/api/account/checkKYC", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          address: account
      }),
  })
  return res;
}