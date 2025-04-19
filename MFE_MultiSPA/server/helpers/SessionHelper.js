const axios = require("axios");

async function getSessionValidity(req) {
  let isSessionValid = false;
  try {
    const requestData = (await axios.get('http://localhost:3000/api/is-session-valid', {
        headers: {
          Cookie: req.headers.cookie || "",
        }
      })
    );
    isSessionValid = requestData.data.isValid;
  } catch (e) {
    console.error(e);
  }

  return isSessionValid;
}

module.exports = { getSessionValidity };
