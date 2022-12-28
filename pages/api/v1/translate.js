import langs from "../../../utils/languages";
import catchASync from "../../../utils/server/functions/catchASync";
import translatte from 'translatte';

const handler = catchASync(async (req, res, next) => {
  if (req.method !== "POST")
    return res
      .status(404)
      .json({ status: "failed", message: "resource not found" });
  
  
  let { text, from, to } = req.body;

  // check if text is provided
  if (!text)
    return res
      .status(400)
      .json({ status: "fail", message: "please include text to translate" });

  if (!from) from = "en";

  // return same text if no to field is provided
  if (!to)
    return res.json({
      status: "success",
      message: "text translated successfully",
      data: {
        text,
      },
    });

  // check if to field is valid
  if (langs.findIndex((lang) => lang[0] === to) === -1)
    return res
      .status(400)
      .json({ status: "fail", message: "invalid to field" });

  const result = await translatte(text, { from, to });

  return res.json({
    status: "success",
    message: "text translated successfully",
    data: {
      text: result.text,
    },
  });
});

module.exports = handler;
