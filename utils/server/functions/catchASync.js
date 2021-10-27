const catchASync = (fn) => (req, res, next) =>
  fn(req, res, next).catch((error) => {
    console.log(error);
    return res.status(500).json({
      status: "fail",
      message: 'server error',
    });
  });  
 
module.exports = catchASync;
